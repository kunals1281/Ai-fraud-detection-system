package com.frauddetection.dto;

import com.frauddetection.model.SystemConfig;
import java.time.LocalDateTime;

public class ConfigResponse {

    private String message;
    private boolean success;
    private SystemConfig config;
    private LocalDateTime timestamp;

    public ConfigResponse() {}

    public ConfigResponse(String message, boolean success, SystemConfig config) {
        this.message = message;
        this.success = success;
        this.config = config;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public SystemConfig getConfig() { return config; }
    public void setConfig(SystemConfig config) { this.config = config; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
