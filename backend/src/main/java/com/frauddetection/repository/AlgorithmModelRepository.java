package com.frauddetection.repository;

import com.frauddetection.model.AlgorithmModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlgorithmModelRepository extends JpaRepository<AlgorithmModel, Long> {
    Optional<AlgorithmModel> findByIsActiveTrue();
    Optional<AlgorithmModel> findByVersion(String version);
}
