import React, { useState } from 'react';
import { View, Button, Image, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
console.log('🧪 ImagePicker keys:', Object.keys(ImagePicker));

const ImagePickerInput = ({ label, value, onChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pickImage = async () => {
        try {
            setLoading(true);
            setError(null);

            // Request permissions first (skip on web)
            if (Platform.OS !== 'web') {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permissionResult.granted) {
                    Alert.alert("Permission requise", "Nous avons besoin de votre permission pour accéder à la galerie.");
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                exif: false,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                onChange({
                    uri: asset.uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            let errorMessage = 'Une erreur est survenue lors de la sélection de l\'image.';
            
            if (error.message && error.message.includes('Failed to write')) {
                errorMessage = 'Impossible d\'enregistrer l\'image. Vérifiez l\'espace de stockage disponible et les permissions.';
            } else if (error.message && error.message.includes('permission')) {
                errorMessage = 'Permission refusée. Veuillez autoriser l\'accès aux médias dans les paramètres.';
            }
            
            setError(errorMessage);
            Alert.alert('Erreur', errorMessage + ' Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4 }}>{label}</Text>
            {value ? (
                <Image source={{ uri: value.uri }} style={{ width: 120, height: 120, marginBottom: 8 }} />
            ) : null}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title={value ? "Changer l'image" : "Choisir une image"} onPress={pickImage} />
            )}
            {error && <Text style={{ color: 'red', marginTop: 4 }}>{error}</Text>}
        </View>
    );
};

export default ImagePickerInput;