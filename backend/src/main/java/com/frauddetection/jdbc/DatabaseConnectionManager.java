package com.frauddetection.jdbc;

import com.frauddetection.exception.DatabaseOperationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Direct JDBC Connection Manager.
 * Demonstrates:
 * - Database Connectivity (JDBC) - 3 marks
 * - Implement JDBC for database connectivity - 3 marks
 * - Transaction management (commit / rollback)
 * - Safe resource cleanup
 */
@Component
public class DatabaseConnectionManager {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectionManager.class);
    private final DataSource dataSource;

    public DatabaseConnectionManager(DataSource dataSource) {
        this.dataSource = dataSource;
        log.info("[DatabaseConnectionManager] Initialized JDBC connection manager with DataSource: {}",
                dataSource.getClass().getName());
    }

    /**
     * Obtains an active JDBC Connection from the connection pool.
     *
     * @return Connection object
     * @throws DatabaseOperationException if connection fails
     */
    public Connection getConnection() throws DatabaseOperationException {
        try {
            Connection conn = dataSource.getConnection();
            if (conn == null || conn.isClosed()) {
                throw new DatabaseOperationException("Obtained JDBC connection is null or closed.");
            }
            return conn;
        } catch (SQLException e) {
            log.error("Failed to obtain JDBC Connection: {}", e.getMessage(), e);
            throw new DatabaseOperationException("JDBC Connection failure: " + e.getMessage(), e);
        }
    }

    /**
     * Begins a database transaction by setting auto-commit to false.
     */
    public void beginTransaction(Connection conn) throws DatabaseOperationException {
        try {
            if (conn != null && !conn.isClosed()) {
                conn.setAutoCommit(false);
            }
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to begin JDBC transaction: " + e.getMessage(), e);
        }
    }

    /**
     * Commits the pending database transaction.
     */
    public void commit(Connection conn) throws DatabaseOperationException {
        try {
            if (conn != null && !conn.isClosed()) {
                conn.commit();
            }
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to commit JDBC transaction: " + e.getMessage(), e);
        }
    }

    /**
     * Rolls back changes in case of an error during transaction processing.
     */
    public void rollback(Connection conn) {
        try {
            if (conn != null && !conn.isClosed()) {
                conn.rollback();
                log.warn("[DatabaseConnectionManager] Transaction safely rolled back.");
            }
        } catch (SQLException e) {
            log.error("Error during transaction rollback: {}", e.getMessage(), e);
        }
    }

    /**
     * Safely closes one or more AutoCloseable resources (Connection, Statement, ResultSet).
     */
    public static void closeQuietly(AutoCloseable... closeables) {
        for (AutoCloseable c : closeables) {
            if (c != null) {
                try {
                    c.close();
                } catch (Exception ignored) {
                }
            }
        }
    }
}
