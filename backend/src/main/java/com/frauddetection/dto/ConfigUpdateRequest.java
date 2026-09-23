package com.frauddetection.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class ConfigUpdateRequest {

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("100.0")
    private Double flagRiskThreshold;

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("100.0")
    private Double blockRiskThreshold;

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("6.0")
    private Double zScoreThreshold;

    @NotNull
    private Integer maxVelocityTransactions;

    @NotNull
    private Integer velocityWindowMinutes;

    @NotNull
    private Double maxTravelSpeedKmH;

    @NotNull
    private Boolean autoBlockEnabled;

    private String updatedBy = "Admin";

    public ConfigUpdateRequest() {}

    public Double getFlagRiskThreshold() { return flagRiskThreshold; }
    public void setFlagRiskThreshold(Double flagRiskThreshold) { this.flagRiskThreshold = flagRiskThreshold; }

    public Double getBlockRiskThreshold() { return blockRiskThreshold; }
    public void setBlockRiskThreshold(Double blockRiskThreshold) { this.blockRiskThreshold = blockRiskThreshold; }

    public Double getzScoreThreshold() { return zScoreThreshold; }
    public void setzScoreThreshold(Double zScoreThreshold) { this.zScoreThreshold = zScoreThreshold; }

    public Integer getMaxVelocityTransactions() { return maxVelocityTransactions; }
    public void setMaxVelocityTransactions(Integer maxVelocityTransactions) { this.maxVelocityTransactions = maxVelocityTransactions; }

    public Integer getVelocityWindowMinutes() { return velocityWindowMinutes; }
    public void setVelocityWindowMinutes(Integer velocityWindowMinutes) { this.velocityWindowMinutes = velocityWindowMinutes; }

    public Double getMaxTravelSpeedKmH() { return maxTravelSpeedKmH; }
    public void setMaxTravelSpeedKmH(Double maxTravelSpeedKmH) { this.maxTravelSpeedKmH = maxTravelSpeedKmH; }

    public Boolean getAutoBlockEnabled() { return autoBlockEnabled; }
    public void setAutoBlockEnabled(Boolean autoBlockEnabled) { this.autoBlockEnabled = autoBlockEnabled; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
