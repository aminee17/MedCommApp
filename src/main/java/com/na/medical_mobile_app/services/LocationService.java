package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class LocationService {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    public List<Governorate> getAllGovernorates() {
        // Vérifier si la base contient des gouvernorats
        List<Governorate> existingGovernorates = governorateRepository.findAll();
        
        if (existingGovernorates.isEmpty()) {
            // Initialiser les 24 gouvernorats tunisiens
            initializeGovernorates();
            // Relire les données
            return governorateRepository.findAll();
        }
        
        return existingGovernorates;
    }

    private void initializeGovernorates() {
        System.out.println("🚀 Initialisation des 24 gouvernorats tunisiens...");
        
        List<Governorate> allGovernorates = Arrays.asList(
            createGovernorate(1, "Ariana"),
            createGovernorate(2, "Béja"),
            createGovernorate(3, "Ben Arous"),
            createGovernorate(4, "Bizerte"),
            createGovernorate(5, "Gabès"),
            createGovernorate(6, "Gafsa"),
            createGovernorate(7, "Jendouba"),
            createGovernorate(8, "Kairouan"),
            createGovernorate(9, "Kasserine"),
            createGovernorate(10, "Kébili"),
            createGovernorate(11, "Le Kef"),
            createGovernorate(12, "Mahdia"),
            createGovernorate(13, "La Manouba"),
            createGovernorate(14, "Médenine"),
            createGovernorate(15, "Monastir"),
            createGovernorate(16, "Nabeul"),
            createGovernorate(17, "Sfax"),
            createGovernorate(18, "Sidi Bouzid"),
            createGovernorate(19, "Siliana"),
            createGovernorate(20, "Sousse"),
            createGovernorate(21, "Tataouine"),
            createGovernorate(22, "Tozeur"),
            createGovernorate(23, "Tunis"),
            createGovernorate(24, "Zaghouan")
        );

        governorateRepository.saveAll(allGovernorates);
        System.out.println("✅ 24 gouvernorats tunisiens initialisés avec succès!");
    }

    private Governorate createGovernorate(Integer id, String name) {
        Governorate gov = new Governorate();
        gov.setId(id);
        gov.setName(name);
        gov.setCreatedAt(LocalDateTime.now());
        return gov;
    }

    public List<City> getCitiesByGovernorate(Integer governorateId) {
        return cityRepository.findByGovernorateId(governorateId);
    }
}
