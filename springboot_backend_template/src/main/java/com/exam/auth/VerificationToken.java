package com.exam.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import com.exam.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
public class VerificationToken {

    @Id
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime expiryDate;

    public VerificationToken() {}

    public VerificationToken(User user, int minutesValidity) {
        this.token = UUID.randomUUID().toString();
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusMinutes(minutesValidity);
    }

    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }
}