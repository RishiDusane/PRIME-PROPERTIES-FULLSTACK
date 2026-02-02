package com.exam.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.AppointmentDTO;
import com.exam.dto.BookingDTO;
import com.exam.entity.Appointment;
import com.exam.entity.Payment;
import com.exam.service.AppointmentService;
import com.exam.service.BookingService;
import com.exam.service.PaymentService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class WorkFlowController {
    @Autowired private AppointmentService apptService;
    @Autowired private BookingService bookingService;
    @Autowired private PaymentService paymentService;
    @Autowired private ModelMapper mapper;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto, Principal principal) {
        Appointment appt = apptService.createAppointment(dto, principal.getName());
        AppointmentDTO out = mapper.map(appt, AppointmentDTO.class);
        out.setPropertyTitle(appt.getProperty().getTitle());
        out.setCustomerId(appt.getCustomer().getId());
        out.setPropertyId(appt.getProperty().getId());
        out.setCustomerName(appt.getCustomer().getName());
        return ResponseEntity.ok(out);
    }

    @GetMapping("/appointments")
    public List<AppointmentDTO> getAppointments(Principal principal) {
        return apptService.getMyAppointments(principal.getName());
    }

    // --- NEW ENDPOINTS ---

    @GetMapping("/appointments/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id, Principal principal) {
        Appointment appt = apptService.getAppointmentById(id, principal.getName());
        AppointmentDTO dto = mapper.map(appt, AppointmentDTO.class);
        dto.setPropertyTitle(appt.getProperty().getTitle());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, 
                                                            @RequestBody AppointmentDTO dto, 
                                                            Principal principal) {
        Appointment updated = apptService.updateAppointment(id, dto, principal.getName());
        AppointmentDTO out = mapper.map(updated, AppointmentDTO.class);
        out.setPropertyTitle(updated.getProperty().getTitle());
        return ResponseEntity.ok(out);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id, Principal principal) {
        apptService.deleteAppointment(id, principal.getName());
        return ResponseEntity.ok("Appointment deleted successfully");
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody Map<String, Long> body, Principal principal) {
        Long appointmentId = body.get("appointmentId");
        if (appointmentId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(bookingService.createBooking(appointmentId, principal.getName()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getName()));
    }

    @PostMapping("/payments")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Long> body, Principal principal) {
        Long bookingId = body.get("bookingId");
        if (bookingId == null) {
            return ResponseEntity.badRequest().build();
        }
        Payment payment = paymentService.processMockPayment(bookingId, principal.getName());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "transactionId", payment.getTransactionId(),
            "amount", payment.getAmount(),
            "message", "Payment successful (mock)"
        ));
    }
}