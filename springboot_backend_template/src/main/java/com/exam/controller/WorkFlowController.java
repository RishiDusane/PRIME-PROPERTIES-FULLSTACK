package com.exam.controller;

import java.security.Principal;
import java.util.List;

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
import com.exam.entity.Appointment;
import com.exam.service.AppointmentService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class WorkFlowController {
    @Autowired private AppointmentService apptService;
    @Autowired private ModelMapper mapper;

    @PostMapping("/appointments")
    public Appointment createAppointment(@RequestBody AppointmentDTO dto, Principal principal) {
        return apptService.createAppointment(dto, principal.getName());
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
}