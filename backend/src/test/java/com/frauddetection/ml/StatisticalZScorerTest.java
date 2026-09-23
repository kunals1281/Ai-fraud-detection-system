package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class StatisticalZScorerTest {

    private StatisticalZScorer zScorer;
    private List<Transaction> history;

    @BeforeEach
    public void setUp() {
        zScorer = new StatisticalZScorer();
        history = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            Transaction t = new Transaction();
            t.setAmount(new BigDecimal("50.00"));
            t.setTimestamp(LocalDateTime.now().minusHours(i + 1));
            history.add(t);
        }
    }

    @Test
    public void testNormalAmountEvaluatedAsSafe() {
        StatisticalZScorer.ZScoreResult result = zScorer.evaluateAmount(
                new BigDecimal("55.00"), history, 2.5);

        assertFalse(result.isOutlier);
        assertTrue(result.riskScore < 40.0);
    }

    @Test
    public void testSevereOutlierSpikeDetected() {
        StatisticalZScorer.ZScoreResult result = zScorer.evaluateAmount(
                new BigDecimal("5000.00"), history, 2.5);

        assertTrue(result.isOutlier);
        assertTrue(result.riskScore >= 60.0);
        assertTrue(result.rationale.contains("Severe Amount Spike"));
    }
}
