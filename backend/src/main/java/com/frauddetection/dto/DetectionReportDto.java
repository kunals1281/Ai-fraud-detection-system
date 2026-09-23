package com.frauddetection.dto;

import com.frauddetection.model.FraudAlert;
import com.frauddetection.model.Transaction;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DetectionReportDto {

    private long totalTransactions;
    private long totalFraudCases;
    private long totalSuspiciousCases;
    private long totalApprovedCases;
    private double fraudRatePercent;
    private BigDecimal totalBlockedAmount;
    private BigDecimal totalProcessedAmount;
    private Map<String, Long> casesByCategory;
    private Map<String, Long> casesByCountry;
    private List<Transaction> recentFlaggedTransactions;
    private List<FraudAlert> pendingAlerts;

    public DetectionReportDto() {}

    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }

    public long getTotalFraudCases() { return totalFraudCases; }
    public void setTotalFraudCases(long totalFraudCases) { this.totalFraudCases = totalFraudCases; }

    public long getTotalSuspiciousCases() { return totalSuspiciousCases; }
    public void setTotalSuspiciousCases(long totalSuspiciousCases) { this.totalSuspiciousCases = totalSuspiciousCases; }

    public long getTotalApprovedCases() { return totalApprovedCases; }
    public void setTotalApprovedCases(long totalApprovedCases) { this.totalApprovedCases = totalApprovedCases; }

    public double getFraudRatePercent() { return fraudRatePercent; }
    public void setFraudRatePercent(double fraudRatePercent) { this.fraudRatePercent = fraudRatePercent; }

    public BigDecimal getTotalBlockedAmount() { return totalBlockedAmount; }
    public void setTotalBlockedAmount(BigDecimal totalBlockedAmount) { this.totalBlockedAmount = totalBlockedAmount; }

    public BigDecimal getTotalProcessedAmount() { return totalProcessedAmount; }
    public void setTotalProcessedAmount(BigDecimal totalProcessedAmount) { this.totalProcessedAmount = totalProcessedAmount; }

    public Map<String, Long> getCasesByCategory() { return casesByCategory; }
    public void setCasesByCategory(Map<String, Long> casesByCategory) { this.casesByCategory = casesByCategory; }

    public Map<String, Long> getCasesByCountry() { return casesByCountry; }
    public void setCasesByCountry(Map<String, Long> casesByCountry) { this.casesByCountry = casesByCountry; }

    public List<Transaction> getRecentFlaggedTransactions() { return recentFlaggedTransactions; }
    public void setRecentFlaggedTransactions(List<Transaction> recentFlaggedTransactions) { this.recentFlaggedTransactions = recentFlaggedTransactions; }

    public List<FraudAlert> getPendingAlerts() { return pendingAlerts; }
    public void setPendingAlerts(List<FraudAlert> pendingAlerts) { this.pendingAlerts = pendingAlerts; }
}
