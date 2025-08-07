import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, Alert } from 'react-native';
import { Video } from 'expo-av';
import { API_BASE_URL } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../../utils/theme';

const AttachmentViewer = ({ attachmentId, mimeType }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [attachmentUri, setAttachmentUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    const handlePress = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            
            if (!token) {
                Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
                return;
            }
            
            setAuthToken(token);
            
            // For videos, use direct URL with auth headers
            if (mimeType && mimeType.startsWith('video/')) {
                setAttachmentUri(`${API_BASE_URL}/api/neurologue/attachments/${attachmentId}`);
                setModalVisible(true);
            } else {
                // For images, fetch and convert to base64
                const response = await fetch(`${API_BASE_URL}/api/neurologue/attachments/${attachmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                        setAttachmentUri(reader.result);
                        setModalVisible(true);
                    };
                    reader.readAsDataURL(blob);
                } else {
                    Alert.alert('Erreur', 'Impossible de charger la pièce jointe');
                }
            }
        } catch (error) {
            console.error('Error loading attachment:', error);
            Alert.alert('Erreur', 'Impossible de charger la pièce jointe');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setAttachmentUri(null);
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={styles.attachmentButton} disabled={loading}>
                <View style={styles.attachmentPreview}>
                    {mimeType && mimeType.startsWith('image/') ? (
                        <Text style={styles.attachmentText}>📷 Image</Text>
                    ) : mimeType && mimeType.startsWith('video/') ? (
                        <Text style={styles.attachmentText}>🎥 Vidéo</Text>
                    ) : (
                        <Text style={styles.attachmentText}>📄 Fichier</Text>
                    )}
                    {loading && <Text style={styles.loadingText}>Chargement...</Text>}
                </View>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        
                        {attachmentUri && mimeType && mimeType.startsWith('image/') && (
                            <Image 
                                source={{ uri: attachmentUri }} 
                                style={styles.fullImage} 
                                resizeMode="contain"
                                onError={(error) => {
                                    console.error('Image load error:', error);
                                    Alert.alert('Erreur', 'Impossible de charger l\'image');
                                }}
                            />
                        )}
                        
                        {attachmentUri && mimeType && mimeType.startsWith('video/') && authToken && (
                            <Video
                                source={{ 
                                    uri: attachmentUri,
                                    headers: {
                                        'Authorization': `Bearer ${authToken}`
                                    }
                                }}
                                style={styles.fullVideo}
                                useNativeControls
                                resizeMode="contain"
                                shouldPlay={false}
                                onError={(error) => {
                                    console.error('Video load error:', error);
                                    Alert.alert('Erreur', 'Impossible de charger la vidéo');
                                }}
                            />
                        )}
                        
                        {attachmentUri && (!mimeType || (!mimeType.startsWith('image/') && !mimeType.startsWith('video/'))) && (
                            <Text style={styles.videoText}>Fichier - Type: {mimeType || 'Inconnu'}</Text>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    attachmentButton: {
        marginRight: SPACING.m,
    },
    attachmentPreview: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    attachmentText: {
        fontSize: 12,
        color: COLORS.dark,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 10,
        color: COLORS.grey,
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: COLORS.light,
        borderRadius: 10,
        padding: SPACING.m,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: COLORS.danger,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: COLORS.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    fullImage: {
        flex: 1,
        width: '100%',
    },
    fullVideo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    videoText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: COLORS.dark,
    },
});

export default AttachmentViewer;