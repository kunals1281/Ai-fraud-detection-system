package com.frauddetection.dto;

import com.frauddetection.model.AlertStatus;
import jakarta.validation.constraints.NotNull;

public class AlertResolutionRequest {

    @NotNull
    private AlertStatus status;

    private String resolutionNotes;
    private String resolvedBy = "User";

    public AlertResolutionRequest() {}

    public AlertStatus getStatus() { return status; }
    public void setStatus(AlertStatus status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
}
