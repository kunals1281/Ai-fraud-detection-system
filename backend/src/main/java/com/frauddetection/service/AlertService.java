package com.frauddetection.service;

import com.frauddetection.dto.AlertResolutionRequest;
import com.frauddetection.model.AlertStatus;
import com.frauddetection.model.AuditLog;
import com.frauddetection.model.FraudAlert;
import com.frauddetection.repository.AuditLogRepository;
import com.frauddetection.repository.FraudAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final FraudAlertRepository alertRepository;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AlertService(FraudAlertRepository alertRepository, AuditLogRepository auditLogRepository) {
        this.alertRepository = alertRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<FraudAlert> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<FraudAlert> getAlertsByUser(String userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<FraudAlert> getPendingAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.PENDING_REVIEW);
    }

    @Transactional
    public FraudAlert resolveAlert(String alertId, AlertResolutionRequest request) {
        FraudAlert alert = alertRepository.findByAlertId(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with ID: " + alertId));

        alert.setStatus(request.getStatus());
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(request.getResolvedBy());
        FraudAlert saved = alertRepository.save(alert);

        auditLogRepository.save(new AuditLog(
                "ALERT_RESOLVED",
                request.getResolvedBy(),
                String.format("Alert %s resolved as %s. Notes: %s",
                        alertId, request.getStatus(), request.getResolutionNotes())
        ));

        return saved;
    }
}
