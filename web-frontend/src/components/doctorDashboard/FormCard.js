import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { checkFormResponse } from '../../services/formResponseService';
import { countUnreadMessagesForForm } from '../../services/chatService';
import { COLORS } from '../../utils/theme';

export default function FormCard({ form, onPress, onViewResponse, onChatPress }) {
    const [hasResponse, setHasResponse] = useState(false);
    const [checking, setChecking] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        const checkResponse = async () => {
            try {
                const hasResp = await checkFormResponse(form.id);
                setHasResponse(hasResp);
            } catch (error) {
                console.error('Error checking response:', error);
            } finally {
                setChecking(false);
            }
        };


        const checkUnreadMessages = async () => {
            try {
                const count = await countUnreadMessagesForForm(form.id);
                setUnreadCount(count);
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };

        checkResponse();
        checkUnreadMessages();

        const interval = setInterval(checkUnreadMessages, 30000);

        return () => clearInterval(interval);
    }, [form.id]);
    

    return (
        <TouchableOpacity style={styles.formCard} onPress={() => onPress(form)}>
            <Text style={styles.patientName}>{form.fullName || 'N/A'}</Text>
            <Text style={styles.formDate}>
                Date: {form.submissionDate ? new Date(form.submissionDate).toLocaleDateString() : 'N/A'}
            </Text>
            <Text style={styles.formStatus}>
                Status: {form.status || 'En attente'}
            </Text>

            <View style={styles.actionButtons}>
                {/* Bouton Voir la réponse (seulement si hasResponse est vrai) */}
                {checking ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : hasResponse ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.responseAvailableButton]}
                        onPress={() => onViewResponse(form.id)}
                    >
                        <Ionicons name="eye-outline" size={16} color={COLORS.light} />
                        <Text style={styles.actionButtonText}>Voir la réponse</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.noResponseText}>Aucune réponse disponible</Text>
                )}

                {/* Bouton Chat */}
                <TouchableOpacity
                    style={[styles.actionButton, styles.chatButton]}
                    onPress={() => onChatPress(form.id, form.neurologistId || null)}
                >
                    <View style={styles.chatIconContainer}>
                        <Ionicons name="chatbubbles" size={20} color={COLORS.light} />
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
