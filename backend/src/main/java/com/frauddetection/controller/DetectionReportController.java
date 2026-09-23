package com.frauddetection.controller;

import com.frauddetection.dto.DetectionReportDto;
import com.frauddetection.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
@Tag(name = "Admin Detection Monitoring API", description = "Endpoints for detailed fraud detection reports and analytics")
public class DetectionReportController {

    private final AdminService adminService;

    @Autowired
    public DetectionReportController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Get detailed detection report", description = "Generates comprehensive metrics, category/geographic distributions, and flagged cases")
    public ResponseEntity<DetectionReportDto> getDetectionReport() {
        return ResponseEntity.ok(adminService.generateDetectionReport());
    }
}
