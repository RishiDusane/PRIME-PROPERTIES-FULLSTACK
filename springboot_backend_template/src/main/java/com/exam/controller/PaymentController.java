package com.exam.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.entity.Payment;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.PaymentRepository;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepo;

    @GetMapping(value = "/{paymentId}/receipt", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getReceipt(@PathVariable Long paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        var booking = payment.getBooking();
        // Defensive checks for deep nesting
        if (booking == null) {
            throw new ResourceNotFoundException("Booking data corrupted");
        }
        var appt = booking.getAppointment();
        if (appt == null) {
            throw new ResourceNotFoundException("Appointment data corrupted");
        }
        var customer = appt.getCustomer();
        var property = appt.getProperty();

        // Safe enum access
        String methodStr = (payment.getMethod() != null) ? payment.getMethod().name() : "N/A";
        String statusStr = (payment.getStatus() != null) ? payment.getStatus().name() : "N/A";

        Map<String, Object> receipt = Map.of(
                "paymentId", payment.getId(),
                "bookingId", booking.getId(),
                "amount", payment.getAmount(),
                "paymentMethod", methodStr,
                "paymentStatus", statusStr,
                "transactionId", (payment.getTransactionId() != null) ? payment.getTransactionId() : "PENDING",
                "paymentDate", (payment.getPaymentTime() != null) ? payment.getPaymentTime().toString() : "N/A",
                "userName", (customer != null) ? customer.getName() : "Unknown",
                "userEmail", (customer != null) ? customer.getEmail() : "Unknown",
                "propertyTitle", (property != null) ? property.getTitle() : "Unknown");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=payment-" + payment.getId() + "-receipt.json");
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok().headers(headers).body(receipt);
    }

    @Autowired
    private com.exam.service.PdfService pdfService;

    @GetMapping(value = "/{paymentId}/receipt/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getReceiptPdf(@PathVariable Long paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        byte[] pdfBytes = pdfService.generateReceipt(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=payment-" + payment.getTransactionId() + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}