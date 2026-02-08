package com.exam.service;

import com.exam.dto.PropertyDTO;
import com.exam.entity.AppointmentStatus;
import com.exam.entity.Property;
import com.exam.entity.Role;
import com.exam.entity.User;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.PropertyRepository;
import com.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAllWithOwners().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<PropertyDTO> searchProperties(String city, Double minPrice, Double maxPrice, Pageable pageable) {
        return propertyRepository.searchProperties(city, minPrice, maxPrice, pageable)
                .map(this::mapToDTO);
    }

    public List<LocalDate> getPropertyAvailability(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        return property.getAppointments().stream()
                .filter(a -> a.getStatus() == AppointmentStatus.APPROVED)
                .map(a -> a.getDate())
                .collect(Collectors.toList());
    }

    public List<PropertyDTO> getPropertiesByOwner(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Using the new/compatible method that filters soft-deleted ones
        return propertyRepository.findByOwner(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PropertyDTO addProperty(PropertyDTO dto, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        Property property = new Property();
        mapToEntity(dto, property);
        property.setOwner(owner);
        return mapToDTO(propertyRepository.save(property));
    }

    public PropertyDTO updateProperty(Long id, PropertyDTO dto, String userEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (property.isDeleted()) {
            throw new ResourceNotFoundException("Property not found");
        }

        // ADMIN can update anything; OWNER can only update their own
        if (!user.getRole().equals(Role.ADMIN) && !property.getOwner().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: Access Denied");
        }

        mapToEntity(dto, property);
        return mapToDTO(propertyRepository.save(property));
    }

    public void deleteProperty(Long id, String userEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getRole().equals(Role.ADMIN) && !property.getOwner().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: Access Denied");
        }

        // Validation: Block if active appointments exist
        boolean hasActiveAppointments = property.getAppointments().stream()
                .anyMatch(
                        a -> a.getStatus() == AppointmentStatus.PENDING || a.getStatus() == AppointmentStatus.APPROVED);

        if (hasActiveAppointments) {
            throw new RuntimeException("Cannot delete property with active (Pending/Approved) appointments.");
        }

        // Soft delete
        property.setDeleted(true);
        propertyRepository.save(property);
    }

    private void mapToEntity(PropertyDTO dto, Property property) {
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPrice(dto.getPrice());
        property.setLocation(dto.getLocation());
        property.setImageUrl(dto.getImageUrl());
        property.setAvailable(dto.isAvailable());
    }

    private PropertyDTO mapToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setPrice(property.getPrice());
        dto.setLocation(property.getLocation());
        dto.setImageUrl(property.getImageUrl());
        dto.setAvailable(property.isAvailable());
        dto.setOwnerId(property.getOwner().getId());

        // Add verification info if possible, but DTO might not have it.
        // If DTO doesn't have it, we might need to update DTO, but constraint says "No
        // new heavy dependencies".
        // Let's check PropertyDTO.
        // Providing owner info in DTO is good.
        return dto;
    }

    public PropertyDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (property.isDeleted()) {
            throw new ResourceNotFoundException("Property not found");
        }

        return mapToDTO(property);
    }
}