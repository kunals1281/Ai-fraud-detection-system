package com.frauddetection.exception;

/**
 * Thrown when incoming transaction payload has missing, negative, or corrupt fields.
 */
public class InvalidTransactionException extends FraudDetectionException {
    public InvalidTransactionException(String message) {
        super("ERR_INVALID_TRANSACTION", message);
    }
}
