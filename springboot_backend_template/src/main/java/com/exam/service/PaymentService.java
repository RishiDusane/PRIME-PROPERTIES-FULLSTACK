package com.exam.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.entity.Booking;
import com.exam.entity.BookingStatus;
import com.exam.entity.Payment;
import com.exam.entity.PaymentMethod;
import com.exam.entity.PaymentStatus;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.BookingRepository;
import com.exam.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private BookingRepository bookingRepo;

    @Transactional
    public Payment processMockPayment(Long bookingId, String customerEmail) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getAppointment() == null || booking.getAppointment().getCustomer() == null) {
            throw new IllegalArgumentException("Booking is invalid: missing appointment or customer details");
        }

        if (!booking.getAppointment().getCustomer().getEmail().equals(customerEmail)) {
            throw new IllegalArgumentException("You can only pay for your own booking");
        }
        if (paymentRepo.findByBooking_Id(bookingId).isPresent()) {
            throw new IllegalArgumentException("Payment already completed for this booking");
        }

        // Generate robust transaction ID
        String transactionId = "TXN-" + java.util.UUID.randomUUID().toString();

        Payment payment = new Payment();
        payment.setTransactionId(transactionId);
        payment.setPaymentTime(LocalDateTime.now());
        payment.setAmount(booking.getAmount());
        payment.setBooking(booking);
        payment.setStatus(PaymentStatus.SUCCESS);

        // Default to CARD if not provided (though we are creating it here, so we
        // enforce it)
        payment.setMethod(PaymentMethod.CARD);

        // Final validation before save
        if (payment.getMethod() == null) {
            payment.setMethod(PaymentMethod.CARD);
        }

        payment = paymentRepo.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);
        return payment;
    }
}