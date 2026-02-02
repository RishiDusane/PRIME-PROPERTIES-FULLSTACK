package com.exam.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.entity.Booking;
import com.exam.entity.Payment;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.BookingRepository;
import com.exam.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepo;
    @Autowired private BookingRepository bookingRepo;

    @Transactional
    public Payment processMockPayment(Long bookingId, String customerEmail) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getAppointment().getCustomer().getEmail().equals(customerEmail)) {
            throw new RuntimeException("You can only pay for your own booking");
        }
        if (paymentRepo.findByBooking_Id(bookingId).isPresent()) {
            throw new RuntimeException("Payment already completed for this booking");
        }
        String transactionId = "MOCK-TXN-" + System.currentTimeMillis();
        Payment payment = new Payment();
        payment.setTransactionId(transactionId);
        payment.setPaymentTime(LocalDateTime.now());
        payment.setAmount(booking.getAmount());
        payment.setBooking(booking);
        payment = paymentRepo.save(payment);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepo.save(booking);
        return payment;
    }
}
