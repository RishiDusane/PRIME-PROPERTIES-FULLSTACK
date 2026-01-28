package com.exam.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AppointmentDTO {

    private Long id;

    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date cannot be in the past")
    private LocalDate date;

    @NotNull(message = "Appointment time is required")
    private LocalTime time;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "PENDING|APPROVED|REJECTED",
        message = "Status must be PENDING, APPROVED, or REJECTED"
    )
    private String status;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String propertyTitle; // For UI only (no validation needed)
}
