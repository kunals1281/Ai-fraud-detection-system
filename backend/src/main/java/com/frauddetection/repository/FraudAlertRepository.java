package com.frauddetection.repository;

import com.frauddetection.model.AlertStatus;
import com.frauddetection.model.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    Optional<FraudAlert> findByAlertId(String alertId);

    List<FraudAlert> findByUserIdOrderByCreatedAtDesc(String userId);

    List<FraudAlert> findByStatusOrderByCreatedAtDesc(AlertStatus status);

    List<FraudAlert> findAllByOrderByCreatedAtDesc();

    long countByStatus(AlertStatus status);
}
