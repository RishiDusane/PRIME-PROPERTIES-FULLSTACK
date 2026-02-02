//package com.exam.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import com.exam.entity.Query;
//import com.exam.repository.QueryRepository;
//
//@RestController
//@RequestMapping("/api/queries")
//@CrossOrigin(origins = "http://localhost:5173")
//public class QueryController {
//
//    @Autowired
//    private QueryRepository repo;
//
//    // ✅ GET queries for logged-in user / admin
//    @GetMapping
//    public List<Query> getQueries(Authentication auth) {
//        String email = auth.getName();
//
//        if (auth.getAuthorities().stream()
//                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
//            return repo.findAll();
//        }
//
//        return repo.findByUserEmail(email);
//    }
//
//    // ✅ CREATE query
//    @PostMapping
//    public Query create(@RequestBody Query q, Authentication auth) {
//        q.setStatus("PENDING");
//        return repo.save(q);
//    }
//
//    // ✅ ADMIN RESPOND
//    @PutMapping("/{id}/respond")
//    public Query respond(@PathVariable Long id, @RequestBody Query body) {
//        Query q = repo.findById(id).orElseThrow();
//        q.setAdminResponse(body.getAdminResponse());
//        q.setStatus("RESOLVED");
//        return repo.save(q);
//    }
//}

//2//
//package com.exam.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.exam.entity.Query;
//import com.exam.entity.User;
//import com.exam.repository.QueryRepository;
//import com.exam.repository.UserRepository;
//
//@RestController
//@RequestMapping("/api/queries")
//public class QueryController {
//
//    @Autowired
//    private QueryRepository queryRepo;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    // CUSTOMER / OWNER – create query
//    @PostMapping
//    public Query createQuery(@RequestBody Query q,
//                             @RequestHeader("userId") Long userId) {
//        User user = userRepo.findById(userId).orElseThrow();
//        q.setUser(user);
//        q.setStatus("PENDING");
//        return queryRepo.save(q);
//    }
//
//    // CUSTOMER / OWNER – view own queries
//    @GetMapping("/my")
//    public List<Query> myQueries(@RequestHeader("userId") Long userId) {
//        return queryRepo.findByUserId(userId);
//    }
//
//    // ADMIN – view all queries
//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<Query> allQueries() {
//        return queryRepo.findAll();
//    }
//
//    // ADMIN – respond + update status
//    @PutMapping("/{id}/respond")
//    @PreAuthorize("hasRole('ADMIN')")
//    public Query respond(@PathVariable Long id,
//                         @RequestBody Map<String, String> body) {
//
//        Query q = queryRepo.findById(id).orElseThrow();
//        q.setAdminResponse(body.get("response"));
//        q.setStatus(body.get("status")); // IN_PROGRESS / RESOLVED
//        return queryRepo.save(q);
//    }
//}

//3
package com.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.QueryDTO;
import com.exam.dto.QueryRequest;
import com.exam.service.QueryService;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "http://localhost:5173")
public class QueryController {

    @Autowired
    private QueryService queryService;

    @GetMapping("/my")
    public ResponseEntity<List<QueryDTO>> myQueries(Authentication auth) {
        return ResponseEntity.ok(queryService.getMyQueries(auth.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QueryDTO>> allQueries() {
        return ResponseEntity.ok(queryService.getAllQueriesForAdmin());
    }

    @PostMapping
    public ResponseEntity<QueryDTO> create(@RequestBody QueryRequest q, Authentication auth) {
        return ResponseEntity.ok(queryService.saveQuery(q, auth.getName()));
    }

    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QueryDTO> respond(@PathVariable Long id, @RequestBody QueryDTO dto) {
        return ResponseEntity.ok(queryService.updateAdminResponse(id, dto));
    }
}