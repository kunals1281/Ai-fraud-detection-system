package com.frauddetection.repository;

import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionId(String transactionId);

    List<Transaction> findByUserIdOrderByTimestampDesc(String userId);

    Page<Transaction> findByStatusOrderByTimestampDesc(TransactionStatus status, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.timestamp >= :since ORDER BY t.timestamp DESC")
    List<Transaction> findRecentTransactionsByUser(String userId, LocalDateTime since);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.timestamp DESC")
    List<Transaction> findTop10ByUserIdOrderByTimestampDesc(String userId);

    long countByStatus(TransactionStatus status);
}
