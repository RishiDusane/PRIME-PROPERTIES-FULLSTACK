package com.exam.auth;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.exam.entity.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    
    // Add this method to support deleting existing tokens for a user
    Optional<PasswordResetToken> findByUser(User user);
}