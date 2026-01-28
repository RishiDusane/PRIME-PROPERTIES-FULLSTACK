package com.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.dto.PropertyDTO;
import com.exam.entity.Property;
import com.exam.entity.User;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.PropertyRepository;
import com.exam.repository.UserRepository;

@Service
public class PropertyService {
    @Autowired private PropertyRepository propertyRepo;
    @Autowired private UserRepository userRepo;

    public Property addProperty(Property property, String ownerEmail) {
        User owner = userRepo.findByEmail(ownerEmail).orElseThrow();
        property.setOwner(owner);
        return propertyRepo.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepo.findAll();
    }
    
    public List<Property> getMyProperties(String email) {
        User owner = userRepo.findByEmail(email).orElseThrow();
        return propertyRepo.findByOwnerId(owner.getId());
    }

    // --- NEW CRUD METHODS ---

    public Property getPropertyById(Long id) {
        return propertyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public Property updateProperty(Long id, PropertyDTO dto, String email) {
        Property existing = getPropertyById(id);
        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Security Check: Only the Owner or Admin can update
        if (!existing.getOwner().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        // Update fields
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setLocation(dto.getLocation());
        existing.setImageUrl(dto.getImageUrl());

        return propertyRepo.save(existing);
    }

    public void deleteProperty(Long id, String email) {
        Property existing = getPropertyById(id);
        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Security Check
        if (!existing.getOwner().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        propertyRepo.delete(existing);
    }
}