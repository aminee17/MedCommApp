import React, { useState } from 'react';
import { View, Button, Text, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Platform } from 'react-native';

const MAX_VIDEO_SIZE_MB = 250;
const MAX_VIDEO_DURATION = 300; // seconds (5 min)

const VideoPickerInput = ({ label, value, onChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState({});

    const pickVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const { status } = Platform.OS === 'web' ? { status: 'granted' } : await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Autorisez l'accès à la galerie pour sélectionner une vidéo.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled) return;

            const asset = result.assets?.[0];
            if (!asset) throw new Error("Aucune vidéo détectée.");

            // ✅ Check size
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            const sizeInMB = blob.size / (1024 * 1024);
            if (sizeInMB > MAX_VIDEO_SIZE_MB) {
                Alert.alert("Vidéo trop volumineuse", `Max autorisé : ${MAX_VIDEO_SIZE_MB} MB.`);
                return;
            }

            // ✅ Check duration
            const durationSec = asset.duration > 1000 ? asset.duration / 1000 : asset.duration;
            if (durationSec > MAX_VIDEO_DURATION) {
                Alert.alert("Vidéo trop longue", `Max autorisé : ${MAX_VIDEO_DURATION / 60} minutes.`);
                return;
            }

            onChange({
                uri: asset.uri,
                type: 'video/mp4',
                name: 'seizure_video.mp4'
            });

        } catch (err) {
            console.error(err);
            Alert.alert("Erreur", "Un problème est survenu lors de la sélection de la vidéo.");
            setError("Erreur lors de la sélection de la vidéo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4 }}>{label}</Text>

            {value && (
                <View>
                    <Video
                        source={{ uri: value.uri }}
                        style={{ width: 200, height: 120, marginBottom: 8 }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping={false}
                        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                    />
                    <Button title="Supprimer la vidéo" onPress={() => onChange(null)} color="#d11a2a" />
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title={value ? "Changer la vidéo" : "Choisir une vidéo"} onPress={pickVideo} />
            )}

            {error && <Text style={{ color: 'red', marginTop: 4 }}>{error}</Text>}

            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Taille max: {MAX_VIDEO_SIZE_MB}MB, Durée max: {MAX_VIDEO_DURATION / 60} min
            </Text>
        </View>
    );
};

export default VideoPickerInput;