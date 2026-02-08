package com.exam.controller;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.PropertyDTO;
import com.exam.entity.Property;
import com.exam.service.PropertyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin
public class PropertyController {
    @Autowired private PropertyService propertyService;
    @Autowired private ModelMapper mapper;

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        // Corrected type from List<Property> to List<PropertyDTO>
        List<PropertyDTO> properties = propertyService.getAllProperties(); 
        return ResponseEntity.ok(properties);
    }

    @PostMapping
    public PropertyDTO addProperty(@Valid @RequestBody PropertyDTO propertyDto, Principal principal) {
        Property p = mapper.map(propertyDto, Property.class);
        Property saved = propertyService.addProperty(p, principal.getName());
        PropertyDTO out = mapper.map(saved, PropertyDTO.class);
        out.setOwnerId(saved.getOwner() != null ? saved.getOwner().getId() : null);
        return out;
    }

    // --- NEW ENDPOINTS ---

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        Property p = propertyService.getPropertyById(id);
        PropertyDTO dto = mapper.map(p, PropertyDTO.class);
        dto.setOwnerId(p.getOwner() != null ? p.getOwner().getId() : null);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, 
                                                      @Valid @RequestBody PropertyDTO propertyDto, 
                                                      Principal principal) {
        Property updated = propertyService.updateProperty(id, propertyDto, principal.getName());
        PropertyDTO out = mapper.map(updated, PropertyDTO.class);
        out.setOwnerId(updated.getOwner().getId());
        return ResponseEntity.ok(out);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id, Principal principal) {
        propertyService.deleteProperty(id, principal.getName());
        return ResponseEntity.ok("Property deleted successfully.");
    }
}