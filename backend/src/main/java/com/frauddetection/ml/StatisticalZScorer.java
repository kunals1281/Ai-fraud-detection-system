package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class StatisticalZScorer {

    public static class ZScoreResult {
        public final double zScore;
        public final double riskScore; // 0 to 100
        public final String rationale;
        public final boolean isOutlier;

        public ZScoreResult(double zScore, double riskScore, String rationale, boolean isOutlier) {
            this.zScore = zScore;
            this.riskScore = riskScore;
            this.rationale = rationale;
            this.isOutlier = isOutlier;
        }
    }

    public ZScoreResult evaluateAmount(BigDecimal amount, List<Transaction> userHistory, double zThreshold) {
        double currentAmount = amount.doubleValue();

        if (userHistory == null || userHistory.size() < 2) {
            // Cold start or baseline check
            if (currentAmount > 5000.0) {
                return new ZScoreResult(3.0, 75.0,
                        String.format("High value transaction ($%.2f) on new/unprofiled account", currentAmount), true);
            } else if (currentAmount > 2000.0) {
                return new ZScoreResult(2.0, 45.0,
                        String.format("Elevated transaction amount ($%.2f) above baseline", currentAmount), false);
            }
            return new ZScoreResult(0.5, 10.0, "Transaction amount within normal starter baseline", false);
        }

        double sum = 0.0;
        for (Transaction t : userHistory) {
            sum += t.getAmount().doubleValue();
        }
        double mean = sum / userHistory.size();

        double varianceSum = 0.0;
        for (Transaction t : userHistory) {
            double diff = t.getAmount().doubleValue() - mean;
            varianceSum += diff * diff;
        }
        double stdDev = Math.sqrt(varianceSum / userHistory.size());

        if (stdDev < 1.0) {
            stdDev = Math.max(10.0, mean * 0.1);
        }

        double zScore = (currentAmount - mean) / stdDev;

        if (zScore >= zThreshold) {
            double risk = Math.min(100.0, 60.0 + (zScore - zThreshold) * 15.0);
            return new ZScoreResult(
                    zScore,
                    risk,
                    String.format("Severe Amount Spike: $%.2f is %.1fσ above user mean of $%.2f", currentAmount, zScore, mean),
                    true
            );
        } else if (zScore >= 1.5) {
            double risk = 30.0 + (zScore - 1.5) * 20.0;
            return new ZScoreResult(
                    zScore,
                    risk,
                    String.format("Moderate amount increase: $%.2f (%.1fσ above mean $%.2f)", currentAmount, zScore, mean),
                    false
            );
        }

        return new ZScoreResult(
                Math.max(0, zScore),
                Math.max(5.0, zScore * 10.0),
                String.format("Amount $%.2f aligns with typical spending (avg: $%.2f)", currentAmount, mean),
                false
        );
    }
}
