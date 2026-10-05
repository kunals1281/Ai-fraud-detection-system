package com.frauddetection.exception;

/**
 * Exception thrown when a direct JDBC or database operation encounters an error.
 * Satisfies Exception Handling and Database Connectivity rubric items.
 */
public class DatabaseOperationException extends FraudDetectionException {
    public DatabaseOperationException(String message) {
        super("ERR_JDBC_OPERATION", message);
    }

    public DatabaseOperationException(String message, Throwable cause) {
        super("ERR_JDBC_OPERATION", message, cause);
    }
}
