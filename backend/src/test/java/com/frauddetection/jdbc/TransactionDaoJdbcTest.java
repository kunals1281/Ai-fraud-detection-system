package com.frauddetection.jdbc;

import com.frauddetection.model.Transaction;
import com.frauddetection.model.TransactionStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@SpringBootTest
public class TransactionDaoJdbcTest {

    @Autowired
    private TransactionDaoJdbcImpl transactionDaoJdbc;

    @Autowired
    private DatabaseConnectionManager connectionManager;

    @Test
    @DisplayName("Verify JDBC Connection Manager and Direct Query Execution")
    void testJdbcConnectionHealth() {
        Assertions.assertDoesNotThrow(() -> {
            var conn = connectionManager.getConnection();
            Assertions.assertNotNull(conn);
            Assertions.assertFalse(conn.isClosed());
            conn.close();
        });
    }

    @Test
    @DisplayName("Verify JDBC PreparedStatement Insert and ResultSet Mapping")
    void testJdbcSaveAndFind() {
        String testTxId = "TX-JDBC-TEST-" + UUID.randomUUID().toString().substring(0, 6);
        Transaction tx = new Transaction();
        tx.setTransactionId(testTxId);
        tx.setUserId("USR-JDBC-001");
        tx.setUserEmail("jdbc-test@fintech.io");
        tx.setAmount(new BigDecimal("1250.75"));
        tx.setCurrency("USD");
        tx.setMerchantName("Apple Store");
        tx.setMerchantCategory("Electronics");
        tx.setLocationCity("San Jose");
        tx.setLocationCountry("US");
        tx.setLatitude(37.3382);
        tx.setLongitude(-121.8863);
        tx.setIpAddress("192.168.1.50");
        tx.setDeviceId("DEV-MACBOOK-TEST");
        tx.setTimestamp(LocalDateTime.now());
        tx.setStatus(TransactionStatus.APPROVED);
        tx.setRiskScore(15.5);
        tx.setRiskFactorsJson("[]");
        tx.setIsAnomaly(false);

        Transaction saved = transactionDaoJdbc.save(tx);
        Assertions.assertNotNull(saved.getId(), "Generated ID must be returned by JDBC");

        Optional<Transaction> retrieved = transactionDaoJdbc.findById(saved.getId());
        Assertions.assertTrue(retrieved.isPresent());
        Assertions.assertEquals(testTxId, retrieved.get().getTransactionId());
        Assertions.assertEquals(new BigDecimal("1250.75"), retrieved.get().getAmount());
    }

    @Test
    @DisplayName("Verify JDBC findAll and Count operations")
    void testJdbcFindAllAndCount() {
        long count = transactionDaoJdbc.count();
        Assertions.assertTrue(count >= 0);

        List<Transaction> all = transactionDaoJdbc.findAll();
        Assertions.assertNotNull(all);
        Assertions.assertEquals(count, all.size());
    }
}
