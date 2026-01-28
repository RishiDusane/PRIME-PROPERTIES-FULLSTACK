package com.exam.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class PropertyDTO {
private Long id;


@NotBlank(message = "Title is required")
@Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
private String title;


@NotBlank(message = "Description is required")
@Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
private String description;


@Positive(message = "Price must be a positive value")
private double price;


@NotBlank(message = "Location cannot be empty")
@Size(max = 255, message = "Location cannot exceed 255 characters")
private String location;


@NotBlank(message = "Image URL is required")
@Size(max = 500, message = "Image URL is too long")
@Pattern(regexp = "^(http|https)://.*$", message = "Image URL must start with http:// or https://")
private String imageUrl;


// owner id is read-only on create from client; owner is set server-side using principal
private Long ownerId;
}