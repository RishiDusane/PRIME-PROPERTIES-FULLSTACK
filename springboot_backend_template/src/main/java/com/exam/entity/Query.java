//package com.exam.entity;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import lombok.Getter;
//import lombok.Setter;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "queries")
//@Getter @Setter
//public class Query {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @NotBlank(message = "Subject is required")
//    private String subject;
//
//    @NotBlank(message = "Description is required")
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    @Column(name = "admin_response", columnDefinition = "TEXT")
//    private String adminResponse;
//
//    @Enumerated(EnumType.STRING)
//    private QueryStatus status = QueryStatus.PENDING;
//
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    @NotNull(message = "User is required")
//    private User user;
//
//    public enum QueryStatus {
//        PENDING, RESOLVED
//    }
//}
package com.exam.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "queries")
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String adminResponse;

    private String status; // PENDING, IN_PROGRESS, RESOLVED

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ===== REQUIRED BY JPA =====
    public Query() {}

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
