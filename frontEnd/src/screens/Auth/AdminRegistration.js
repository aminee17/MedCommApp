import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, ActivityIndicator,
    KeyboardAvoidingView, Platform} from 'react-native';
import { API_BASE_URL } from '../../utils/constants';
import { Picker } from "@react-native-picker/picker";
import { isStrongPassword } from '../../utils/validation';
import useLocations from '../../hooks/useLocations';
import { parseJSONResponse } from '../../utils/jsonUtils';

import styles from './styles';

export default function AdminRegistration({ navigation }) {
    const { governorates, cities, fetchCities } = useLocations();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cin: '',
        governorate: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGovernorateChange = (governorateId) => {
        setFormData(prev => ({
            ...prev,
            governorate: governorateId,
            city: '' // Reset city when governorate changes
        }));
        if (governorateId) {
            fetchCities(governorateId);
        }
    };

    const validateForm = () => {
        // Required fields
        if (!formData.name || !formData.email || !formData.password || !formData.cin) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert('Erreur', 'Format d\'email invalide');
            return false;
        }

        // CIN validation
        if (isNaN(formData.cin)) {
            Alert.alert('Erreur', 'Le CIN doit être un nombre');
            return false;
        }

        // Strong password validation
        if (!isStrongPassword(formData.password)) {
            Alert.alert(
                'Mot de passe faible',
                'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cin: Number(formData.cin),
                    governorate_id: formData.governorate ? Number(formData.governorate) : null,
                    city_id: formData.city ? Number(formData.city) : null,
                }),
            });

            await parseJSONResponse(response);

            Alert.alert('Succès', 'Compte administrateur créé avec succès', [
                { text: 'OK', onPress: () => navigation.navigate('AdminLogin') },
            ]);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100} // Adjust if needed
        >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Création de Compte Administrateur</Text>

            <TextInput
                placeholder="Nom complet *"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                style={styles.input}
            />

            <TextInput
                placeholder="Email *"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Mot de passe *"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.input}
                secureTextEntry
            />

            <TextInput
                placeholder="Téléphone"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                style={styles.input}
                keyboardType="phone-pad"
            />

            <TextInput
                placeholder="CIN *"
                value={formData.cin}
                onChangeText={(value) => handleInputChange('cin', value)}
                style={styles.input}
                keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Région</Text>
                <Picker
                    selectedValue={formData.governorate}
                    onValueChange={handleGovernorateChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner une région" value="" />
                    {governorates.map(gov => (
                        <Picker.Item key={gov.id} label={gov.name} value={gov.id.toString()} />
                    ))}
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Ville</Text>
                <Picker
                    selectedValue={formData.city}
                    onValueChange={(value) => handleInputChange('city', value)}
                    style={styles.picker}
                    enabled={formData.governorate !== ''}
                >
                    <Picker.Item label="Sélectionner une ville" value="" />
                    {cities.map(city => (
                        <Picker.Item key={city.id} label={city.name} value={city.id.toString()} />
                    ))}
                </Picker>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
            ) : (
                <>
                    <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Créer le compte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
            </KeyboardAvoidingView>
    );
}

