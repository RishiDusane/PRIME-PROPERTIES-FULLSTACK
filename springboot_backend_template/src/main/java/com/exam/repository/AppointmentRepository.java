package com.exam.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	List<Appointment> findByCustomer_Id(Long customerId);
	List<Appointment> findByProperty_Owner_Id(Long ownerId);
	Optional<Appointment> findByProperty_IdAndDateAndTime(Long propertyId, LocalDate date, LocalTime time);
}