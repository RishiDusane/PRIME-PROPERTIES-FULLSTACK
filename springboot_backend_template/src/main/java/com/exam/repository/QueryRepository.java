
package com.exam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Query;
import com.exam.entity.User;

public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByUserId(Long userId);
    List<Query> findByUser(User user);
    List<Query> findAllByOrderByCreatedAtDesc();
}