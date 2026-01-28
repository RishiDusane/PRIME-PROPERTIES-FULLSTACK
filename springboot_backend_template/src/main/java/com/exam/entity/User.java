package com.exam.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password; 

    @Enumerated(EnumType.STRING)
    private Role role; 

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false; 

    public enum Role { OWNER, CUSTOMER, ADMIN }
    
    // Helper for easier access in logic
    public void setVerified(boolean verified) {
        this.isVerified = verified;
    }
    
    public boolean isVerified() {
        return this.isVerified;
    }
}