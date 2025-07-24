package com.na.medical_mobile_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import com.na.medical_mobile_app.services.MedicalFormService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDate;
/*
To simplify the code we will test using this one and not the test branch
 */


@SpringBootApplication(scanBasePackages = "com.na.medical_mobile_app")
public class MedicalMobileAppApplication {

    @Autowired
    private MedicalFormService medicalFormService;

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    public static void main(String[] args) {
        SpringApplication.run(MedicalMobileAppApplication.class, args);
    }
    @EventListener(ApplicationReadyEvent.class)
    public void testAfterStartup() {
        // Décommente pour exécuter un test
         //testSaveMedicalForm();

    }





    /*private void testSaveMedicalForm() {
        System.out.println("=== TEST: SAVE MEDICAL FORM ===");

        Governorate governorate = new Governorate();
        governorate.setName("Tunis");
        governorate = governorateRepository.save(governorate);

        City city = new City();
        city.setName("Tunis Centre");
        city.setGovernorate(governorate);
        city = cityRepository.save(city);

        MedicalFormRequest request = new MedicalFormRequest();
        request.fullName = "Nada Aouiti";
        request.birthDate = LocalDate.of(2001, 2, 11);
        request.gender = Gender.F;
        request.cinNumber = 12345678L;
        request.region = governorate;
        request.city = city;
        request.address = "123 Rue du Test";
        request.phoneNumber = "21234567";
        request.firstSeizureDate = LocalDate.of(2020, 1, 1);
        request.lastSeizureDate = LocalDate.of(2024, 1, 1);
        request.totalSeizures = 11;
        request.seizureDuration = 2;
        request.isFirstSeizure = false;
        request.hasAura = true;
        request.auraDescription = "Flash lumineux";
        request.mriPhoto = "/uploads/mri.jpg";
        request.seizureVideo = "/uploads/seizure.mp4";
        request.videofileSize = 2048L;
        request.mrifileSize = 2048L;

        try {
            Integer formId = medicalFormService.saveMedicalForm(request);
            System.out.println(" Formulaire enregistré avec succès ! ID = " + formId);
        } catch (Exception e) {
            System.out.println("Erreur : " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("=== FIN DU TEST ===");
    }*/

}

