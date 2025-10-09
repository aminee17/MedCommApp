import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { getAudioUrl } from '../../services/chatService';

const VoicePlayer = ({ messageId, style }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playPauseAudio = async () => {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                setIsLoading(true);
                const audioUrl = getAudioUrl(messageId);
                
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true }
                );
                
                setSound(newSound);
                setIsPlaying(true);
                
                // Set up status update
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setDuration(status.durationMillis || 0);
                        setPosition(status.positionMillis || 0);
                        
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            setPosition(0);
                        }
                    }
                });
                
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsLoading(false);
            setIsPlaying(false);
        }
    };

    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        if (duration === 0) return 0;
        return (position / duration) * 100;
    };

    return (
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 20,
            minWidth: 150,
        }, style]}>
            <TouchableOpacity
                onPress={playPauseAudio}
                disabled={isLoading}
                style={{
                    backgroundColor: '#007AFF',
                    padding: 8,
                    borderRadius: 20,
                    marginRight: 10,
                }}
            >
                <Ionicons 
                    name={isLoading ? "hourglass" : isPlaying ? "pause" : "play"} 
                    size={16} 
                    color="white" 
                />
            </TouchableOpacity>
            
            <View style={{ flex: 1 }}>
                <View style={{
                    height: 3,
                    backgroundColor: '#ddd',
                    borderRadius: 1.5,
                    marginBottom: 5,
                }}>
                    <View style={{
                        height: '100%',
                        backgroundColor: '#007AFF',
                        borderRadius: 1.5,
                        width: `${getProgressPercentage()}%`,
                    }} />
                </View>
                
                <Text style={{
                    fontSize: 12,
                    color: '#666',
                    textAlign: 'center',
                }}>
                    {duration > 0 ? formatTime(position) + ' / ' + formatTime(duration) : 'Voice message'}
                </Text>
            </View>
        </View>
    );
};

export default VoicePlayer;