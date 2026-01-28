package com.exam.service;

import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.auth.PasswordResetToken;
import com.exam.auth.PasswordResetTokenRepository;
import com.exam.auth.VerificationToken;
import com.exam.auth.VerificationTokenRepository;
import com.exam.dto.UserDTO;
import com.exam.entity.User;
import com.exam.exception.ResourceNotFoundException;
import com.exam.repository.UserRepository;
import com.exam.security.JwtUtils;

@Service
@Transactional
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private ModelMapper mapper;
    @Autowired private JwtUtils jwtUtils;
    @Autowired(required = false) private JavaMailSender mailSender; 
    @Autowired private VerificationTokenRepository verificationTokenRepo;
    @Autowired private PasswordResetTokenRepository passwordResetTokenRepo;

    private static final int VERIFICATION_TOKEN_MIN = 60 * 24; 
    private static final int PASSWORD_RESET_TOKEN_MIN = 60; 

    public String register(UserDTO dto) {
        if (dto == null) throw new IllegalArgumentException("User data is required");
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = mapper.map(dto, User.class);
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setVerified(false); 
        userRepo.save(user);
        log.info("Registered new user: {}", user.getEmail());

        VerificationToken vtoken = new VerificationToken(user, VERIFICATION_TOKEN_MIN);
        verificationTokenRepo.save(vtoken);

        String verifyLink = "http://localhost:5173/verify?token=" + vtoken.getToken();
        String body = "Welcome to PrimeProperties!\n\nPlease verify your email by clicking the link below:\n" + verifyLink;
        try {
            sendEmailIfPossible(user.getEmail(), "Verify your email - PrimeProperties", body);
        } catch (Exception e) {
            log.warn("Failed to send verification email: {}", e.getMessage());
        }
        return "User registered. Verification email sent.";
    }

    public void verifyUser(String token) {
        if (token == null || token.isBlank()) throw new IllegalArgumentException("Token is required");
        VerificationToken v = verificationTokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        
        if (v.isExpired()) {
            verificationTokenRepo.delete(v);
            throw new RuntimeException("Verification token expired");
        }
        
        User user = v.getUser();
        user.setVerified(true);
        userRepo.save(user);
        
        // Delete token only after the user is successfully marked as verified
        verificationTokenRepo.delete(v);
        log.info("User {} successfully verified", user.getEmail());
    }

    public void createPasswordResetTokenAndSendEmail(String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email is required");
        Optional<User> opt = userRepo.findByEmail(email);
        opt.ifPresent(user -> {
            passwordResetTokenRepo.findByUser(user).ifPresent(existingToken -> {
                passwordResetTokenRepo.delete(existingToken);
                passwordResetTokenRepo.flush(); 
            });

            PasswordResetToken prt = new PasswordResetToken(user, PASSWORD_RESET_TOKEN_MIN);
            passwordResetTokenRepo.save(prt);
            
            String resetLink = "http://localhost:5173/reset-password?token=" + prt.getToken();
            String body = "You requested a password reset. Click link:\n" + resetLink;
            try {
                sendEmailIfPossible(user.getEmail(), "Password Reset - PrimeProperties", body);
            } catch (Exception e) {
                log.error("Failed to send reset email: ", e);
            }
        });
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));
        if (prt.isExpired()) {
            passwordResetTokenRepo.delete(prt);
            throw new RuntimeException("Password reset token expired");
        }
        User user = prt.getUser();
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
        passwordResetTokenRepo.delete(prt);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!encoder.matches(oldPassword, user.getPassword())) throw new RuntimeException("Old password is incorrect");
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
    }

    public UserDTO login(String email, String password) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isVerified()) throw new RuntimeException("Email not verified.");
        if (!encoder.matches(password, user.getPassword())) throw new RuntimeException("Invalid credentials");

        String token = jwtUtils.generateToken(email);
        UserDTO response = mapper.map(user, UserDTO.class);
        response.setPassword(null);
        response.setToken(token);
        return response;
    }

    private void sendEmailIfPossible(String to, String subject, String body) {
        if (mailSender == null) return;
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }
}