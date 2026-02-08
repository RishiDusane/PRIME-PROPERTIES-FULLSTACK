package com.exam.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.dto.QueryDTO;
import com.exam.dto.QueryRequest;
import com.exam.entity.Query;
import com.exam.entity.QueryStatus;
import com.exam.entity.User;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.QueryRepository;
import com.exam.repository.UserRepository;



@Service
@Transactional
public class QueryService {

    @Autowired private QueryRepository queryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ModelMapper mapper;

    public QueryDTO saveQuery(QueryRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Query query = new Query();
        query.setSubject(request.getSubject());
        query.setDescription(request.getDescription());
        query.setUser(user);
        query.setStatus(QueryStatus.PENDING); 
        query.setCreatedAt(LocalDateTime.now());

        return convertToDto(queryRepository.save(query));
    }

    public List<QueryDTO> getMyQueries(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return queryRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<QueryDTO> getAllQueriesForAdmin() {
        return queryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public QueryDTO updateAdminResponse(Long id, QueryDTO dto) {
        Query query = queryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Query not found"));
        query.setAdminResponse(dto.getAdminResponse() != null ? dto.getAdminResponse() : query.getAdminResponse());
        
        if (dto.getStatus() != null) {
            try {
                query.setStatus(QueryStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException e) {
                query.setStatus(QueryStatus.RESOLVED);
            }
        } else {
            query.setStatus(QueryStatus.RESOLVED);
        }
        return convertToDto(queryRepository.save(query));
    }

    private QueryDTO convertToDto(Query query) {
        QueryDTO dto = mapper.map(query, QueryDTO.class);
        dto.setUserId(query.getUser().getId());
        dto.setUserName(query.getUser().getName());
        dto.setUserRole(query.getUser().getRole().name());
        return dto;
    }
}