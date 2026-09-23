package com.frauddetection.ml;

import com.frauddetection.model.TransactionStatus;
import java.util.List;

public class AnomalyEvaluationResult {
    private double riskScore;
    private boolean isAnomaly;
    private TransactionStatus status;
    private String primaryReason;
    private List<RiskFactor> riskFactors;
    private long evaluationTimeMs;

    public AnomalyEvaluationResult() {}

    public AnomalyEvaluationResult(double riskScore, boolean isAnomaly, TransactionStatus status,
                                   String primaryReason, List<RiskFactor> riskFactors, long evaluationTimeMs) {
        this.riskScore = riskScore;
        this.isAnomaly = isAnomaly;
        this.status = status;
        this.primaryReason = primaryReason;
        this.riskFactors = riskFactors;
        this.evaluationTimeMs = evaluationTimeMs;
    }

    public double getRiskScore() { return riskScore; }
    public void setRiskScore(double riskScore) { this.riskScore = riskScore; }

    public boolean isAnomaly() { return isAnomaly; }
    public void setAnomaly(boolean anomaly) { isAnomaly = anomaly; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public String getPrimaryReason() { return primaryReason; }
    public void setPrimaryReason(String primaryReason) { this.primaryReason = primaryReason; }

    public List<RiskFactor> getRiskFactors() { return riskFactors; }
    public void setRiskFactors(List<RiskFactor> riskFactors) { this.riskFactors = riskFactors; }

    public long getEvaluationTimeMs() { return evaluationTimeMs; }
    public void setEvaluationTimeMs(long evaluationTimeMs) { this.evaluationTimeMs = evaluationTimeMs; }
}
