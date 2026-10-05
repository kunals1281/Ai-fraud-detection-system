package com.frauddetection.core;

import com.frauddetection.exception.FraudDetectionException;
import com.frauddetection.ml.RiskFactor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Abstract Base Class for fraud detectors.
 * Demonstrates OOP: Inheritance, Encapsulation, and the Template Method Pattern.
 */
public abstract class AbstractFraudDetector implements FraudDetectorStrategy {

    protected final Logger log = LoggerFactory.getLogger(getClass());
    private final String detectorName;
    private final double defaultWeight;

    protected AbstractFraudDetector(String detectorName, double defaultWeight) {
        this.detectorName = detectorName;
        this.defaultWeight = defaultWeight;
    }

    @Override
    public String getDetectorName() {
        return detectorName;
    }

    @Override
    public double getDefaultWeight() {
        return defaultWeight;
    }

    /**
     * Template method executing standard pre-checks, timed evaluation, and error trapping.
     */
    @Override
    public final RiskFactor evaluate(TransactionContext<?> context) throws FraudDetectionException {
        if (context == null || context.getCurrentTransaction() == null) {
            throw new FraudDetectionException("ERR_NULL_CONTEXT", "Evaluation context or transaction cannot be null");
        }

        long startTime = System.currentTimeMillis();
        try {
            RiskFactor factor = doEvaluate(context);
            long elapsed = System.currentTimeMillis() - startTime;
            log.debug("[{}] evaluated in {} ms. Risk: {}%, Flagged: {}", 
                    detectorName, elapsed, factor.getContributionPercent(), factor.isFlagged());
            return factor;
        } catch (Exception ex) {
            log.error("[{}] Error executing fraud evaluation: {}", detectorName, ex.getMessage(), ex);
            // Graceful fallback to avoid halting the whole ensemble
            return new RiskFactor(detectorName, 0.0, 
                    "Evaluation failed safely: " + ex.getMessage(), false);
        }
    }

    /**
     * Primitive method implemented by concrete polymorphic subclasses.
     */
    protected abstract RiskFactor doEvaluate(TransactionContext<?> context) throws Exception;
}
