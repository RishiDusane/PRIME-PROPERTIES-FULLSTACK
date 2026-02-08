package com.exam.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class QueryDTO {
    private Long id;
    private String subject;
    private String description;
    private String adminResponse;
    private String status; 
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private String userRole;
}