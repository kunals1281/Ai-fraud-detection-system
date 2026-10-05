package com.frauddetection.core.detector;

import com.frauddetection.core.AbstractFraudDetector;
import com.frauddetection.core.TransactionContext;
import com.frauddetection.ml.GeolocationVelocityEngine;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Concrete Polymorphic Detector for Haversine Geo-Velocity and Impossible Travel.
 * Demonstrates OOP Polymorphism & Inheritance.
 */
@Component
public class GeolocationTravelDetector extends AbstractFraudDetector {

    private final GeolocationVelocityEngine geoEngine;

    public GeolocationTravelDetector(GeolocationVelocityEngine geoEngine) {
        super("Impossible Travel (Geo-Velocity)", 0.25);
        this.geoEngine = geoEngine;
    }

    @Override
    protected RiskFactor doEvaluate(TransactionContext<?> context) throws Exception {
        Transaction tx = context.getCurrentTransaction();
        SystemConfig config = context.getSystemConfig();
        List<Transaction> history = context.getUserHistory();
        Transaction lastTx = (history != null && !history.isEmpty()) ? history.get(0) : null;

        GeolocationVelocityEngine.GeoResult res = geoEngine.evaluateTravelSpeed(
                tx.getLatitude(),
                tx.getLongitude(),
                tx.getLocationCity(),
                tx.getLocationCountry(),
                lastTx,
                tx.getTimestamp(),
                config.getMaxTravelSpeedKmH()
        );
        return new RiskFactor(getDetectorName(), res.riskScore, res.rationale, res.isImpossibleTravel);
    }
}
