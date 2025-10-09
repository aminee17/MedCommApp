package com.na.medical_mobile_app.config;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataSeeder {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void seedOnStartup() {
        seedGovernoratesAndDefaultCities();
    }

    private void seedGovernoratesAndDefaultCities() {
        List<String> tnGovernorates = Arrays.asList(
                "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
                "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
                "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
                "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
        );

        Map<String, List<String>> citiesByGov = new HashMap<>();
        citiesByGov.put("Tunis", Arrays.asList("Tunis", "La Marsa", "Carthage", "Sidi Bou Saïd", "Le Kram", "La Goulette", "El Menzah", "El Omrane", "Bab Souika"));
        citiesByGov.put("Ariana", Arrays.asList("Ariana", "Raoued", "La Soukra", "Sidi Thabet", "Kalaat el-Andalous"));
        citiesByGov.put("Ben Arous", Arrays.asList("Ben Arous", "Ezzahra", "Rades", "Hammam Lif", "Hammam Chott", "Megrine", "Mornag", "Mohamedia"));
        citiesByGov.put("Manouba", Arrays.asList("Manouba", "Oued Ellil", "Douar Hicher", "Den Den", "Mornaguia", "Tebourba", "Borj El Amri", "El Batan", "Jedaida"));
        citiesByGov.put("Nabeul", Arrays.asList("Nabeul", "Hammamet", "Kelibia", "Dar Chaabane", "Menzel Temime", "Korba", "Menzel Bouzelfa", "Grombalia", "Beni Khiar"));
        citiesByGov.put("Zaghouan", Arrays.asList("Zaghouan", "Zriba", "Fahs", "Nadhour", "Bir Mcherga", "Djebel Oust"));
        citiesByGov.put("Bizerte", Arrays.asList("Bizerte", "Menzel Bourguiba", "Mateur", "Ghar El Melh", "Ras Jebel", "Utique", "Ghezala", "Tinja"));
        citiesByGov.put("Béja", Arrays.asList("Béja", "Téboursouk", "Testour", "Nefza", "Amdoun", "Goubellat", "Medjez el-Bab"));
        citiesByGov.put("Jendouba", Arrays.asList("Jendouba", "Tabarka", "Aïn Draham", "Bousalem", "Fernana", "Ghardimaou", "Oued Melliz"));
        citiesByGov.put("Kef", Arrays.asList("Le Kef", "Tajerouine", "Sakiet Sidi Youssef", "Nebeur", "Kalaat es Senam", "Kalaat Khasba", "Dahmani"));
        citiesByGov.put("Siliana", Arrays.asList("Siliana", "Makthar", "Rouhia", "Bouarada", "Kesra", "Bargou", "Brikcha"));
        citiesByGov.put("Sousse", Arrays.asList("Sousse", "Hammam Sousse", "Akouda", "Msaken", "Kalaa Kebira", "Kalaa Seghira", "Enfidha", "Hergla"));
        citiesByGov.put("Monastir", Arrays.asList("Monastir", "Sahline", "Moknine", "Jemmal", "Zeramdine", "Bekalta", "Teboulba", "Beni Hassen"));
        citiesByGov.put("Mahdia", Arrays.asList("Mahdia", "Chebba", "El Jem", "Ksour Essef", "Melloulèche", "Sidi Alouane", "Ouled Chamekh"));
        citiesByGov.put("Sfax", Arrays.asList("Sfax", "Sakiet Ezzit", "Sakiet Eddaïer", "Gremda", "Agareb", "Jebeniana", "Kerkennah", "El Hencha", "Mahres"));
        citiesByGov.put("Kairouan", Arrays.asList("Kairouan", "Chebika", "Sbikha", "Haffouz", "Oueslatia", "Hajeb El Ayoun", "Bou Hajla"));
        citiesByGov.put("Kasserine", Arrays.asList("Kasserine", "Thala", "Sbeitla", "Feriana", "Foussana", "Haidra", "Majel Bel Abbes"));
        citiesByGov.put("Sidi Bouzid", Arrays.asList("Sidi Bouzid", "Regueb", "Jilma", "Meknassy", "Bir El Hafey", "Menzel Bouzaiane", "Souk Jedid"));
        citiesByGov.put("Gabès", Arrays.asList("Gabès", "Ghannouch", "Mareth", "Metouia", "Chenini Nahal", "Menzel El Habib", "El Hamma"));
        citiesByGov.put("Medenine", Arrays.asList("Medenine", "Zarzis", "Ben Gardane", "Djerba Houmt Souk", "Midoun", "Ajim"));
        citiesByGov.put("Tataouine", Arrays.asList("Tataouine", "Ghomrassen", "Remada", "Bir Lahmar", "Dehiba"));
        citiesByGov.put("Gafsa", Arrays.asList("Gafsa", "Metlaoui", "Redeyef", "Moulares", "El Ksar", "Mdhilla", "Sned"));
        citiesByGov.put("Tozeur", Arrays.asList("Tozeur", "Nefta", "Degache", "Tameghza", "Hazoua"));
        citiesByGov.put("Kebili", Arrays.asList("Kebili", "Douz", "Souk Lahad", "El Golaa", "Faouar"));

        for (String name : tnGovernorates) {
            Governorate governorate = governorateRepository.findByName(name);
            if (governorate == null) {
                governorate = new Governorate();
                governorate.setName(name);
                governorate = governorateRepository.save(governorate);
            }

            List<City> existing = cityRepository.findByGovernorate(governorate);
            Set<String> existingNames = new HashSet<>();
            for (City c : existing) {
                existingNames.add(c.getName());
            }

            List<String> cities = citiesByGov.getOrDefault(name, Collections.singletonList(name + " Ville"));
            for (String cityName : cities) {
                if (!existingNames.contains(cityName)) {
                    City city = new City();
                    city.setName(cityName);
                    city.setGovernorate(governorate);
                    cityRepository.save(city);
                }
            }
        }
    }
}




