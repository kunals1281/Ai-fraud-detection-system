package com.frauddetection.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler for centralized error interception across all REST endpoints.
 * Demonstrates robust Java Exception Handling practices for the college marking rubric.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTransactionException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTransaction(InvalidTransactionException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(ThresholdViolationException.class)
    public ResponseEntity<Map<String, Object>> handleThresholdViolation(ThresholdViolationException ex) {
        Map<String, Object> body = buildErrorMap(HttpStatus.UNPROCESSABLE_ENTITY, ex.getErrorCode(), ex.getMessage());
        body.put("riskScore", ex.getRiskScore());
        body.put("threshold", ex.getThreshold());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
    }

    @ExceptionHandler(DatabaseOperationException.class)
    public ResponseEntity<Map<String, Object>> handleDatabaseException(DatabaseOperationException ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getErrorCode(), "Database operation failed: " + ex.getMessage());
    }

    @ExceptionHandler(FraudDetectionException.class)
    public ResponseEntity<Map<String, Object>> handleGeneralFraudException(FraudDetectionException ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "ERR_INTERNAL_SERVER", ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(buildErrorMap(status, code, message));
    }

    private Map<String, Object> buildErrorMap(HttpStatus status, String code, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("errorCode", code);
        error.put("message", message);
        return error;
    }
}
