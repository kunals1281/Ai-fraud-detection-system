package com.frauddetection.exception;

/**
 * Base custom runtime exception for the AI-Powered Fraud Detection System.
 * Demonstrates OOP Exception Handling hierarchy.
 */
public class FraudDetectionException extends RuntimeException {
    private final String errorCode;

    public FraudDetectionException(String message) {
        super(message);
        this.errorCode = "ERR_FRAUD_GENERAL";
    }

    public FraudDetectionException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public FraudDetectionException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
