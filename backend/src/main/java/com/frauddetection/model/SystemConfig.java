package com.frauddetection.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_configs")
public class SystemConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String configKey;

    @Column(nullable = false)
    private Double flagRiskThreshold; // default 40.0

    @Column(nullable = false)
    private Double blockRiskThreshold; // default 75.0

    @Column(nullable = false)
    private Double zScoreThreshold; // default 2.5 standard deviations

    @Column(nullable = false)
    private Integer maxVelocityTransactions; // e.g., 4 transactions

    @Column(nullable = false)
    private Integer velocityWindowMinutes; // e.g., 10 minutes

    @Column(nullable = false)
    private Double maxTravelSpeedKmH; // e.g., 800 km/h (impossible travel)

    @Column(nullable = false)
    private Boolean autoBlockEnabled;

    private LocalDateTime updatedAt;
    private String updatedBy;

    public SystemConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConfigKey() { return configKey; }
    public void setConfigKey(String configKey) { this.configKey = configKey; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
