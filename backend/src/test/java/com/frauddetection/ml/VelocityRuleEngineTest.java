package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class VelocityRuleEngineTest {

    private VelocityRuleEngine engine;

    @BeforeEach
    public void setUp() {
        engine = new VelocityRuleEngine();
    }

    @Test
    public void testNormalVelocityWithinThreshold() {
        List<Transaction> list = new ArrayList<>();
        Transaction t1 = new Transaction();
        t1.setTimestamp(LocalDateTime.now().minusMinutes(5));
        list.add(t1);

        VelocityRuleEngine.VelocityResult result = engine.evaluateVelocity(
                list, LocalDateTime.now(), 4, 10);

        assertFalse(result.isVelocityAnomaly);
        assertEquals(2, result.recentCount);
    }

    @Test
    public void testRapidFireCardingBotDetected() {
        List<Transaction> list = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Transaction t = new Transaction();
            t.setTimestamp(LocalDateTime.now().minusSeconds(10 * (i + 1))); // 10s, 20s, 30s ago
            list.add(t);
        }

        VelocityRuleEngine.VelocityResult result = engine.evaluateVelocity(
                list, LocalDateTime.now(), 4, 10);

        assertTrue(result.isVelocityAnomaly);
        assertTrue(result.riskScore >= 90.0);
        assertTrue(result.rationale.contains("Carding/Bot Velocity"));
    }
}
