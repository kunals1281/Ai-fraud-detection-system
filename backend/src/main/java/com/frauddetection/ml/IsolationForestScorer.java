package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class IsolationForestScorer {

    private static final Set<String> HIGH_RISK_COUNTRIES = Set.of(
            "KY", "VG", "PA", "NG", "RO", "RU", "IR", "KP"
    );

    public static class DeviceRiskResult {
        public final double riskScore;
        public final String rationale;
        public final boolean isNewDevice;

        public DeviceRiskResult(double riskScore, String rationale, boolean isNewDevice) {
            this.riskScore = riskScore;
            this.rationale = rationale;
            this.isNewDevice = isNewDevice;
        }
    }

    public DeviceRiskResult evaluateDeviceAndEnvironment(String currentDeviceId, String currentCountry,
                                                        LocalDateTime timestamp, List<Transaction> userHistory) {
        boolean newDevice = true;
        Set<String> knownDevices = new HashSet<>();

        if (userHistory != null) {
            for (Transaction t : userHistory) {
                if (t.getDeviceId() != null) {
                    knownDevices.add(t.getDeviceId());
                }
            }
        }

        if (currentDeviceId != null && knownDevices.contains(currentDeviceId)) {
            newDevice = false;
        }

        double score = 5.0;
        StringBuilder sb = new StringBuilder();

        // 1. Device Novelty
        if (newDevice && !knownDevices.isEmpty()) {
            score += 35.0;
            sb.append("Unrecognized Device Fingerprint. ");
        } else if (!newDevice) {
            sb.append("Known trusted hardware device. ");
        }

        // 2. High Risk Country
        if (currentCountry != null && HIGH_RISK_COUNTRIES.contains(currentCountry.toUpperCase())) {
            score += 45.0;
            sb.append("High-risk jurisdiction (").append(currentCountry).append("). ");
        }

        // 3. Time of day anomaly (2am to 5am local transaction time)
        int hour = timestamp.getHour();
        if (hour >= 2 && hour <= 5) {
            score += 15.0;
            sb.append("Off-hours execution (").append(hour).append(":00). ");
        }

        score = Math.min(100.0, score);
        return new DeviceRiskResult(score, sb.toString().trim(), newDevice);
    }
}
