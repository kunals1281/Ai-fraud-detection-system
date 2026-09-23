package com.frauddetection.service;

import com.frauddetection.dto.ConfigResponse;
import com.frauddetection.dto.ConfigUpdateRequest;
import com.frauddetection.dto.DetectionReportDto;
import com.frauddetection.model.AlertStatus;
import com.frauddetection.model.AuditLog;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import com.frauddetection.repository.AuditLogRepository;
import com.frauddetection.repository.FraudAlertRepository;
import com.frauddetection.repository.SystemConfigRepository;
import com.frauddetection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final SystemConfigRepository configRepository;
    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository alertRepository;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AdminService(SystemConfigRepository configRepository,
                        TransactionRepository transactionRepository,
                        FraudAlertRepository alertRepository,
                        AuditLogRepository auditLogRepository) {
        this.configRepository = configRepository;
        this.transactionRepository = transactionRepository;
        this.alertRepository = alertRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public SystemConfig getSystemConfig() {
        return configRepository.findByConfigKey("DEFAULT")
                .orElseGet(() -> {
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
                });
    }

    @Transactional
    public ConfigResponse updateSystemConfig(ConfigUpdateRequest request) {
        SystemConfig config = getSystemConfig();

        config.setFlagRiskThreshold(request.getFlagRiskThreshold());
        config.setBlockRiskThreshold(request.getBlockRiskThreshold());
        config.setzScoreThreshold(request.getzScoreThreshold());
        config.setMaxVelocityTransactions(request.getMaxVelocityTransactions());
        config.setVelocityWindowMinutes(request.getVelocityWindowMinutes());
        config.setMaxTravelSpeedKmH(request.getMaxTravelSpeedKmH());
        config.setAutoBlockEnabled(request.getAutoBlockEnabled());
        config.setUpdatedAt(LocalDateTime.now());
        config.setUpdatedBy(request.getUpdatedBy() != null ? request.getUpdatedBy() : "Admin");

        SystemConfig updated = configRepository.save(config);

        auditLogRepository.save(new AuditLog(
                "SYSTEM_CONFIG_UPDATED",
                config.getUpdatedBy(),
                String.format("Updated detection thresholds: Flag=%.1f, Block=%.1f, Z=%.1f, MaxVel=%d, TravelSpeed=%.0f km/h",
                        config.getFlagRiskThreshold(), config.getBlockRiskThreshold(),
                        config.getzScoreThreshold(), config.getMaxVelocityTransactions(),
                        config.getMaxTravelSpeedKmH())
        ));

        return new ConfigResponse(
                "System configuration updated successfully. New detection thresholds applied to live transaction stream.",
                true,
                updated
        );
    }

    public DetectionReportDto generateDetectionReport() {
        List<Transaction> all = transactionRepository.findAll();

        long total = all.size();
        long fraud = transactionRepository.countByStatus(TransactionStatus.BLOCKED);
        long suspicious = transactionRepository.countByStatus(TransactionStatus.SUSPICIOUS);
        long approved = transactionRepository.countByStatus(TransactionStatus.APPROVED);

        double fraudRate = total > 0 ? ((double) (fraud + suspicious) / total) * 100.0 : 0.0;
        fraudRate = Math.round(fraudRate * 10.0) / 10.0;

        BigDecimal totalProcessed = BigDecimal.ZERO;
        BigDecimal totalBlocked = BigDecimal.ZERO;

        Map<String, Long> categoryCount = new HashMap<>();
        Map<String, Long> countryCount = new HashMap<>();

        for (Transaction t : all) {
            totalProcessed = totalProcessed.add(t.getAmount());
            if (t.getStatus() == TransactionStatus.BLOCKED || t.getStatus() == TransactionStatus.SUSPICIOUS) {
                totalBlocked = totalBlocked.add(t.getAmount());

                String cat = t.getMerchantCategory() != null ? t.getMerchantCategory() : "Other";
                categoryCount.put(cat, categoryCount.getOrDefault(cat, 0L) + 1);

                String ctry = t.getLocationCountry() != null ? t.getLocationCountry() : "Unknown";
                countryCount.put(ctry, countryCount.getOrDefault(ctry, 0L) + 1);
            }
        }

        List<Transaction> flaggedRecent = transactionRepository.findByStatusOrderByTimestampDesc(
                TransactionStatus.BLOCKED, PageRequest.of(0, 10)).getContent();

        DetectionReportDto report = new DetectionReportDto();
        report.setTotalTransactions(total);
        report.setTotalFraudCases(fraud);
        report.setTotalSuspiciousCases(suspicious);
        report.setTotalApprovedCases(approved);
        report.setFraudRatePercent(fraudRate);
        report.setTotalProcessedAmount(totalProcessed);
        report.setTotalBlockedAmount(totalBlocked);
        report.setCasesByCategory(categoryCount);
        report.setCasesByCountry(countryCount);
        report.setRecentFlaggedTransactions(flaggedRecent);
        report.setPendingAlerts(alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.PENDING_REVIEW));

        return report;
    }
}
