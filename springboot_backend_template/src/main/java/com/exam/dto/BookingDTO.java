package com.exam.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingDTO {
    private Long id;
    private Long appointmentId;
    private LocalDate bookingDate;
    private double amount;
    private String status; // PENDING, CONFIRMED
    private String propertyTitle; 
    private Long paymentId;
}
