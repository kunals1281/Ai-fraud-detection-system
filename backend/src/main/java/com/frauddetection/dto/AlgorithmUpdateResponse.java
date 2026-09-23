package com.frauddetection.dto;

import com.frauddetection.model.AlgorithmModel;
import java.time.LocalDateTime;

public class AlgorithmUpdateResponse {

    private String message;
    private boolean success;
    private AlgorithmModel updatedModel;
    private LocalDateTime timestamp;

    public AlgorithmUpdateResponse() {}

    public AlgorithmUpdateResponse(String message, boolean success, AlgorithmModel updatedModel) {
        this.message = message;
        this.success = success;
        this.updatedModel = updatedModel;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public AlgorithmModel getUpdatedModel() { return updatedModel; }
    public void setUpdatedModel(AlgorithmModel updatedModel) { this.updatedModel = updatedModel; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
