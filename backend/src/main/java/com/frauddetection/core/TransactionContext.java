package com.frauddetection.core;

import com.frauddetection.model.SystemConfig;
import com.frauddetection.model.Transaction;

import java.util.*;

/**
 * Generic Context container used across the fraud detection pipeline.
 * Demonstrates Generics and Java Collections Framework (rubric requirement).
 *
 * @param <T> Payload or transaction metadata type
 */
public class TransactionContext<T> {

    private final Transaction currentTransaction;
    private final List<Transaction> userHistory;
    private final SystemConfig systemConfig;
    private final T payloadMetadata;
    private final Map<String, Object> attributes = new HashMap<>();

    public TransactionContext(Transaction currentTransaction, List<Transaction> userHistory, SystemConfig systemConfig, T payloadMetadata) {
        this.currentTransaction = Objects.requireNonNull(currentTransaction, "currentTransaction must not be null");
        this.userHistory = userHistory != null ? Collections.unmodifiableList(new ArrayList<>(userHistory)) : Collections.emptyList();
        this.systemConfig = Objects.requireNonNull(systemConfig, "systemConfig must not be null");
        this.payloadMetadata = payloadMetadata;
    }

    public Transaction getCurrentTransaction() {
        return currentTransaction;
    }

    public List<Transaction> getUserHistory() {
        return userHistory;
    }

    public SystemConfig getSystemConfig() {
        return systemConfig;
    }

    public T getPayloadMetadata() {
        return payloadMetadata;
    }

    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }

    public Optional<Object> getAttribute(String key) {
        return Optional.ofNullable(attributes.get(key));
    }

    @SuppressWarnings("unchecked")
    public <V> Optional<V> getAttribute(String key, Class<V> targetType) {
        Object val = attributes.get(key);
        if (val != null && targetType.isInstance(val)) {
            return Optional.of((V) val);
        }
        return Optional.empty();
    }
}
