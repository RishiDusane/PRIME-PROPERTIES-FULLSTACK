package com.exam.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter @Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    @Positive(message = "Amount must be a positive value")
    private double amount;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Booking status is required")
    private BookingStatus status; // PENDING, CONFIRMED

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    @NotNull(message = "Appointment is required for a booking")
    private Appointment appointment;

    public enum BookingStatus { PENDING, CONFIRMED }
}
