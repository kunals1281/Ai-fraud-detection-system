package com.frauddetection.ml;

import com.frauddetection.model.AlgorithmModel;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class ExplainableAiExplainer {

    private final StatisticalZScorer zScorer;
    private final VelocityRuleEngine velocityEngine;
    private final GeolocationVelocityEngine geoVelocityEngine;
    private final IsolationForestScorer isolationScorer;

    @Autowired
    public ExplainableAiExplainer(StatisticalZScorer zScorer,
                                  VelocityRuleEngine velocityEngine,
                                  GeolocationVelocityEngine geoVelocityEngine,
                                  IsolationForestScorer isolationScorer) {
        this.zScorer = zScorer;
        this.velocityEngine = velocityEngine;
        this.geoVelocityEngine = geoVelocityEngine;
        this.isolationScorer = isolationScorer;
    }

    public AnomalyEvaluationResult evaluate(
            BigDecimal amount,
            Double latitude,
            Double longitude,
            String city,
            String country,
            String deviceId,
            LocalDateTime timestamp,
            List<Transaction> userHistory,
            SystemConfig config,
            AlgorithmModel model) {

        long startTime = System.currentTimeMillis();

        // 1. Amount Z-Score
        StatisticalZScorer.ZScoreResult zResult = zScorer.evaluateAmount(
                amount, userHistory, config.getzScoreThreshold());

        // 2. Velocity
        VelocityRuleEngine.VelocityResult velResult = velocityEngine.evaluateVelocity(
                userHistory, timestamp, config.getMaxVelocityTransactions(), config.getVelocityWindowMinutes());

        // 3. Geolocation Travel Velocity
        Transaction lastTx = (userHistory != null && !userHistory.isEmpty()) ? userHistory.get(0) : null;
        GeolocationVelocityEngine.GeoResult geoResult = geoVelocityEngine.evaluateTravelSpeed(
                latitude, longitude, city, country, lastTx, timestamp, config.getMaxTravelSpeedKmH());

        // 4. Device and Environment
        IsolationForestScorer.DeviceRiskResult devResult = isolationScorer.evaluateDeviceAndEnvironment(
                deviceId, country, timestamp, userHistory);

        // Fetch weights from active model or fallback defaults
        double wAmount = model != null ? model.getAmountAnomalyWeight() : 0.35;
        double wVel = model != null ? model.getVelocityWeight() : 0.25;
        double wGeo = model != null ? model.getGeoVelocityWeight() : 0.25;
        double wDev = model != null ? model.getDeviceMismatchWeight() : 0.15;

        // Weighted Composite Score
        double compositeScore = (wAmount * zResult.riskScore) +
                                (wVel * velResult.riskScore) +
                                (wGeo * geoResult.riskScore) +
                                (wDev * devResult.riskScore);

        // Anomaly Escalation: Critical rule breaches elevate risk floor
        if (geoResult.isImpossibleTravel) {
            compositeScore = Math.max(compositeScore, 85.0);
        }
        if (velResult.isVelocityAnomaly) {
            compositeScore = Math.max(compositeScore, 80.0);
        }
        if (zResult.isOutlier) {
            compositeScore = Math.max(compositeScore, 75.0);
        }

        // Cap at 100
        compositeScore = Math.min(100.0, Math.max(0.0, Math.round(compositeScore * 10.0) / 10.0));

        // Build Explainable AI (XAI) Risk Factors
        List<RiskFactor> factors = new ArrayList<>();
        factors.add(new RiskFactor(
                "Amount Outlier (Z-Score)",
                Math.round(wAmount * zResult.riskScore * 10.0) / 10.0,
                zResult.rationale,
                zResult.isOutlier
        ));
        factors.add(new RiskFactor(
                "Velocity Burst",
                Math.round(wVel * velResult.riskScore * 10.0) / 10.0,
                velResult.rationale,
                velResult.isVelocityAnomaly
        ));
        factors.add(new RiskFactor(
                "Impossible Travel (Geo-Velocity)",
                Math.round(wGeo * geoResult.riskScore * 10.0) / 10.0,
                geoResult.rationale,
                geoResult.isImpossibleTravel
        ));
        factors.add(new RiskFactor(
                "Device & Environment Anomaly",
                Math.round(wDev * devResult.riskScore * 10.0) / 10.0,
                devResult.rationale,
                devResult.isNewDevice
        ));

        // Determine Status based on Admin Configured Thresholds
        TransactionStatus status;
        boolean isAnomaly = false;
        String primaryReason = "Normal transaction pattern";

        if (config.getAutoBlockEnabled() && compositeScore >= config.getBlockRiskThreshold()) {
            status = TransactionStatus.BLOCKED;
            isAnomaly = true;
            primaryReason = findPrimaryReason(zResult, velResult, geoResult, devResult);
        } else if (compositeScore >= config.getFlagRiskThreshold()) {
            status = TransactionStatus.SUSPICIOUS;
            isAnomaly = true;
            primaryReason = findPrimaryReason(zResult, velResult, geoResult, devResult);
        } else {
            status = TransactionStatus.APPROVED;
        }

        long elapsed = System.currentTimeMillis() - startTime;
        return new AnomalyEvaluationResult(compositeScore, isAnomaly, status, primaryReason, factors, Math.max(1, elapsed));
    }

    private String findPrimaryReason(StatisticalZScorer.ZScoreResult z,
                                     VelocityRuleEngine.VelocityResult v,
                                     GeolocationVelocityEngine.GeoResult g,
                                     IsolationForestScorer.DeviceRiskResult d) {
        if (g.isImpossibleTravel) return g.rationale;
        if (v.isVelocityAnomaly) return v.rationale;
        if (z.isOutlier) return z.rationale;
        if (d.riskScore > 50) return d.rationale;
        return "Aggregated multi-factor anomaly signals exceed risk threshold";
    }
}
