package com.frauddetection.ml;

public class RiskFactor {
    private String name;
    private double contributionPercent;
    private String description;
    private boolean isFlagged;

    public RiskFactor() {}

    public RiskFactor(String name, double contributionPercent, String description, boolean isFlagged) {
        this.name = name;
        this.contributionPercent = contributionPercent;
        this.description = description;
        this.isFlagged = isFlagged;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getContributionPercent() { return contributionPercent; }
    public void setContributionPercent(double contributionPercent) { this.contributionPercent = contributionPercent; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isFlagged() { return isFlagged; }
    public void setFlagged(boolean flagged) { isFlagged = flagged; }
}
