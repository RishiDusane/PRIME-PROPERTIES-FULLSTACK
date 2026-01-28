// springboot_backend_template/src/main/java/com/exam/dto/ChangePasswordRequest.java

package com.exam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank
    private String oldPassword;
    
    @NotBlank
    private String newPassword;
}