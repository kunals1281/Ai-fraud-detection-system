package com.frauddetection.core;

import com.frauddetection.exception.FraudDetectionException;
import com.frauddetection.ml.RiskFactor;

/**
 * Interface representing a strategy for evaluating fraud indicators in financial transactions.
 * Demonstrates OOP: Interfaces & Strategy Design Pattern.
 */
public interface FraudDetectorStrategy {

    /**
     * Unique name identifying this detector component.
     */
    String getDetectorName();

    /**
     * Evaluates a transaction within its context and generates a RiskFactor.
     *
     * @param context Context containing current transaction, historical transactions, and thresholds
     * @return RiskFactor containing contribution score, rationale, and flagged flag
     * @throws FraudDetectionException when calculation encounters an unexpected anomaly
     */
    RiskFactor evaluate(TransactionContext<?> context) throws FraudDetectionException;

    /**
     * Priority weight of this detector in the ensemble (0.0 to 1.0).
     */
    double getDefaultWeight();
}
