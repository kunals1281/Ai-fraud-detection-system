package com.frauddetection.concurrency;

import com.frauddetection.core.TransactionContext;
import com.frauddetection.ml.RiskFactor;
import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootTest
public class ConcurrentFraudEngineTest {

    @Autowired
    private ConcurrentFraudEngine concurrentFraudEngine;

    @Autowired
    private ThreadSafeVelocityTracker velocityTracker;

    @Test
    @DisplayName("Verify ThreadPoolExecutor & CompletableFuture Parallel Execution")
    void testConcurrentParallelEvaluation() {
        Transaction tx = new Transaction();
        tx.setTransactionId("TX-CONCURRENT-001");
        tx.setUserId("USR-MULTI-1");
        tx.setAmount(new BigDecimal("8500.00"));
        tx.setLocationCity("Tokyo");
        tx.setLocationCountry("JP");
        tx.setLatitude(35.6762);
        tx.setLongitude(139.6503);
        tx.setTimestamp(LocalDateTime.now());
        tx.setStatus(TransactionStatus.APPROVED);

        SystemConfig config = new SystemConfig();
        config.setzScoreThreshold(2.5);
        config.setMaxVelocityTransactions(4);
        config.setVelocityWindowMinutes(10);
        config.setMaxTravelSpeedKmH(800.0);

        TransactionContext<String> ctx = new TransactionContext<>(tx, new ArrayList<>(), config, "METADATA");

        List<RiskFactor> results = concurrentFraudEngine.evaluateConcurrently(ctx);

        Assertions.assertNotNull(results);
        Assertions.assertEquals(4, results.size(), "All 4 detectors must execute in parallel threads");
    }

    @Test
    @DisplayName("Verify ThreadSafeVelocityTracker Synchronization under Concurrent Multi-threaded burst")
    void testVelocityTrackerSynchronization() throws InterruptedException {
        String testUser = "USR-BURST-TEST";
        int threadCount = 20;
        ExecutorService pool = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);

        long now = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            pool.submit(() -> {
                try {
                    int vel = velocityTracker.recordAndGetVelocity(testUser, now, 10);
                    if (vel > 0) {
                        successCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        pool.shutdown();

        Assertions.assertEquals(threadCount, successCount.get(), "All concurrent threads must safely update velocity");
    }
}
