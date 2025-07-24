import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { API_BASE_URL } from '../../utils/constants';
import { Picker } from "@react-native-picker/picker";
import useLocations from '../../hooks/useLocations';
import { parseJSONResponse } from '../../utils/jsonUtils';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';
import { Button, Input, Card, Header } from '../../components/common';

export default function DoctorRegistration({ navigation }) {
    const { governorates, cities, fetchCities } = useLocations();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cin: '',
        licenseNumber: '',
        governorate: '',
        city: '',
        specialization: '',
        role: ''
    });

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
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert("Erreur", "Format d'email invalide");
            return false;
        }

        // Required fields
        if (!formData.name || !formData.email || !formData.cin || !formData.licenseNumber) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return false;
        }

        if (!formData.role) {
            Alert.alert("Erreur", "Veuillez sélectionner un rôle");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Convert CIN to a number
            const cinNumber = parseInt(formData.cin);
            if (isNaN(cinNumber)) {
                throw new Error("Le CIN doit être un nombre");
            }

            const response = await fetch(`${API_BASE_URL}/api/doctor/request-account`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    cin: cinNumber,
                    licenseNumber: formData.licenseNumber,
                    role: formData.role,
                    governorate_id: formData.governorate ? parseInt(formData.governorate) : null,
                    city_id: formData.city ? parseInt(formData.city) : null,
                    specialization: formData.specialization || null,
                    hospitalAffiliation: null
                }),
                credentials: 'include' // Include credentials for session cookies
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Erreur lors de l\'envoi de la demande');
            }

            Alert.alert('Succès', 'Demande envoyée avec succès', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Erreur', error.message || 'Erreur lors de l\'envoi de la demande');
        } finally {
            setLoading(false);
        }
    };

    const renderPickerWithLabel = (label, value, onValueChange, items, enabled = true) => (
        <View style={styles.formGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.pickerContainer, !enabled && styles.disabledPicker]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    enabled={enabled}
                    style={styles.picker}
                >
                    <Picker.Item label={`Sélectionner ${label.toLowerCase()}`} value="" />
                    {items.map(item => (
                        <Picker.Item 
                            key={item.id.toString()} 
                            label={item.name} 
                            value={item.id.toString()} 
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Text style={styles.title}>Demande de Création de Compte Médecin</Text>
                    
                    <Input
                        label="Nom complet *"
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Entrez votre nom complet"
                    />

                    <Input
                        label="Email *"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Téléphone"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        placeholder="Entrez votre numéro de téléphone"
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="CIN *"
                        value={formData.cin}
                        onChangeText={(value) => handleInputChange('cin', value)}
                        placeholder="Entrez votre CIN"
                        keyboardType="numeric"
                    />

                    <Input
                        label="Numéro de licence médicale *"
                        value={formData.licenseNumber}
                        onChangeText={(value) => handleInputChange('licenseNumber', value)}
                        placeholder="Entrez votre numéro de licence"
                    />

                    {renderPickerWithLabel(
                        "Région", 
                        formData.governorate, 
                        handleGovernorateChange, 
                        governorates
                    )}

                    {renderPickerWithLabel(
                        "Ville", 
                        formData.city, 
                        (value) => handleInputChange('city', value), 
                        cities, 
                        formData.governorate !== ''
                    )}

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Rôle *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.role}
                                onValueChange={(value) => handleInputChange('role', value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Sélectionner un rôle" value="" />
                                <Picker.Item label="Médecin" value="MEDECIN" />
                                <Picker.Item label="Neurologue" value="NEUROLOGUE" />
                                <Picker.Item label="Neurologue Résident" value="NEUROLOGUE_RESIDENT" />
                            </Picker>
                        </View>
                    </View>

                    <Input
                        label="Spécialisation"
                        value={formData.specialization}
                        onChangeText={(value) => handleInputChange('specialization', value)}
                        placeholder="Entrez votre spécialisation"
                    />

                    <Button
                        title="Envoyer la demande"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.button}
                    />

                    <Button
                        title="Annuler"
                        onPress={() => navigation.goBack()}
                        type="outline"
                        style={styles.button}
                    />
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    scrollContainer: {
        padding: SPACING.m,
    },
    card: {
        padding: SPACING.m,
    },
    title: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.l,
        textAlign: 'center',
        color: COLORS.dark,
    },
    formGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: SIZES.medium,
        fontWeight: '500',
        marginBottom: SPACING.xs,
        color: COLORS.dark,
    },
    pickerContainer: {
        backgroundColor: COLORS.light,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: SPACING.m,
    },
    disabledPicker: {
        opacity: 0.5,
    },
    picker: {
        height: 50,
    },
    button: {
        marginVertical: SPACING.s,
    },
});