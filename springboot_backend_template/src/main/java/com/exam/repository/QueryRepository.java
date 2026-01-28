package com.exam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Query;

public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByPropertyId(Long propertyId);
}