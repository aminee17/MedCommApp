// src/components/AttachmentItem.js
import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import Video from 'react-native-video';

const AttachmentItem = ({ uri, mimeType, onPress }) => {
    if (mimeType.startsWith('image/')) {
        return (
            <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
                <Image
                    source={{ uri }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    } else if (mimeType.startsWith('video/')) {
        // Simple clickable box for videos, can be improved with video thumbnail generation
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    marginRight: 12,
                    width: 100,
                    height: 100,
                    backgroundColor: '#000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>▶️ Video</Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <View
                style={{
                    marginRight: 12,
                    width: 100,
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ccc',
                    borderRadius: 8,
                }}
            >
                <Text>Unsupported</Text>
            </View>
        );
    }
};

export default AttachmentItem;
