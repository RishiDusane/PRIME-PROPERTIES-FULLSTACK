package com.exam.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.PropertyDTO;
import com.exam.service.PropertyService;

import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin("*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<Page<PropertyDTO>> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(propertyService.searchProperties(city, minPrice, maxPrice, pageable));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<LocalDate>> getPropertyAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyAvailability(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/my-properties")
    @PreAuthorize("hasRole('OWNER')")
    public List<PropertyDTO> getMyProperties(Principal principal) {
        return propertyService.getPropertiesByOwner(principal.getName());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<PropertyDTO> addProperty(@Valid @RequestBody PropertyDTO propertyDTO, Principal principal) {
        return ResponseEntity.ok(propertyService.addProperty(propertyDTO, principal.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, @Valid @RequestBody PropertyDTO dto,
            Principal principal) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto, principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id, Principal principal) {
        propertyService.deleteProperty(id, principal.getName());
        return ResponseEntity.ok("Property deleted successfully");
    }
}