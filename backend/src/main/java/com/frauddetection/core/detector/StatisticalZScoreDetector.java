package com.frauddetection.core.detector;

import com.frauddetection.core.AbstractFraudDetector;
import com.frauddetection.core.TransactionContext;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.ml.StatisticalZScorer;
import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

/**
 * Concrete Polymorphic Detector for Statistical Z-Score Outlier Analysis.
 * Demonstrates OOP Polymorphism & Inheritance.
 */
@Component
public class StatisticalZScoreDetector extends AbstractFraudDetector {

    private final StatisticalZScorer zScorer;

    public StatisticalZScoreDetector(StatisticalZScorer zScorer) {
        super("Amount Outlier (Z-Score)", 0.35);
        this.zScorer = zScorer;
    }

    @Override
    protected RiskFactor doEvaluate(TransactionContext<?> context) throws Exception {
        Transaction tx = context.getCurrentTransaction();
        double threshold = context.getSystemConfig().getzScoreThreshold();
        StatisticalZScorer.ZScoreResult res = zScorer.evaluateAmount(tx.getAmount(), context.getUserHistory(), threshold);
        return new RiskFactor(getDetectorName(), res.riskScore, res.rationale, res.isOutlier);
    }
}
