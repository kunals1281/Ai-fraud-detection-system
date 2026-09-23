package com.frauddetection.dto;

public class AlgorithmUpdateRequest {
    private String feedbackNotes;
    private Double targetPrecision;
    private Double targetRecall;
    private String adminUser = "Admin";

    public AlgorithmUpdateRequest() {}

    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }

    public Double getTargetPrecision() { return targetPrecision; }
    public void setTargetPrecision(Double targetPrecision) { this.targetPrecision = targetPrecision; }

    public Double getTargetRecall() { return targetRecall; }
    public void setTargetRecall(Double targetRecall) { this.targetRecall = targetRecall; }

    public String getAdminUser() { return adminUser; }
    public void setAdminUser(String adminUser) { this.adminUser = adminUser; }
}
