package com.exam.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.persistence.Column(nullable = false)
    @NotBlank(message = "Transaction ID is required")
    @Size(max = 255, message = "Transaction ID cannot exceed 255 characters")
    private String transactionId;

    @jakarta.persistence.Column(nullable = false)
    @NotNull(message = "Payment time is required")
    @PastOrPresent(message = "Payment time cannot be in the future")
    private LocalDateTime paymentTime;

    @jakarta.persistence.Column(nullable = false)
    @Positive(message = "Amount must be greater than zero")
    private double amount;

    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(nullable = false)
    @NotNull(message = "Payment status is required")
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(nullable = false)
    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @NotNull(message = "Booking reference is required")
    private Booking booking;
}
