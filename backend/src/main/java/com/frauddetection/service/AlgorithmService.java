package com.frauddetection.service;

import com.frauddetection.dto.AlgorithmUpdateRequest;
import com.frauddetection.dto.AlgorithmUpdateResponse;
import com.frauddetection.ml.ModelRetrainer;
import com.frauddetection.model.AlgorithmModel;
import com.frauddetection.model.AuditLog;
import com.frauddetection.repository.AlgorithmModelRepository;
import com.frauddetection.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlgorithmService {

    private final AlgorithmModelRepository modelRepository;
    private final ModelRetrainer modelRetrainer;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AlgorithmService(AlgorithmModelRepository modelRepository,
                            ModelRetrainer modelRetrainer,
                            AuditLogRepository auditLogRepository) {
        this.modelRepository = modelRepository;
        this.modelRetrainer = modelRetrainer;
        this.auditLogRepository = auditLogRepository;
    }

    public AlgorithmModel getActiveAlgorithmModel() {
        return modelRepository.findByIsActiveTrue()
                .orElseGet(() -> modelRetrainer.retrainModel("Initial active baseline model setup."));
    }

    public List<AlgorithmModel> getAllModelVersions() {
        return modelRepository.findAll();
    }

    public AlgorithmUpdateResponse retrainAlgorithm(AlgorithmUpdateRequest request) {
        AlgorithmModel updated = modelRetrainer.retrainModel(request.getFeedbackNotes());

        auditLogRepository.save(new AuditLog(
                "ALGORITHM_REFINED",
                request.getAdminUser() != null ? request.getAdminUser() : "Admin",
                String.format("Algorithm updated to version %s (Precision: %.1f%%, Recall: %.1f%%, F1: %.1f%%)",
                        updated.getVersion(),
                        updated.getPrecisionScore() * 100,
                        updated.getRecallScore() * 100,
                        updated.getF1Score() * 100)
        ));

        return new AlgorithmUpdateResponse(
                "Fraud detection algorithm model successfully refined and calibrated to version " + updated.getVersion(),
                true,
                updated
        );
    }
}
