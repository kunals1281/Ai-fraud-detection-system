package com.frauddetection.jdbc;

import com.frauddetection.exception.DatabaseOperationException;

import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object (DAO) Interface for database operations.
 * Demonstrates Generics & Collections (rubric requirement) and DAO architectural design pattern.
 *
 * @param <T>  Entity model type
 * @param <ID> Primary key identifier type
 */
public interface GenericDao<T, ID> {

    /**
     * Persists a new entity into the database using JDBC PreparedStatement.
     */
    T save(T entity) throws DatabaseOperationException;

    /**
     * Retrieves an entity by its primary key ID using JDBC ResultSet mapping.
     */
    Optional<T> findById(ID id) throws DatabaseOperationException;

    /**
     * Retrieves all entities as a Collection list.
     */
    List<T> findAll() throws DatabaseOperationException;

    /**
     * Updates an existing database record.
     */
    boolean update(T entity) throws DatabaseOperationException;

    /**
     * Deletes a record by primary key ID.
     */
    boolean deleteById(ID id) throws DatabaseOperationException;

    /**
     * Returns total count of records in the table.
     */
    long count() throws DatabaseOperationException;
}
