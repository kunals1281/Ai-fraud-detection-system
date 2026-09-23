package com.frauddetection.controller;

import com.frauddetection.dto.AlertResolutionRequest;
import com.frauddetection.model.FraudAlert;
import com.frauddetection.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
@Tag(name = "Transaction Alerts API", description = "Endpoints for fraud notifications and resolution")
public class AlertController {

    private final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Get transaction fraud alerts", description = "Retrieves alerts with optional filtering by user")
    public ResponseEntity<List<FraudAlert>> getAlerts(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(alertService.getAlertsByUser(userId));
        }
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending fraud alerts", description = "Retrieves pending alerts requiring review")
    public ResponseEntity<List<FraudAlert>> getPendingAlerts() {
        return ResponseEntity.ok(alertService.getPendingAlerts());
    }

    @PostMapping("/{alertId}/resolve")
    @Operation(summary = "Resolve fraud alert", description = "Allows user or admin to verify or confirm fraud on a flagged transaction")
    public ResponseEntity<FraudAlert> resolveAlert(
            @PathVariable String alertId,
            @Valid @RequestBody AlertResolutionRequest request) {
        FraudAlert resolved = alertService.resolveAlert(alertId, request);
        return ResponseEntity.ok(resolved);
    }
}
