package com.exam.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
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
    @Autowired 
    private PropertyRepository propertyRepo;
    
    @Autowired 
    private UserRepository userRepo;

    @Autowired 
    private ModelMapper mapper; // Solves: "mapper cannot be resolved"

    public Property addProperty(Property property, String ownerEmail) {
        User owner = userRepo.findByEmail(ownerEmail).orElseThrow();
        if (owner.getRole() != User.Role.OWNER && owner.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Only owners or admins can list properties");
        }
        property.setOwner(owner);
        return propertyRepo.save(property);
    }

    public List<PropertyDTO> getAllProperties() {
        // Solves: "Collectors cannot be resolved" and mapping errors
        return propertyRepo.findAllWithOwners().stream()
                .map(p -> mapper.map(p, PropertyDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<Property> getMyProperties(String email) {
        User owner = userRepo.findByEmail(email).orElseThrow();
        return propertyRepo.findByOwnerId(owner.getId());
    }

    public Property getPropertyById(Long id) {
        return propertyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public Property updateProperty(Long id, PropertyDTO dto, String email) {
        Property existing = getPropertyById(id);
        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!existing.getOwner().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

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

        if (!existing.getOwner().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        propertyRepo.delete(existing);
    }
}