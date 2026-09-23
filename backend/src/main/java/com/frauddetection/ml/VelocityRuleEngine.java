package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class VelocityRuleEngine {

    public static class VelocityResult {
        public final int recentCount;
        public final double riskScore;
        public final String rationale;
        public final boolean isVelocityAnomaly;

        public VelocityResult(int recentCount, double riskScore, String rationale, boolean isVelocityAnomaly) {
            this.recentCount = recentCount;
            this.riskScore = riskScore;
            this.rationale = rationale;
            this.isVelocityAnomaly = isVelocityAnomaly;
        }
    }

    public VelocityResult evaluateVelocity(List<Transaction> recentTransactions,
                                          LocalDateTime currentTimestamp,
                                          int maxVelocityAllowed,
                                          int windowMinutes) {
        if (recentTransactions == null || recentTransactions.isEmpty()) {
            return new VelocityResult(1, 5.0, "First transaction in active session window", false);
        }

        LocalDateTime windowStart = currentTimestamp.minus(windowMinutes, ChronoUnit.MINUTES);
        int countInWindow = 1; // including current transaction
        int rapidFireCount = 0; // transactions within last 60 seconds

        for (Transaction t : recentTransactions) {
            if (t.getTimestamp().isAfter(windowStart)) {
                countInWindow++;
                long secondsDiff = Math.abs(ChronoUnit.SECONDS.between(t.getTimestamp(), currentTimestamp));
                if (secondsDiff <= 60) {
                    rapidFireCount++;
                }
            }
        }

        if (rapidFireCount >= 2) {
            return new VelocityResult(
                    countInWindow,
                    90.0,
                    String.format("Critical Carding/Bot Velocity: %d transactions in under 60 seconds", rapidFireCount + 1),
                    true
            );
        }

        if (countInWindow > maxVelocityAllowed) {
            double excess = countInWindow - maxVelocityAllowed;
            double risk = Math.min(100.0, 55.0 + excess * 15.0);
            return new VelocityResult(
                    countInWindow,
                    risk,
                    String.format("High Velocity Burst: %d transactions in last %d minutes (limit: %d)",
                            countInWindow, windowMinutes, maxVelocityAllowed),
                    true
            );
        }

        return new VelocityResult(
                countInWindow,
                10.0 + (countInWindow * 5.0),
                String.format("Normal velocity: %d transaction(s) in %d minutes window", countInWindow, windowMinutes),
                false
        );
    }
}
