package com.na.medical_mobile_app.utils;

import com.na.medical_mobile_app.entities.MedicalForm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MedicalFormMapper {

    public static List<Map<String, Object>> toSimpleList(List<MedicalForm> forms) {
        return forms.stream()
                .map(MedicalFormMapper::toSimpleMap)
                .collect(Collectors.toList());
    }

    public static Map<String, Object> toSimpleMap(MedicalForm form) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", form.getFormId());
        data.put("patientId", form.getPatient().getPatientId());
        data.put("fullName", form.getPatient().getName());
        data.put("submissionDate", form.getCreatedAt());
        data.put("status", form.getStatus().toString());
        data.put("birthDate", form.getPatient().getBirthdate());
        data.put("gender", form.getPatient().getGender().toString());
        data.put("phoneNumber", form.getPatient().getPhone());
        data.put("address", form.getPatient().getAddress());
        data.put("lastSeizureDate", form.getDateLastSeizure());
        return data;
    }
}
