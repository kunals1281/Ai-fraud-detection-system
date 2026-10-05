package com.frauddetection.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frauddetection.dto.TransactionRequest;
import com.frauddetection.dto.TransactionResponse;
import com.frauddetection.ml.AnomalyEvaluationResult;
import com.frauddetection.ml.ExplainableAiExplainer;
import com.frauddetection.model.*;
import com.frauddetection.repository.AlgorithmModelRepository;
import com.frauddetection.repository.FraudAlertRepository;
import com.frauddetection.repository.SystemConfigRepository;
import com.frauddetection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository alertRepository;
    private final SystemConfigRepository configRepository;
    private final AlgorithmModelRepository modelRepository;
    private final ExplainableAiExplainer explainer;
    private final ObjectMapper objectMapper;
    private final com.frauddetection.concurrency.ThreadSafeVelocityTracker velocityTracker;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository,
                              FraudAlertRepository alertRepository,
                              SystemConfigRepository configRepository,
                              AlgorithmModelRepository modelRepository,
                              ExplainableAiExplainer explainer,
                              ObjectMapper objectMapper,
                              com.frauddetection.concurrency.ThreadSafeVelocityTracker velocityTracker) {
        this.transactionRepository = transactionRepository;
        this.alertRepository = alertRepository;
        this.configRepository = configRepository;
        this.modelRepository = modelRepository;
        this.explainer = explainer;
        this.objectMapper = objectMapper;
        this.velocityTracker = velocityTracker;
    }

    @Transactional
    public TransactionResponse processTransaction(TransactionRequest request) {
        if (request == null || request.getUserId() == null || request.getAmount() == null) {
            throw new com.frauddetection.exception.InvalidTransactionException("Transaction payload must include valid userId and amount.");
        }
        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new com.frauddetection.exception.InvalidTransactionException("Transaction amount must be strictly greater than 0.");
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Fetch user history (most recent first)
        List<Transaction> userHistory = transactionRepository.findTop10ByUserIdOrderByTimestampDesc(request.getUserId());

        // 2. Fetch active system configuration and model
        SystemConfig config = configRepository.findByConfigKey("DEFAULT")
                .orElseGet(this::createDefaultConfig);

        AlgorithmModel model = modelRepository.findByIsActiveTrue()
                .orElse(null);

        // Record in high-throughput thread-safe sliding window tracker
        velocityTracker.recordAndGetVelocity(request.getUserId(), System.currentTimeMillis(), config.getVelocityWindowMinutes());

        // 3. Run AI Anomaly Evaluation
        AnomalyEvaluationResult evaluation = explainer.evaluate(
                request.getAmount(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLocationCity(),
                request.getLocationCountry(),
                request.getDeviceId(),
                now,
                userHistory,
                config,
                model
        );

        // 4. Persist Transaction
        Transaction tx = new Transaction();
        tx.setTransactionId("TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        tx.setUserId(request.getUserId());
        tx.setUserEmail(request.getUserEmail() != null ? request.getUserEmail() : request.getUserId() + "@bank.com");
        tx.setAmount(request.getAmount());
        tx.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        tx.setMerchantName(request.getMerchantName());
        tx.setMerchantCategory(request.getMerchantCategory() != null ? request.getMerchantCategory() : "General");
        tx.setLocationCity(request.getLocationCity() != null ? request.getLocationCity() : "New York");
        tx.setLocationCountry(request.getLocationCountry() != null ? request.getLocationCountry() : "US");
        tx.setLatitude(request.getLatitude());
        tx.setLongitude(request.getLongitude());
        tx.setIpAddress(request.getIpAddress() != null ? request.getIpAddress() : "127.0.0.1");
        tx.setDeviceId(request.getDeviceId() != null ? request.getDeviceId() : "DEV-WEB-" + UUID.randomUUID().toString().substring(0, 4));
        tx.setTimestamp(now);
        tx.setStatus(evaluation.getStatus());
        tx.setRiskScore(evaluation.getRiskScore());
        tx.setIsAnomaly(evaluation.isAnomaly());

        try {
            tx.setRiskFactorsJson(objectMapper.writeValueAsString(evaluation.getRiskFactors()));
        } catch (Exception e) {
            tx.setRiskFactorsJson("[]");
        }

        Transaction savedTx = transactionRepository.save(tx);

        // 5. If Suspicious or Blocked, generate FraudAlert for user & admin monitoring
        if (evaluation.getStatus() == TransactionStatus.BLOCKED || evaluation.getStatus() == TransactionStatus.SUSPICIOUS) {
            FraudAlert alert = new FraudAlert();
            alert.setAlertId("ALT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            alert.setTransactionId(savedTx.getTransactionId());
            alert.setUserId(savedTx.getUserId());
            alert.setAmount(savedTx.getAmount());
            alert.setCurrency(savedTx.getCurrency());
            alert.setMerchantName(savedTx.getMerchantName());
            alert.setRiskScore(evaluation.getRiskScore());
            alert.setReason(evaluation.getPrimaryReason());
            alert.setSeverity(evaluation.getStatus() == TransactionStatus.BLOCKED ? AlertSeverity.CRITICAL : AlertSeverity.HIGH);
            alert.setStatus(AlertStatus.PENDING_REVIEW);
            alert.setCreatedAt(now);
            alertRepository.save(alert);
        }

        // 6. Map to response
        TransactionResponse response = new TransactionResponse();
        response.setTransactionId(savedTx.getTransactionId());
        response.setUserId(savedTx.getUserId());
        response.setAmount(savedTx.getAmount());
        response.setCurrency(savedTx.getCurrency());
        response.setMerchantName(savedTx.getMerchantName());
        response.setMerchantCategory(savedTx.getMerchantCategory());
        response.setLocationCity(savedTx.getLocationCity());
        response.setLocationCountry(savedTx.getLocationCountry());
        response.setTimestamp(savedTx.getTimestamp());
        response.setStatus(savedTx.getStatus());
        response.setRiskScore(savedTx.getRiskScore());
        response.setIsAnomaly(savedTx.getIsAnomaly());
        response.setPrimaryReason(evaluation.getPrimaryReason());
        response.setRiskFactors(evaluation.getRiskFactors());
        response.setEvaluationTimeMs(evaluation.getEvaluationTimeMs());

        return response;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public List<Transaction> getTransactionsByUser(String userId) {
        return transactionRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Page<Transaction> getTransactionsByStatus(TransactionStatus status, int page, int size) {
        return transactionRepository.findByStatusOrderByTimestampDesc(status, PageRequest.of(page, size));
    }

    private SystemConfig createDefaultConfig() {
        SystemConfig config = new SystemConfig();
        config.setConfigKey("DEFAULT");
        config.setFlagRiskThreshold(40.0);
        config.setBlockRiskThreshold(75.0);
        config.setzScoreThreshold(2.5);
        config.setMaxVelocityTransactions(4);
        config.setVelocityWindowMinutes(10);
        config.setMaxTravelSpeedKmH(800.0);
        config.setAutoBlockEnabled(true);
        config.setUpdatedAt(LocalDateTime.now());
        config.setUpdatedBy("SYSTEM");
        return configRepository.save(config);
    }
}
