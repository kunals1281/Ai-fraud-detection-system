package com.frauddetection.ml;

import com.frauddetection.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class GeolocationVelocityEngineTest {

    private GeolocationVelocityEngine engine;

    @BeforeEach
    public void setUp() {
        engine = new GeolocationVelocityEngine();
    }

    @Test
    public void testHaversineDistanceAccuracy() {
        // Distance between San Francisco (37.7749, -122.4194) and New York (40.7128, -74.0060) is approx ~4,130 km
        double distance = engine.calculateHaversineDistanceKm(37.7749, -122.4194, 40.7128, -74.0060);
        assertTrue(distance > 4000.0 && distance < 4300.0, "Distance should be approx 4,130 km");
    }

    @Test
    public void testImpossibleTravelDetected() {
        Transaction lastTx = new Transaction();
        lastTx.setLatitude(37.7749);
        lastTx.setLongitude(-122.4194);
        lastTx.setLocationCity("San Francisco");
        lastTx.setTimestamp(LocalDateTime.now().minusMinutes(20)); // 20 minutes ago

        // Current tx in Tokyo (35.6762, 139.6503) ~8,270 km away!
        GeolocationVelocityEngine.GeoResult result = engine.evaluateTravelSpeed(
                35.6762, 139.6503, "Tokyo", "JP",
                lastTx, LocalDateTime.now(), 800.0);

        assertTrue(result.isImpossibleTravel);
        assertTrue(result.riskScore >= 75.0);
        assertTrue(result.speedKmH > 10000.0);
    }
}
