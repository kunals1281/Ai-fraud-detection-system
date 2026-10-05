-- =============================================================================
-- NeuroShield AI: Database Schema (DDL)
-- College Review Evaluation: Database Design, Relational Structure & Connectivity
-- =============================================================================

-- Table: System Configuration (Admin detection thresholds and parameters)
CREATE TABLE IF NOT EXISTS system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    flag_risk_threshold DOUBLE NOT NULL DEFAULT 40.0,
    block_risk_threshold DOUBLE NOT NULL DEFAULT 75.0,
    z_score_threshold DOUBLE NOT NULL DEFAULT 2.5,
    max_velocity_transactions INT NOT NULL DEFAULT 4,
    velocity_window_minutes INT NOT NULL DEFAULT 10,
    max_travel_speed_km_h DOUBLE NOT NULL DEFAULT 800.0,
    auto_block_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM'
);

-- Table: Algorithm Model (Weights, confusion matrix & versioning)
CREATE TABLE IF NOT EXISTS algorithm_model (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    precision_score DOUBLE NOT NULL,
    recall_score DOUBLE NOT NULL,
    f1_score DOUBLE NOT NULL,
    roc_auc_score DOUBLE NOT NULL,
    total_evaluations INT NOT NULL DEFAULT 0,
    true_positives INT NOT NULL DEFAULT 0,
    false_positives INT NOT NULL DEFAULT 0,
    true_negatives INT NOT NULL DEFAULT 0,
    false_negatives INT NOT NULL DEFAULT 0,
    amount_anomaly_weight DOUBLE NOT NULL DEFAULT 0.35,
    velocity_weight DOUBLE NOT NULL DEFAULT 0.25,
    geo_velocity_weight DOUBLE NOT NULL DEFAULT 0.25,
    device_mismatch_weight DOUBLE NOT NULL DEFAULT 0.15,
    updated_at TIMESTAMP NOT NULL
);

-- Table: Transactions (Financial transaction records monitored by AI)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(64) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    user_email VARCHAR(120),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    merchant_name VARCHAR(120),
    merchant_category VARCHAR(64),
    location_city VARCHAR(100),
    location_country VARCHAR(10),
    latitude DOUBLE,
    longitude DOUBLE,
    ip_address VARCHAR(45),
    device_id VARCHAR(100),
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL,
    risk_score DOUBLE NOT NULL,
    risk_factors_json CLOB,
    is_anomaly BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for high-speed indexing & lookup
CREATE INDEX IF NOT EXISTS idx_tx_user_time ON transactions (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tx_status ON transactions (status);

-- Table: Fraud Alerts (Suspicious activity notifications for user and admin)
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_id VARCHAR(64) NOT NULL UNIQUE,
    transaction_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    merchant_name VARCHAR(120),
    risk_score DOUBLE NOT NULL,
    reason VARCHAR(1000),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_alert_user ON fraud_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_alert_status ON fraud_alerts (status);

-- Table: Audit Logs (Compliance tracking for review and actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    details CLOB,
    timestamp TIMESTAMP NOT NULL
);
