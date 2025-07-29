import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { sendVoiceMessage } from '../../services/chatService';

const VoiceRecorder = ({ formId, receiverId, onVoiceMessageSent, style }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const startRecording = async () => {
        try {
            // Request permissions
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages.');
                return;
            }

            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            
            setRecording(recording);
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                await sendVoiceMessageFile(uri);
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to stop recording. Please try again.');
        }
    };

    const sendVoiceMessageFile = async (audioUri) => {
        try {
            setIsSending(true);

            // Create file object for upload
            const audioFile = {
                uri: audioUri,
                type: 'audio/m4a',
                name: `voice_message_${Date.now()}.m4a`,
            };

            const voiceData = {
                formId,
                receiverId,
                audioFile,
            };

            const sentMessage = await sendVoiceMessage(voiceData);
            
            if (onVoiceMessageSent) {
                onVoiceMessageSent(sentMessage);
            }

            Alert.alert('Success', 'Voice message sent successfully!');
        } catch (error) {
            console.error('Failed to send voice message:', error);
            Alert.alert('Error', 'Failed to send voice message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const cancelRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                setRecording(null);
                setIsRecording(false);
            } catch (error) {
                console.error('Failed to cancel recording:', error);
            }
        }
    };

    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
            {isRecording ? (
                <>
                    <TouchableOpacity
                        onPress={cancelRecording}
                        style={{
                            backgroundColor: '#ff4444',
                            padding: 12,
                            borderRadius: 25,
                            marginRight: 10,
                        }}
                    >
                        <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                    
                    <View style={{
                        backgroundColor: '#ff4444',
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 10,
                    }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>Recording...</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={stopRecording}
                        style={{
                            backgroundColor: '#4CAF50',
                            padding: 12,
                            borderRadius: 25,
                        }}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity
                    onPress={startRecording}
                    disabled={isSending}
                    style={{
                        backgroundColor: isSending ? '#cccccc' : '#007AFF',
                        padding: 12,
                        borderRadius: 25,
                    }}
                >
                    <Ionicons 
                        name={isSending ? "hourglass" : "mic"} 
                        size={20} 
                        color="white" 
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default VoiceRecorder;