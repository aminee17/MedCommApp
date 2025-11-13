package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    @PostConstruct
    @Transactional
    public void initializeData() {
        // Only initialize if database is empty
        if (governorateRepository.count() == 0) {
            initializeGovernoratesAndCities();
        }
    }

    private void initializeGovernoratesAndCities() {
        LocalDateTime now = LocalDateTime.now();

        // Create and save all Tunisian governorates
        List<Governorate> governorates = Arrays.asList(
            createGovernorate(1, "Tunis", "TN-11", now),
            createGovernorate(2, "Ariana", "TN-12", now),
            createGovernorate(3, "Ben Arous", "TN-13", now),
            createGovernorate(4, "Manouba", "TN-14", now),
            createGovernorate(5, "Nabeul", "TN-21", now),
            createGovernorate(6, "Zaghouan", "TN-22", now),
            createGovernorate(7, "Bizerte", "TN-23", now),
            createGovernorate(8, "Béja", "TN-31", now),
            createGovernorate(9, "Jendouba", "TN-32", now),
            createGovernorate(10, "Kef", "TN-33", now),
            createGovernorate(11, "Siliana", "TN-34", now),
            createGovernorate(12, "Sousse", "TN-51", now),
            createGovernorate(13, "Monastir", "TN-52", now),
            createGovernorate(14, "Mahdia", "TN-53", now),
            createGovernorate(15, "Sfax", "TN-61", now),
            createGovernorate(16, "Kairouan", "TN-41", now),
            createGovernorate(17, "Kasserine", "TN-42", now),
            createGovernorate(18, "Sidi Bouzid", "TN-43", now),
            createGovernorate(19, "Gabès", "TN-71", now),
            createGovernorate(20, "Medenine", "TN-72", now),
            createGovernorate(21, "Tataouine", "TN-73", now),
            createGovernorate(22, "Gafsa", "TN-81", now),
            createGovernorate(23, "Tozeur", "TN-82", now),
            createGovernorate(24, "Kebili", "TN-83", now)
        );

        List<Governorate> savedGovernorates = governorateRepository.saveAll(governorates);

        // Create and save cities for each governorate
        initializeCities(savedGovernorates, now);
    }

    private Governorate createGovernorate(Integer id, String name, String code, LocalDateTime createdAt) {
        Governorate governorate = new Governorate();
        governorate.setId(id);
        governorate.setName(name);
        governorate.setCode(code);
        governorate.setCreatedAt(createdAt);
        return governorate;
    }

    private void initializeCities(List<Governorate> governorates, LocalDateTime now) {
        List<City> allCities = Arrays.asList(
            // Tunis (1) - All municipalities
            createCity("Bab Bhar", governorates.get(0), now),
            createCity("Bab Souika", governorates.get(0), now),
            createCity("Cité El Khadra", governorates.get(0), now),
            createCity("El Kabaria", governorates.get(0), now),
            createCity("El Menzah", governorates.get(0), now),
            createCity("El Omrane", governorates.get(0), now),
            createCity("El Omrane Supérieur", governorates.get(0), now),
            createCity("Ettahrir", governorates.get(0), now),
            createCity("Ezzouhour", governorates.get(0), now),
            createCity("Hraïria", governorates.get(0), now),
            createCity("La Goulette", governorates.get(0), now),
            createCity("La Marsa", governorates.get(0), now),
            createCity("Le Bardo", governorates.get(0), now),
            createCity("Le Kram", governorates.get(0), now),
            createCity("Médina", governorates.get(0), now),
            createCity("Séjoumi", governorates.get(0), now),
            createCity("Sidi El Béchir", governorates.get(0), now),
            createCity("Sidi Hassine", governorates.get(0), now),

            // Ariana (2)
            createCity("Ariana Ville", governorates.get(1), now),
            createCity("Ettadhamen", governorates.get(1), now),
            createCity("Kalâat el-Andalous", governorates.get(1), now),
            createCity("La Soukra", governorates.get(1), now),
            createCity("Mnihla", governorates.get(1), now),
            createCity("Raoued", governorates.get(1), now),
            createCity("Sidi Thabet", governorates.get(1), now),

            // Ben Arous (3)
            createCity("Ben Arous", governorates.get(2), now),
            createCity("Bou Mhel el-Bassatine", governorates.get(2), now),
            createCity("El Mourouj", governorates.get(2), now),
            createCity("Ezzahra", governorates.get(2), now),
            createCity("Fouchana", governorates.get(2), now),
            createCity("Hammam Chott", governorates.get(2), now),
            createCity("Hammam Lif", governorates.get(2), now),
            createCity("Mohamedia", governorates.get(2), now),
            createCity("Medina Jedida", governorates.get(2), now),
            createCity("Megrine", governorates.get(2), now),
            createCity("Mornag", governorates.get(2), now),
            createCity("Rades", governorates.get(2), now),

            // Manouba (4)
            createCity("Manouba", governorates.get(3), now),
            createCity("Borj El Amri", governorates.get(3), now),
            createCity("Den Den", governorates.get(3), now),
            createCity("Douar Hicher", governorates.get(3), now),
            createCity("El Battan", governorates.get(3), now),
            createCity("Jedaida", governorates.get(3), now),
            createCity("Mornaguia", governorates.get(3), now),
            createCity("Oued Ellil", governorates.get(3), now),
            createCity("Tebourba", governorates.get(3), now),

            // Nabeul (5)
            createCity("Nabeul", governorates.get(4), now),
            createCity("Béni Khalled", governorates.get(4), now),
            createCity("Béni Khiar", governorates.get(4), now),
            createCity("Bou Argoub", governorates.get(4), now),
            createCity("Dar Châabane", governorates.get(4), now),
            createCity("El Haouaria", governorates.get(4), now),
            createCity("El Mida", governorates.get(4), now),
            createCity("Grombalia", governorates.get(4), now),
            createCity("Hammam Ghezèze", governorates.get(4), now),
            createCity("Hammamet", governorates.get(4), now),
            createCity("Kélibia", governorates.get(4), now),
            createCity("Korba", governorates.get(4), now),
            createCity("Menzel Bouzelfa", governorates.get(4), now),
            createCity("Menzel Temime", governorates.get(4), now),
            createCity("Soliman", governorates.get(4), now),
            createCity("Takelsa", governorates.get(4), now),

            // Zaghouan (6)
            createCity("Zaghouan", governorates.get(5), now),
            createCity("Bir Mcherga", governorates.get(5), now),
            createCity("El Fahs", governorates.get(5), now),
            createCity("Nadhour", governorates.get(5), now),
            createCity("Saouaf", governorates.get(5), now),
            createCity("Zriba", governorates.get(5), now),

            // Bizerte (7)
            createCity("Bizerte", governorates.get(6), now),
            createCity("Aousja", governorates.get(6), now),
            createCity("El Alia", governorates.get(6), now),
            createCity("Ghar El Melh", governorates.get(6), now),
            createCity("Mateur", governorates.get(6), now),
            createCity("Menzel Bourguiba", governorates.get(6), now),
            createCity("Menzel Jemil", governorates.get(6), now),
            createCity("Ras Jebel", governorates.get(6), now),
            createCity("Sejnane", governorates.get(6), now),
            createCity("Tinja", governorates.get(6), now),
            createCity("Zarzouna", governorates.get(6), now),

            // Béja (8)
            createCity("Béja", governorates.get(7), now),
            createCity("Amdoun", governorates.get(7), now),
            createCity("Goubellat", governorates.get(7), now),
            createCity("Medjez el-Bab", governorates.get(7), now),
            createCity("Nefza", governorates.get(7), now),
            createCity("Teboursouk", governorates.get(7), now),
            createCity("Testour", governorates.get(7), now),
            createCity("Thibar", governorates.get(7), now),

            // Jendouba (9)
            createCity("Jendouba", governorates.get(8), now),
            createCity("Aïn Draham", governorates.get(8), now),
            createCity("Balta-Bou Aouane", governorates.get(8), now),
            createCity("Bou Salem", governorates.get(8), now),
            createCity("Fernana", governorates.get(8), now),
            createCity("Ghardimaou", governorates.get(8), now),
            createCity("Oued Meliz", governorates.get(8), now),
            createCity("Tabarka", governorates.get(8), now),

            // Kef (10)
            createCity("Le Kef", governorates.get(9), now),
            createCity("Dahmani", governorates.get(9), now),
            createCity("Jérissa", governorates.get(9), now),
            createCity("El Ksour", governorates.get(9), now),
            createCity("Sers", governorates.get(9), now),
            createCity("Tajerouine", governorates.get(9), now),
            createCity("Kalâat Khasba", governorates.get(9), now),
            createCity("Nebeur", governorates.get(9), now),
            createCity("Sakiet Sidi Youssef", governorates.get(9), now),

            // Siliana (11)
            createCity("Siliana", governorates.get(10), now),
            createCity("Bou Arada", governorates.get(10), now),
            createCity("El Aroussa", governorates.get(10), now),
            createCity("Gaâfour", governorates.get(10), now),
            createCity("Kesra", governorates.get(10), now),
            createCity("Makthar", governorates.get(10), now),
            createCity("Rohia", governorates.get(10), now),
            createCity("Sidi Bou Rouis", governorates.get(10), now),

            // Sousse (12)
            createCity("Sousse", governorates.get(11), now),
            createCity("Akouda", governorates.get(11), now),
            createCity("Bouficha", governorates.get(11), now),
            createCity("Enfidha", governorates.get(11), now),
            createCity("Hammam Sousse", governorates.get(11), now),
            createCity("Hergla", governorates.get(11), now),
            createCity("Kalaa Kebira", governorates.get(11), now),
            createCity("Kalaa Seghira", governorates.get(11), now),
            createCity("Kondar", governorates.get(11), now),
            createCity("Msaken", governorates.get(11), now),
            createCity("Sidi Bou Ali", governorates.get(11), now),
            createCity("Sidi El Hani", governorates.get(11), now),

            // Monastir (13)
            createCity("Monastir", governorates.get(12), now),
            createCity("Bekalta", governorates.get(12), now),
            createCity("Bembla", governorates.get(12), now),
            createCity("Beni Hassen", governorates.get(12), now),
            createCity("Jemmal", governorates.get(12), now),
            createCity("Ksar Hellal", governorates.get(12), now),
            createCity("Ksibet el-Médiouni", governorates.get(12), now),
            createCity("Moknine", governorates.get(12), now),
            createCity("Ouerdanine", governorates.get(12), now),
            createCity("Sahline", governorates.get(12), now),
            createCity("Sayada-Lamta-Bou Hajar", governorates.get(12), now),
            createCity("Téboulba", governorates.get(12), now),
            createCity("Zéramdine", governorates.get(12), now),

            // Mahdia (14)
            createCity("Mahdia", governorates.get(13), now),
            createCity("Bou Merdes", governorates.get(13), now),
            createCity("Chebba", governorates.get(13), now),
            createCity("Chorbane", governorates.get(13), now),
            createCity("El Jem", governorates.get(13), now),
            createCity("Essouassi", governorates.get(13), now),
            createCity("Hbira", governorates.get(13), now),
            createCity("Ksour Essef", governorates.get(13), now),
            createCity("Melloulèche", governorates.get(13), now),
            createCity("Ouled Chamekh", governorates.get(13), now),
            createCity("Sidi Alouane", governorates.get(13), now),

            // Sfax (15)
            createCity("Sfax", governorates.get(14), now),
            createCity("Agareb", governorates.get(14), now),
            createCity("Bir Ali Ben Khalifa", governorates.get(14), now),
            createCity("El Amra", governorates.get(14), now),
            createCity("El Hencha", governorates.get(14), now),
            createCity("Graïba", governorates.get(14), now),
            createCity("Jebiniana", governorates.get(14), now),
            createCity("Kerkennah", governorates.get(14), now),
            createCity("Mahrès", governorates.get(14), now),
            createCity("Menzel Chaker", governorates.get(14), now),
            createCity("Sakiet Ezzit", governorates.get(14), now),
            createCity("Sakiet Eddaïer", governorates.get(14), now),
            createCity("Skhira", governorates.get(14), now),

            // Kairouan (16)
            createCity("Kairouan", governorates.get(15), now),
            createCity("Bou Hajla", governorates.get(15), now),
            createCity("Chebika", governorates.get(15), now),
            createCity("Echrarda", governorates.get(15), now),
            createCity("Haffouz", governorates.get(15), now),
            createCity("Hajeb El Ayoun", governorates.get(15), now),
            createCity("Nasrallah", governorates.get(15), now),
            createCity("Oueslatia", governorates.get(15), now),
            createCity("Sbikha", governorates.get(15), now),

            // Kasserine (17)
            createCity("Kasserine", governorates.get(16), now),
            createCity("Fériana", governorates.get(16), now),
            createCity("Foussana", governorates.get(16), now),
            createCity("Haïdra", governorates.get(16), now),
            createCity("Hassi El Ferid", governorates.get(16), now),
            createCity("Jedelienne", governorates.get(16), now),
            createCity("Magel Bel Abbès", governorates.get(16), now),
            createCity("Sbeïtla", governorates.get(16), now),
            createCity("Sbiba", governorates.get(16), now),
            createCity("Thala", governorates.get(16), now),

            // Sidi Bouzid (18)
            createCity("Sidi Bouzid", governorates.get(17), now),
            createCity("Bir El Hafey", governorates.get(17), now),
            createCity("Cebbala Ouled Asker", governorates.get(17), now),
            createCity("Jilma", governorates.get(17), now),
            createCity("Meknassy", governorates.get(17), now),
            createCity("Menzel Bouzaiane", governorates.get(17), now),
            createCity("Mezzouna", governorates.get(17), now),
            createCity("Ouled Haffouz", governorates.get(17), now),
            createCity("Regueb", governorates.get(17), now),
            createCity("Souk Jedid", governorates.get(17), now),

            // Gabès (19)
            createCity("Gabès", governorates.get(18), now),
            createCity("Ghannouch", governorates.get(18), now),
            createCity("El Hamma", governorates.get(18), now),
            createCity("Mareth", governorates.get(18), now),
            createCity("Matmata", governorates.get(18), now),
            createCity("Menzel El Habib", governorates.get(18), now),
            createCity("Métouia", governorates.get(18), now),

            // Medenine (20)
            createCity("Medenine", governorates.get(19), now),
            createCity("Ben Gardane", governorates.get(19), now),
            createCity("Beni Khedache", governorates.get(19), now),
            createCity("Djerba - Ajim", governorates.get(19), now),
            createCity("Djerba - Houmt Souk", governorates.get(19), now),
            createCity("Djerba - Midoun", governorates.get(19), now),
            createCity("Zarzis", governorates.get(19), now),
            createCity("Sidi Makhlouf", governorates.get(19), now),

            // Tataouine (21)
            createCity("Tataouine", governorates.get(20), now),
            createCity("Bir Lahmar", governorates.get(20), now),
            createCity("Dehiba", governorates.get(20), now),
            createCity("Ghomrassen", governorates.get(20), now),
            createCity("Remada", governorates.get(20), now),
            createCity("Smâr", governorates.get(20), now),

            // Gafsa (22)
            createCity("Gafsa", governorates.get(21), now),
            createCity("El Guettar", governorates.get(21), now),
            createCity("El Ksar", governorates.get(21), now),
            createCity("Mdhilla", governorates.get(21), now),
            createCity("Métlaoui", governorates.get(21), now),
            createCity("Moularès", governorates.get(21), now),
            createCity("Redeyef", governorates.get(21), now),
            createCity("Sened", governorates.get(21), now),

            // Tozeur (23)
            createCity("Tozeur", governorates.get(22), now),
            createCity("Degache", governorates.get(22), now),
            createCity("Hazoua", governorates.get(22), now),
            createCity("Nefta", governorates.get(22), now),
            createCity("Tamerza", governorates.get(22), now),

            // Kebili (24)
            createCity("Kebili", governorates.get(23), now),
            createCity("Douz", governorates.get(23), now),
            createCity("El Golâa", governorates.get(23), now),
            createCity("Souk Lahad", governorates.get(23), now)
        );

        cityRepository.saveAll(allCities);
    }

    private City createCity(String name, Governorate governorate, LocalDateTime createdAt) {
        City city = new City();
        city.setName(name);
        city.setGovernorate(governorate);
        city.setCreatedAt(createdAt);
        return city;
    }
}