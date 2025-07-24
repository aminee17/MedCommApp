// File: DoctorResponseDTO.java
package com.na.medical_mobile_app.DTOs;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DoctorResponseDTO {
    private String name;
    private String email;
    private String password;

    public DoctorResponseDTO(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }


}
