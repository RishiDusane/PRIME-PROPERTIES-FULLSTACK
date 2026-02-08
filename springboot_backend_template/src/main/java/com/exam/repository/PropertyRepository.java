package com.exam.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.exam.entity.Property;
import com.exam.entity.User;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByOwnerAndDeletedFalse(User owner);

    // Keep for backward compatibility if needed, but preferably use the one above
    default List<Property> findByOwner(User owner) {
        return findByOwnerAndDeletedFalse(owner);
    }

    List<Property> findByOwnerId(Long ownerId);

    @Query("SELECT p FROM Property p JOIN FETCH p.owner WHERE p.deleted = false")
    List<Property> findAllWithOwners();

    @Query("SELECT p FROM Property p WHERE p.deleted = false AND " +
            "(:city IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Property> searchProperties(@Param("city") String city,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);
}