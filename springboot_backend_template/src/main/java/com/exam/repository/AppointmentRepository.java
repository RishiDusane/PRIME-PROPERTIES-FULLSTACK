package com.exam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
	
	List<Appointment> findByCustomerId(Long customerId);
    
	
	List<Appointment> findByPropertyOwnerId(Long ownerId);

}