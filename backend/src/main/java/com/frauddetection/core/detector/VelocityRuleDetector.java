package com.frauddetection.core.detector;

import com.frauddetection.core.AbstractFraudDetector;
import com.frauddetection.core.TransactionContext;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.ml.VelocityRuleEngine;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

/**
 * Concrete Polymorphic Detector for Sliding-Window High Frequency Velocity Attacks.
 * Demonstrates OOP Polymorphism & Inheritance.
 */
@Component
public class VelocityRuleDetector extends AbstractFraudDetector {

    private final VelocityRuleEngine velocityRuleEngine;

    public VelocityRuleDetector(VelocityRuleEngine velocityRuleEngine) {
        super("Velocity Burst", 0.25);
        this.velocityRuleEngine = velocityRuleEngine;
    }

    @Override
    protected RiskFactor doEvaluate(TransactionContext<?> context) throws Exception {
        Transaction tx = context.getCurrentTransaction();
        SystemConfig config = context.getSystemConfig();

        VelocityRuleEngine.VelocityResult res = velocityRuleEngine.evaluateVelocity(
                context.getUserHistory(),
                tx.getTimestamp(),
                config.getMaxVelocityTransactions(),
                config.getVelocityWindowMinutes()
        );
        return new RiskFactor(getDetectorName(), res.riskScore, res.rationale, res.isVelocityAnomaly);
    }
}
