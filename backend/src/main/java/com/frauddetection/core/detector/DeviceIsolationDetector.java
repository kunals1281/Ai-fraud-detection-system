package com.frauddetection.core.detector;

import com.frauddetection.core.AbstractFraudDetector;
import com.frauddetection.core.TransactionContext;
import com.frauddetection.ml.IsolationForestScorer;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

/**
 * Concrete Polymorphic Detector for Device & Jurisdiction Isolation Scoring.
 * Demonstrates OOP Polymorphism & Inheritance.
 */
@Component
public class DeviceIsolationDetector extends AbstractFraudDetector {

    private final IsolationForestScorer isolationScorer;

    public DeviceIsolationDetector(IsolationForestScorer isolationScorer) {
        super("Device & Environment Anomaly", 0.15);
        this.isolationScorer = isolationScorer;
    }

    @Override
    protected RiskFactor doEvaluate(TransactionContext<?> context) throws Exception {
        Transaction tx = context.getCurrentTransaction();
        IsolationForestScorer.DeviceRiskResult res = isolationScorer.evaluateDeviceAndEnvironment(
                tx.getDeviceId(),
                tx.getLocationCountry(),
                tx.getTimestamp(),
                context.getUserHistory()
        );
        return new RiskFactor(getDetectorName(), res.riskScore, res.rationale, res.isNewDevice);
    }
}
