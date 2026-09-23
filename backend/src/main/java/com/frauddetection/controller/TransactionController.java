package com.frauddetection.controller;

import com.frauddetection.dto.TransactionRequest;
import com.frauddetection.dto.TransactionResponse;
import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import com.frauddetection.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
@Tag(name = "Transaction API", description = "Endpoints for processing and monitoring financial transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @Operation(summary = "Submit financial transaction", description = "Executes AI-powered anomaly detection on incoming transaction and outputs risk score and XAI breakdown")
    public ResponseEntity<TransactionResponse> submitTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.processTransaction(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get transaction history", description = "Retrieve transactions with optional filtering by user or status")
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
        }
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/by-status")
    @Operation(summary = "Get transactions by status", description = "Retrieve paginated transactions filtered by APPROVED, SUSPICIOUS, or BLOCKED")
    public ResponseEntity<Page<Transaction>> getTransactionsByStatus(
            @RequestParam TransactionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(transactionService.getTransactionsByStatus(status, page, size));
    }
}
