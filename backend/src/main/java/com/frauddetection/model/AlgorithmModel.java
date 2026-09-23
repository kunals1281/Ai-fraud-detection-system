package com.frauddetection.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "algorithm_models")
public class AlgorithmModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modelName;

    @Column(nullable = false)
    private String version;

    private Double precisionScore;
    private Double recallScore;
    private Double f1Score;
    private Double rocAucScore;

    private Long totalEvaluations;
    private Long truePositives;
    private Long falsePositives;
    private Long trueNegatives;
    private Long falseNegatives;

    // Feature Weights (calibrated via active learning & retraining)
    private Double amountAnomalyWeight;     // e.g. 0.35
    private Double velocityWeight;          // e.g. 0.25
    private Double geoVelocityWeight;       // e.g. 0.25
    private Double deviceMismatchWeight;     // e.g. 0.15

    private Boolean isActive;
    private LocalDateTime updatedAt;
    private String notes;

    public AlgorithmModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public Double getPrecisionScore() { return precisionScore; }
    public void setPrecisionScore(Double precisionScore) { this.precisionScore = precisionScore; }

    public Double getRecallScore() { return recallScore; }
    public void setRecallScore(Double recallScore) { this.recallScore = recallScore; }

    public Double getF1Score() { return f1Score; }
    public void setF1Score(Double f1Score) { this.f1Score = f1Score; }

    public Double getRocAucScore() { return rocAucScore; }
    public void setRocAucScore(Double rocAucScore) { this.rocAucScore = rocAucScore; }

    public Long getTotalEvaluations() { return totalEvaluations; }
    public void setTotalEvaluations(Long totalEvaluations) { this.totalEvaluations = totalEvaluations; }

    public Long getTruePositives() { return truePositives; }
    public void setTruePositives(Long truePositives) { this.truePositives = truePositives; }

    public Long getFalsePositives() { return falsePositives; }
    public void setFalsePositives(Long falsePositives) { this.falsePositives = falsePositives; }

    public Long getTrueNegatives() { return trueNegatives; }
    public void setTrueNegatives(Long trueNegatives) { this.trueNegatives = trueNegatives; }

    public Long getFalseNegatives() { return falseNegatives; }
    public void setFalseNegatives(Long falseNegatives) { this.falseNegatives = falseNegatives; }

    public Double getAmountAnomalyWeight() { return amountAnomalyWeight; }
    public void setAmountAnomalyWeight(Double amountAnomalyWeight) { this.amountAnomalyWeight = amountAnomalyWeight; }

    public Double getVelocityWeight() { return velocityWeight; }
    public void setVelocityWeight(Double velocityWeight) { this.velocityWeight = velocityWeight; }

    public Double getGeoVelocityWeight() { return geoVelocityWeight; }
    public void setGeoVelocityWeight(Double geoVelocityWeight) { this.geoVelocityWeight = geoVelocityWeight; }

    public Double getDeviceMismatchWeight() { return deviceMismatchWeight; }
    public void setDeviceMismatchWeight(Double deviceMismatchWeight) { this.deviceMismatchWeight = deviceMismatchWeight; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
