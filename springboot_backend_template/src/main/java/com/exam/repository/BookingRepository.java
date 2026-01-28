package com.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {


}