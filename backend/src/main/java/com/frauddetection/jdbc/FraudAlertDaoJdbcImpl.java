package com.frauddetection.jdbc;

import com.frauddetection.exception.DatabaseOperationException;
import com.frauddetection.model.AlertSeverity;
import com.frauddetection.model.AlertStatus;
import com.frauddetection.model.FraudAlert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Pure JDBC Implementation of Fraud Alert Data Access Object.
 * Demonstrates classes for database operations and JDBC connectivity.
 */
@Repository("fraudAlertDaoJdbc")
public class FraudAlertDaoJdbcImpl implements GenericDao<FraudAlert, Long> {

    private static final Logger log = LoggerFactory.getLogger(FraudAlertDaoJdbcImpl.class);
    private final DatabaseConnectionManager connectionManager;

    public FraudAlertDaoJdbcImpl(DatabaseConnectionManager connectionManager) {
        this.connectionManager = connectionManager;
    }

    @Override
    public FraudAlert save(FraudAlert alert) throws DatabaseOperationException {
        String sql = "INSERT INTO fraud_alerts (alert_id, transaction_id, user_id, amount, currency, " +
                "merchant_name, risk_score, reason, severity, status, created_at, resolved_at, resolved_by) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, alert.getAlertId());
            ps.setString(2, alert.getTransactionId());
            ps.setString(3, alert.getUserId());
            ps.setBigDecimal(4, alert.getAmount());
            ps.setString(5, alert.getCurrency());
            ps.setString(6, alert.getMerchantName());
            ps.setDouble(7, alert.getRiskScore() != null ? alert.getRiskScore() : 0.0);
            ps.setString(8, alert.getReason());
            ps.setString(9, alert.getSeverity() != null ? alert.getSeverity().name() : AlertSeverity.MEDIUM.name());
            ps.setString(10, alert.getStatus() != null ? alert.getStatus().name() : AlertStatus.PENDING_REVIEW.name());
            ps.setTimestamp(11, Timestamp.valueOf(alert.getCreatedAt() != null ? alert.getCreatedAt() : LocalDateTime.now()));
            if (alert.getResolvedAt() != null) ps.setTimestamp(12, Timestamp.valueOf(alert.getResolvedAt())); else ps.setNull(12, Types.TIMESTAMP);
            ps.setString(13, alert.getResolvedBy());

            int rows = ps.executeUpdate();
            if (rows == 0) {
                throw new DatabaseOperationException("Saving fraud alert failed, no rows affected.");
            }

            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                alert.setId(rs.getLong(1));
            }

            log.info("[JDBC DAO] Persisted fraud alert [{}] with ID {}", alert.getAlertId(), alert.getId());
            return alert;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to save fraud alert via JDBC: " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(rs, ps, conn);
        }
    }

    @Override
    public Optional<FraudAlert> findById(Long id) throws DatabaseOperationException {
        String sql = "SELECT * FROM fraud_alerts WHERE id = ?";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, id);
            rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapResultSetToAlert(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error finding alert by ID=" + id + ": " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(rs, ps, conn);
        }
    }

    @Override
    public List<FraudAlert> findAll() throws DatabaseOperationException {
        String sql = "SELECT * FROM fraud_alerts ORDER BY created_at DESC";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<FraudAlert> list = new ArrayList<>();

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToAlert(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error fetching alerts: " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(rs, ps, conn);
        }
    }

    @Override
    public boolean update(FraudAlert alert) throws DatabaseOperationException {
        String sql = "UPDATE fraud_alerts SET status = ?, resolved_at = ?, resolved_by = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, alert.getStatus().name());
            if (alert.getResolvedAt() != null) ps.setTimestamp(2, Timestamp.valueOf(alert.getResolvedAt())); else ps.setNull(2, Types.TIMESTAMP);
            ps.setString(3, alert.getResolvedBy());
            ps.setLong(4, alert.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error updating fraud alert: " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(ps, conn);
        }
    }

    @Override
    public boolean deleteById(Long id) throws DatabaseOperationException {
        String sql = "DELETE FROM fraud_alerts WHERE id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error deleting alert: " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(ps, conn);
        }
    }

    @Override
    public long count() throws DatabaseOperationException {
        String sql = "SELECT COUNT(*) FROM fraud_alerts";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = connectionManager.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getLong(1);
            }
            return 0;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error counting alerts: " + e.getMessage(), e);
        } finally {
            DatabaseConnectionManager.closeQuietly(rs, ps, conn);
        }
    }

    private FraudAlert mapResultSetToAlert(ResultSet rs) throws SQLException {
        FraudAlert a = new FraudAlert();
        a.setId(rs.getLong("id"));
        a.setAlertId(rs.getString("alert_id"));
        a.setTransactionId(rs.getString("transaction_id"));
        a.setUserId(rs.getString("user_id"));
        a.setAmount(rs.getBigDecimal("amount"));
        a.setCurrency(rs.getString("currency"));
        a.setMerchantName(rs.getString("merchant_name"));
        a.setRiskScore(rs.getDouble("risk_score"));
        a.setReason(rs.getString("reason"));

        String sevStr = rs.getString("severity");
        if (sevStr != null) a.setSeverity(AlertSeverity.valueOf(sevStr));

        String statStr = rs.getString("status");
        if (statStr != null) a.setStatus(AlertStatus.valueOf(statStr));

        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) a.setCreatedAt(ts.toLocalDateTime());

        Timestamp resTs = rs.getTimestamp("resolved_at");
        if (resTs != null) a.setResolvedAt(resTs.toLocalDateTime());

        a.setResolvedBy(rs.getString("resolved_by"));
        return a;
    }
}
