package com.exam.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.UserDTO;
import com.exam.repository.AppointmentRepository;
import com.exam.repository.PropertyRepository;
import com.exam.repository.UserRepository;
import com.exam.service.UserService;

import com.exam.repository.BookingRepository;
import com.exam.repository.PaymentRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PropertyRepository propertyRepo;
    @Autowired
    private AppointmentRepository apptRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private BookingRepository bookingRepo;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Double revenue = paymentRepo.calculateTotalRevenue();
        return Map.of(
                "users", userRepo.count(),
                "properties", propertyRepo.count(),
                "appointments", apptRepo.count(),
                "bookings", bookingRepo.count(),
                "revenue", revenue != null ? revenue : 0.0);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }
}
