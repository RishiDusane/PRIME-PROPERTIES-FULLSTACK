package com.exam.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.repository.AppointmentRepository;
import com.exam.repository.PropertyRepository;
import com.exam.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepo;
    @Autowired private PropertyRepository propertyRepo;
    @Autowired private AppointmentRepository apptRepo;

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of(
            "users", userRepo.count(),
            "properties", propertyRepo.count(),
            "appointments", apptRepo.count()
        );
    }
}
