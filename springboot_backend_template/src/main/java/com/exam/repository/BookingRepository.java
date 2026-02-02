package com.exam.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	Optional<Booking> findByAppointment_Id(Long appointmentId);
	List<Booking> findByAppointment_Customer_Id(Long customerId);
}