
import React from 'react';
import { View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const VideoPickerInput = ({ label, value, onChange }) => {
    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4 }}>{label}</Text>
            {value ? (
                <Video
                    source={{ uri: value }}
                    style={{ width: 200, height: 120, marginBottom: 8 }}
                    useNativeControls
                    resizeMode="contain"
                />
            ) : null}
            <Button title="Choisir une vidéo" onPress={pickVideo} />
        </View>
    );
};

export default VideoPickerInput;