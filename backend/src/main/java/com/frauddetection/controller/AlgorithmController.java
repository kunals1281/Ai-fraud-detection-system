package com.frauddetection.controller;

import com.frauddetection.dto.AlgorithmUpdateRequest;
import com.frauddetection.dto.AlgorithmUpdateResponse;
import com.frauddetection.model.AlgorithmModel;
import com.frauddetection.service.AlgorithmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/algorithm")
@CrossOrigin(origins = "*")
@Tag(name = "Admin Algorithm Management API", description = "Endpoints for monitoring and updating fraud detection algorithms")
public class AlgorithmController {

    private final AlgorithmService algorithmService;

    @Autowired
    public AlgorithmController(AlgorithmService algorithmService) {
        this.algorithmService = algorithmService;
    }

    @GetMapping
    @Operation(summary = "Get active algorithm details", description = "Retrieves active model version, confusion matrix, precision, recall, and weights")
    public ResponseEntity<AlgorithmModel> getActiveModel() {
        return ResponseEntity.ok(algorithmService.getActiveAlgorithmModel());
    }

    @GetMapping("/versions")
    @Operation(summary = "Get algorithm version history", description = "Lists historical algorithm versions and benchmark evaluations")
    public ResponseEntity<List<AlgorithmModel>> getModelVersions() {
        return ResponseEntity.ok(algorithmService.getAllModelVersions());
    }

    @PostMapping("/retrain")
    @Operation(summary = "Refine / Update fraud detection algorithm", description = "Refines algorithm parameters and updates weights based on feedback and performance data")
    public ResponseEntity<AlgorithmUpdateResponse> retrainAlgorithm(@RequestBody(required = false) AlgorithmUpdateRequest request) {
        if (request == null) {
            request = new AlgorithmUpdateRequest();
        }
        AlgorithmUpdateResponse response = algorithmService.retrainAlgorithm(request);
        return ResponseEntity.ok(response);
    }
}
