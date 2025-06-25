
import React from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerInput = ({ label, value, onChange }) => {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
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
                <Image source={{ uri: value }} style={{ width: 120, height: 120, marginBottom: 8 }} />
            ) : null}
            <Button title="Choisir une image" onPress={pickImage} />
        </View>
    );
};

export default ImagePickerInput;