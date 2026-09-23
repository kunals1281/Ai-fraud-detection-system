package com.frauddetection.controller;

import com.frauddetection.dto.ConfigResponse;
import com.frauddetection.dto.ConfigUpdateRequest;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/config")
@CrossOrigin(origins = "*")
@Tag(name = "Admin System Configuration API", description = "Endpoints for configuring detection thresholds and parameters")
public class AdminConfigController {

    private final AdminService adminService;

    @Autowired
    public AdminConfigController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Get system detection configuration", description = "Retrieves active threshold settings and anomaly detection parameters")
    public ResponseEntity<SystemConfig> getConfiguration() {
        return ResponseEntity.ok(adminService.getSystemConfig());
    }

    @PutMapping
    @Operation(summary = "Update system detection configuration", description = "Configures detection thresholds and parameters with instant confirmation")
    public ResponseEntity<ConfigResponse> updateConfiguration(@Valid @RequestBody ConfigUpdateRequest request) {
        ConfigResponse response = adminService.updateSystemConfig(request);
        return ResponseEntity.ok(response);
    }
}
