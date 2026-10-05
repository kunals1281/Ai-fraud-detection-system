package com.frauddetection.exception;

/**
 * Thrown when an evaluated transaction breaches security thresholds.
 */
public class ThresholdViolationException extends FraudDetectionException {
    private final double riskScore;
    private final double threshold;

    public ThresholdViolationException(String message, double riskScore, double threshold) {
        super("ERR_THRESHOLD_BREACHED", String.format("%s (Risk Score: %.2f exceeds Threshold: %.2f)", message, riskScore, threshold));
        this.riskScore = riskScore;
        this.threshold = threshold;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public double getThreshold() {
        return threshold;
    }
}
