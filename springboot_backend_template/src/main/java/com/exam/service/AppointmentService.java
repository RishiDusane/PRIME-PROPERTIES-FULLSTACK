package com.exam.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.dto.AppointmentDTO;
import com.exam.entity.Appointment;
import com.exam.entity.AppointmentStatus;
import com.exam.entity.Property;
import com.exam.entity.Role;
import com.exam.entity.User;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.AppointmentRepository;
import com.exam.repository.PropertyRepository;
import com.exam.repository.UserRepository;

@Service
public class AppointmentService {
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private AppointmentRepository apptRepo;
    @Autowired
    private PropertyRepository propRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ModelMapper mapper;

    public Appointment createAppointment(AppointmentDTO dto, String customerEmail) {
        User customer = userRepo.findByEmail(customerEmail).orElseThrow();
        Property property = propRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (apptRepo.findByProperty_IdAndDateAndTime(property.getId(), dto.getDate(), dto.getTime()).isPresent()) {
            throw new RuntimeException("This time slot is already booked for the selected property.");
        }

        Appointment appt = new Appointment();
        appt.setDate(dto.getDate());
        appt.setTime(dto.getTime());
        appt.setStatus(AppointmentStatus.PENDING);
        appt.setCustomer(customer);
        appt.setProperty(property);
        return apptRepo.save(appt);
    }

    public List<AppointmentDTO> getMyAppointments(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        List<Appointment> list;
        if (user.getRole() == Role.ADMIN) {
            list = apptRepo.findAll();
        } else if (user.getRole() == Role.OWNER) {
            list = apptRepo.findByProperty_Owner_Id(user.getId());
        } else {
            list = apptRepo.findByCustomer_Id(user.getId());
        }
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Appointment getAppointmentById(Long id, String email) {
        Appointment appt = apptRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        User user = userRepo.findByEmail(email).orElseThrow();

        boolean isCustomer = appt.getCustomer().getId().equals(user.getId());
        boolean isOwner = appt.getProperty().getOwner().getId().equals(user.getId());

        if (!isCustomer && !isOwner && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized access to this appointment");
        }
        return appt;
    }

    public Appointment updateAppointment(Long id, AppointmentDTO dto, String email) {
        Appointment appt = getAppointmentById(id, email);

        if (dto.getDate() != null)
            appt.setDate(dto.getDate());
        if (dto.getTime() != null)
            appt.setTime(dto.getTime());

        if (dto.getStatus() != null) {
            try {
                AppointmentStatus newStatus = AppointmentStatus.valueOf(dto.getStatus());
                if (newStatus == AppointmentStatus.APPROVED && appt.getStatus() != AppointmentStatus.APPROVED) {
                    logger.info("Email sent to {} - Appointment for {} approved.", appt.getCustomer().getEmail(),
                            appt.getProperty().getTitle());
                }
                appt.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                // Handle invalid status
            }
        }

        return apptRepo.save(appt);
    }

    public void deleteAppointment(Long id, String email) {
        Appointment appt = getAppointmentById(id, email);
        apptRepo.delete(appt);
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        AppointmentDTO d = mapper.map(a, AppointmentDTO.class);
        d.setPropertyTitle(a.getProperty().getTitle());
        d.setCustomerId(a.getCustomer().getId());
        d.setPropertyId(a.getProperty().getId());
        d.setCustomerName(a.getCustomer().getName());
        return d;
    }
}