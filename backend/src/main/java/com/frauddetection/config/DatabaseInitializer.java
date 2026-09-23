package com.frauddetection.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.model.*;
import com.frauddetection.repository.AlgorithmModelRepository;
import com.frauddetection.repository.FraudAlertRepository;
import com.frauddetection.repository.SystemConfigRepository;
import com.frauddetection.repository.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final SystemConfigRepository configRepository;
    private final AlgorithmModelRepository modelRepository;
    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository alertRepository;
    private final ObjectMapper objectMapper;

    public DatabaseInitializer(SystemConfigRepository configRepository,
                               AlgorithmModelRepository modelRepository,
                               TransactionRepository transactionRepository,
                               FraudAlertRepository alertRepository,
                               ObjectMapper objectMapper) {
        this.configRepository = configRepository;
        this.modelRepository = modelRepository;
        this.transactionRepository = transactionRepository;
        this.alertRepository = alertRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed System Configuration
        if (configRepository.findByConfigKey("DEFAULT").isEmpty()) {
            SystemConfig config = new SystemConfig();
            config.setConfigKey("DEFAULT");
            config.setFlagRiskThreshold(40.0);
            config.setBlockRiskThreshold(75.0);
            config.setzScoreThreshold(2.5);
            config.setMaxVelocityTransactions(4);
            config.setVelocityWindowMinutes(10);
            config.setMaxTravelSpeedKmH(800.0);
            config.setAutoBlockEnabled(true);
            config.setUpdatedAt(LocalDateTime.now().minusDays(2));
            config.setUpdatedBy("Admin_SecOps");
            configRepository.save(config);
        }

        // 2. Seed Algorithm Model
        if (modelRepository.findByIsActiveTrue().isEmpty()) {
            AlgorithmModel model = new AlgorithmModel();
            model.setModelName("NeuroShield Ensemble Anomaly Detector");
            model.setVersion("v2.1");
            model.setPrecisionScore(0.965);
            model.setRecallScore(0.942);
            model.setF1Score(0.953);
            model.setRocAucScore(0.978);
            model.setTotalEvaluations(1420L);
            model.setTruePositives(118L);
            model.setFalsePositives(4L);
            model.setTrueNegatives(1292L);
            model.setFalseNegatives(6L);
            model.setAmountAnomalyWeight(0.35);
            model.setVelocityWeight(0.25);
            model.setGeoVelocityWeight(0.25);
            model.setDeviceMismatchWeight(0.15);
            model.setIsActive(true);
            model.setUpdatedAt(LocalDateTime.now().minusHours(12));
            model.setNotes("Production calibrated weights for high-throughput banking channels.");
            modelRepository.save(model);
        }

        // 3. Seed Transactions if empty
        if (transactionRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();

            // Baseline Safe Transactions for Demo User
            createTx("TX-8801", "USR-9821", "kunal@fintech.io", new BigDecimal("45.50"), "USD",
                    "Blue Bottle Coffee", "Food & Beverage", "San Francisco", "US", 37.7749, -122.4194,
                    "192.168.1.10", "DEV-MAC-KUNAL", now.minusHours(24), TransactionStatus.APPROVED, 12.0, false, null);

            createTx("TX-8802", "USR-9821", "kunal@fintech.io", new BigDecimal("120.00"), "USD",
                    "Whole Foods Market", "Groceries", "San Francisco", "US", 37.7790, -122.4150,
                    "192.168.1.10", "DEV-MAC-KUNAL", now.minusHours(18), TransactionStatus.APPROVED, 14.5, false, null);

            createTx("TX-8803", "USR-9821", "kunal@fintech.io", new BigDecimal("18.99"), "USD",
                    "Uber Technologies", "Transportation", "San Francisco", "US", 37.7740, -122.4200,
                    "192.168.1.10", "DEV-MAC-KUNAL", now.minusHours(12), TransactionStatus.APPROVED, 8.0, false, null);

            createTx("TX-8804", "USR-9821", "kunal@fintech.io", new BigDecimal("85.20"), "USD",
                    "Amazon Cloud Services", "Technology", "San Francisco", "US", 37.7749, -122.4194,
                    "192.168.1.10", "DEV-MAC-KUNAL", now.minusHours(6), TransactionStatus.APPROVED, 10.0, false, null);

            // Fraud Case 1: Severe Amount Spike + Foreign IP
            List<RiskFactor> factors1 = List.of(
                    new RiskFactor("Amount Outlier (Z-Score)", 32.5, "Severe Amount Spike: $9,450.00 is 5.2σ above user mean of $67.42", true),
                    new RiskFactor("Device & Environment Anomaly", 14.0, "High-risk jurisdiction (KY). Unrecognized Device Fingerprint.", true),
                    new RiskFactor("Velocity Burst", 3.0, "Normal velocity: 1 transaction(s) in 10 minutes window", false),
                    new RiskFactor("Impossible Travel (Geo-Velocity)", 38.0, "Impossible Travel: 5,200 km from San Francisco to George Town in 1 hour", true)
            );
            Transaction txFraud1 = createTx("TX-9901", "USR-9821", "kunal@fintech.io", new BigDecimal("9450.00"), "USD",
                    "Offshore Crypto Liquidity Ltd", "Cryptocurrency", "George Town", "KY", 19.2869, -81.3674,
                    "197.234.12.88", "DEV-WIN-UNKNOWN-99", now.minusHours(2), TransactionStatus.BLOCKED, 87.5, true, factors1);

            createAlert("ALT-1001", txFraud1.getTransactionId(), "USR-9821", txFraud1.getAmount(),
                    txFraud1.getMerchantName(), 87.5, "Severe Amount Spike & Impossible Travel: 5,200 km in 1 hr",
                    AlertSeverity.CRITICAL, AlertStatus.PENDING_REVIEW, now.minusHours(2));

            // Fraud Case 2: Suspicious Travel Alert (Paris to New York in 25 min)
            List<RiskFactor> factors2 = List.of(
                    new RiskFactor("Impossible Travel (Geo-Velocity)", 42.0, "Impossible Travel: 5,830 km traveled from Paris to New York in 25 mins (13,992 km/h)", true),
                    new RiskFactor("Amount Outlier (Z-Score)", 18.0, "Moderate amount increase: $1,280.00 (2.1σ above mean)", true),
                    new RiskFactor("Velocity Burst", 4.0, "Normal velocity: 1 transaction(s) in 10 minutes", false),
                    new RiskFactor("Device & Environment Anomaly", 8.0, "Unrecognized Device Fingerprint.", true)
            );
            Transaction txFraud2 = createTx("TX-9902", "USR-4412", "sarah.j@enterprise.com", new BigDecimal("1280.00"), "USD",
                    "Luxury Electronics Manhattan", "Electronics", "New York", "US", 40.7128, -74.0060,
                    "104.28.21.90", "DEV-IPHONE-15", now.minusHours(4), TransactionStatus.SUSPICIOUS, 72.0, true, factors2);

            createAlert("ALT-1002", txFraud2.getTransactionId(), "USR-4412", txFraud2.getAmount(),
                    txFraud2.getMerchantName(), 72.0, "Impossible Travel velocity: 5,830 km in 25 mins",
                    AlertSeverity.HIGH, AlertStatus.PENDING_REVIEW, now.minusHours(4));

            // Fraud Case 3: Rapid Carding Bot Attack
            List<RiskFactor> factors3 = List.of(
                    new RiskFactor("Velocity Burst", 45.0, "Critical Carding/Bot Velocity: 6 transactions in under 60 seconds", true),
                    new RiskFactor("Device & Environment Anomaly", 25.0, "Automated Headless Browser Fingerprint detected", true),
                    new RiskFactor("Amount Outlier (Z-Score)", 10.0, "Micro-probing charge ($1.99)", false),
                    new RiskFactor("Impossible Travel (Geo-Velocity)", 5.0, "Location consistent", false)
            );
            Transaction txFraud3 = createTx("TX-9903", "USR-2091", "bot.target@gmail.com", new BigDecimal("1.99"), "USD",
                    "Digital Gift Card Depot", "Digital Goods", "Lagos", "NG", 6.5244, 3.3792,
                    "41.203.77.102", "DEV-AUTOMATED-RUNNER", now.minusMinutes(45), TransactionStatus.BLOCKED, 85.0, true, factors3);

            createAlert("ALT-1003", txFraud3.getTransactionId(), "USR-2091", txFraud3.getAmount(),
                    txFraud3.getMerchantName(), 85.0, "Automated card testing bot pattern detected",
                    AlertSeverity.CRITICAL, AlertStatus.CONFIRMED_FRAUD, now.minusMinutes(45));

            // Safe Transactions for other users
            createTx("TX-8805", "USR-3301", "alex@fintech.io", new BigDecimal("320.00"), "USD",
                    "Delta Air Lines", "Travel", "Atlanta", "US", 33.7490, -84.3880,
                    "72.21.196.65", "DEV-CHROME-OS", now.minusHours(8), TransactionStatus.APPROVED, 18.0, false, null);

            createTx("TX-8806", "USR-5510", "elena@crypto.de", new BigDecimal("64.00"), "EUR",
                    "Berlin Bistro Central", "Dining", "Berlin", "DE", 52.5200, 13.4050,
                    "84.115.12.3", "DEV-ANDROID-S23", now.minusHours(3), TransactionStatus.APPROVED, 15.0, false, null);
        }
    }

    private Transaction createTx(String txId, String userId, String email, BigDecimal amount, String currency,
                                 String merchant, String category, String city, String country,
                                 Double lat, Double lon, String ip, String deviceId,
                                 LocalDateTime timestamp, TransactionStatus status, Double riskScore,
                                 boolean isAnomaly, List<RiskFactor> factors) {
        Transaction tx = new Transaction();
        tx.setTransactionId(txId);
        tx.setUserId(userId);
        tx.setUserEmail(email);
        tx.setAmount(amount);
        tx.setCurrency(currency);
        tx.setMerchantName(merchant);
        tx.setMerchantCategory(category);
        tx.setLocationCity(city);
        tx.setLocationCountry(country);
        tx.setLatitude(lat);
        tx.setLongitude(lon);
        tx.setIpAddress(ip);
        tx.setDeviceId(deviceId);
        tx.setTimestamp(timestamp);
        tx.setStatus(status);
        tx.setRiskScore(riskScore);
        tx.setIsAnomaly(isAnomaly);

        if (factors == null) {
            factors = List.of(
                    new RiskFactor("Amount Outlier (Z-Score)", 3.0, "Transaction amount within normal baseline", false),
                    new RiskFactor("Velocity Burst", 2.0, "Normal cadence", false),
                    new RiskFactor("Impossible Travel (Geo-Velocity)", 2.0, "Location verified", false),
                    new RiskFactor("Device & Environment Anomaly", 2.0, "Trusted device", false)
            );
        }
        try {
            tx.setRiskFactorsJson(objectMapper.writeValueAsString(factors));
        } catch (Exception ignored) {}

        return transactionRepository.save(tx);
    }

    private void createAlert(String alertId, String txId, String userId, BigDecimal amount,
                             String merchant, Double riskScore, String reason,
                             AlertSeverity severity, AlertStatus status, LocalDateTime createdAt) {
        FraudAlert alert = new FraudAlert();
        alert.setAlertId(alertId);
        alert.setTransactionId(txId);
        alert.setUserId(userId);
        alert.setAmount(amount);
        alert.setCurrency("USD");
        alert.setMerchantName(merchant);
        alert.setRiskScore(riskScore);
        alert.setReason(reason);
        alert.setSeverity(severity);
        alert.setStatus(status);
        alert.setCreatedAt(createdAt);
        alertRepository.save(alert);
    }
}
