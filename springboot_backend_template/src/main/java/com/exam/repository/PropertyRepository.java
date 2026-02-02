package com.exam.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.exam.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    // Solves: "The method findByOwner_Id(Long) is undefined"
    List<Property> findByOwnerId(Long ownerId);

    // Optimized join for getAllProperties()
    @Query("SELECT p FROM Property p JOIN FETCH p.owner")
    List<Property> findAllWithOwners();
}