package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class GeolocationVelocityEngine {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public static class GeoResult {
        public final double distanceKm;
        public final double speedKmH;
        public final double riskScore;
        public final String rationale;
        public final boolean isImpossibleTravel;

        public GeoResult(double distanceKm, double speedKmH, double riskScore, String rationale, boolean isImpossibleTravel) {
            this.distanceKm = distanceKm;
            this.speedKmH = speedKmH;
            this.riskScore = riskScore;
            this.rationale = rationale;
            this.isImpossibleTravel = isImpossibleTravel;
        }
    }

    public GeoResult evaluateTravelSpeed(Double currentLat, Double currentLon, String currentCity, String currentCountry,
                                         Transaction lastTransaction, LocalDateTime currentTimestamp,
                                         double maxTravelSpeedKmH) {
        if (lastTransaction == null || currentLat == null || currentLon == null ||
                lastTransaction.getLatitude() == null || lastTransaction.getLongitude() == null) {
            return new GeoResult(0.0, 0.0, 5.0, "No prior geo-coordinates available for travel velocity check", false);
        }

        double distance = calculateHaversineDistanceKm(
                lastTransaction.getLatitude(), lastTransaction.getLongitude(),
                currentLat, currentLon
        );

        long secondsDiff = Math.abs(ChronoUnit.SECONDS.between(lastTransaction.getTimestamp(), currentTimestamp));
        if (secondsDiff < 1) secondsDiff = 1;
        double hoursDiff = secondsDiff / 3600.0;
        double speedKmH = distance / hoursDiff;

        // If distance is negligible (under 50km), normal local activity
        if (distance < 50.0) {
            return new GeoResult(distance, speedKmH, 5.0,
                    String.format("Location consistent (%.1f km from %s)", distance, lastTransaction.getLocationCity()), false);
        }

        if (speedKmH > maxTravelSpeedKmH) {
            double risk = Math.min(100.0, 75.0 + Math.min(25.0, (speedKmH - maxTravelSpeedKmH) / 100.0));
            return new GeoResult(
                    distance,
                    speedKmH,
                    risk,
                    String.format("Impossible Travel: %.0f km traveled from %s to %s in %d mins (Speed: %.0f km/h exceeds %.0f km/h limit)",
                            distance, lastTransaction.getLocationCity(), currentCity, secondsDiff / 60, speedKmH, maxTravelSpeedKmH),
                    true
            );
        }

        if (speedKmH > 350.0) {
            return new GeoResult(
                    distance,
                    speedKmH,
                    45.0,
                    String.format("High speed transit detected (%.0f km in %d mins at %.0f km/h)",
                            distance, secondsDiff / 60, speedKmH),
                    false
            );
        }

        return new GeoResult(
                distance,
                speedKmH,
                15.0,
                String.format("Plausible transit: %.0f km from %s to %s in %.1f hours",
                        distance, lastTransaction.getLocationCity(), currentCity, hoursDiff),
                false
        );
    }

    public double calculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
