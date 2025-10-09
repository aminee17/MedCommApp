import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFormResponse, getNeurologistFormResponse } from '../../services/formResponseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countUnreadMessagesForForm } from '../../services/chatService';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';

const ViewResponseScreen = ({ route, navigation }) => {
    const { formId } = route.params;
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchResponse();
        loadUserRole();
        
        // Check for unread messages
        const checkUnreadMessages = async () => {
            try {
                const count = await countUnreadMessagesForForm(formId);
                setUnreadCount(count);
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };
        
        checkUnreadMessages();
        
        // Set up polling for unread messages every 30 seconds
        const interval = setInterval(checkUnreadMessages, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const loadUserRole = async () => {
        try {
            const role = await AsyncStorage.getItem('userRole');
            setUserRole(role);
        } catch (error) {
            console.error('Error loading user role:', error);
        }
    };

    const fetchResponse = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Check user role to determine which endpoint to use
            const role = await AsyncStorage.getItem('userRole');
            let data;
            
            if (role === 'NEUROLOGUE' || role === 'NEUROLOGUE_RESIDENT') {
                data = await getNeurologistFormResponse(formId);
            } else {
                data = await getFormResponse(formId);
            }
            
            setResponse(data);
        } catch (error) {
            console.error('Error fetching response:', error);
            setError('Impossible de charger la réponse. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case 'HIGH':
                return styles.highPriority;
            case 'CRITICAL':
                return styles.criticalPriority;
            case 'MEDIUM':
                return styles.mediumPriority;
            case 'LOW':
                return styles.lowPriority;
            default:
                return styles.mediumPriority;
        }
    };

    const getUrgencyText = (urgency) => {
        switch (urgency) {
            case 'HIGH':
                return 'Élevée';
            case 'CRITICAL':
                return 'Critique';
            case 'MEDIUM':
                return 'Moyenne';
            case 'LOW':
                return 'Faible';
            default:
                return urgency;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ResponseSection = ({ title, content, icon }) => {
        if (!content) return null;
        
        return (
            <View style={styles.responseSection}>
                <View style={styles.sectionHeader}>
                    {icon && <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.sectionIcon} />}
                    <Text style={styles.responseLabel}>{title}</Text>
                </View>
                <Text style={styles.responseText}>{content}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement de la réponse...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={50} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (response && response.message) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="information-circle" size={50} color={COLORS.primary} />
                <Text style={styles.emptyTitle}>Aucune réponse</Text>
                <Text style={styles.emptyText}>
                    Le neurologue n'a pas encore répondu à ce formulaire.
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerSection}>
                    <Text style={styles.modalTitle}>Réponse du Neurologue</Text>
                    <View style={[styles.priorityBadge, getUrgencyStyle(response.urgencyLevel)]}>
                        <Text style={styles.priorityText}>
                            Urgence: {getUrgencyText(response.urgencyLevel)}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.contentContainer}>
                    <ResponseSection 
                        title="Diagnostic" 
                        content={response.diagnosis || 'Aucun diagnostic fourni'} 
                        icon="medical"
                    />
                    
                    <ResponseSection 
                        title="Recommandations" 
                        content={response.recommendations || 'Aucune recommandation fournie'} 
                        icon="list"
                    />
                    
                    <ResponseSection 
                        title="Suggestions de traitement" 
                        content={response.treatmentSuggestions} 
                        icon="flask"
                    />
                    
                    <ResponseSection 
                        title="Changements de médication" 
                        content={response.medicationChanges} 
                        icon="medkit"
                    />
                    
                    {response.followUpRequired && (
                        <View style={styles.followUpSection}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="calendar" size={20} color={COLORS.primary} style={styles.sectionIcon} />
                                <Text style={styles.responseLabel}>Suivi requis</Text>
                            </View>
                            <View style={styles.followUpDetails}>
                                <Text style={styles.followUpDate}>
                                    Date: {response.followUpDate ? new Date(response.followUpDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                                </Text>
                                {response.followUpInstructions && (
                                    <Text style={styles.followUpInstructions}>
                                        {response.followUpInstructions}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                    
                    {response.requiresSupervision && (
                        <View style={styles.supervisionAlert}>
                            <Ionicons name="warning" size={24} color={COLORS.light} />
                            <Text style={styles.supervisionText}>
                                Ce cas nécessite une supervision supplémentaire
                            </Text>
                        </View>
                    )}
                    
                    <View style={styles.metaSection}>
                        <Text style={styles.metaLabel}>Date de réponse:</Text>
                        <Text style={styles.metaText}>{formatDate(response.createdAt)}</Text>
                    </View>
                    
                    <View style={styles.neurologistCard}>
                        <View style={styles.neurologistAvatar}>
                            <Text style={styles.avatarText}>
                                {response.neurologistName ? response.neurologistName.charAt(0).toUpperCase() : 'N'}
                            </Text>
                        </View>
                        <View style={styles.neurologistInfo}>
                            <Text style={styles.neurologistName}>{response.neurologistName || 'Neurologue'}</Text>
                            <Text style={styles.neurologistEmail}>{response.neurologistEmail || 'Email non disponible'}</Text>
                        </View>
                    </View>
                    
                    {userRole !== 'NEUROLOGUE' && userRole !== 'NEUROLOGUE_RESIDENT' && (
                        <TouchableOpacity 
                            style={styles.chatButton}
                            onPress={() => navigation.navigate('DoctorChat', { 
                                formId: formId,
                                neurologistId: response.neurologistId || null
                            })}
                        >
                            <View style={styles.chatButtonContent}>
                                <Ionicons name="chatbubbles" size={20} color={COLORS.light} style={styles.chatIcon} />
                                <Text style={styles.chatButtonText}>Discuter avec le neurologue</Text>
                                {unreadCount > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    headerSection: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.light,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    priorityBadge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        marginTop: SPACING.xs,
    },
    priorityText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.small,
    },
    contentContainer: {
        padding: SPACING.l,
    },
    responseSection: {
        marginBottom: SPACING.l,
        backgroundColor: COLORS.light,
        borderRadius: 10,
        padding: SPACING.m,
        ...SHADOWS.small,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    sectionIcon: {
        marginRight: SPACING.xs,
    },
    responseLabel: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    responseText: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
        lineHeight: 22,
    },
    followUpSection: {
        marginBottom: SPACING.l,
        backgroundColor: COLORS.lightBlue,
        borderRadius: 10,
        padding: SPACING.m,
        ...SHADOWS.small,
    },
    followUpDetails: {
        marginTop: SPACING.s,
    },
    followUpDate: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    followUpInstructions: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
        lineHeight: 22,
    },
    supervisionAlert: {
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    supervisionText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
        marginLeft: SPACING.s,
        flex: 1,
    },
    metaSection: {
        marginBottom: SPACING.l,
        padding: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    metaLabel: {
        fontSize: SIZES.small,
        color: COLORS.grey,
        marginBottom: SPACING.xs,
    },
    metaText: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
    },
    neurologistCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.light,
        borderRadius: 10,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        ...SHADOWS.small,
    },
    neurologistAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    avatarText: {
        color: COLORS.light,
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
    neurologistInfo: {
        flex: 1,
    },
    neurologistName: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    neurologistEmail: {
        fontSize: SIZES.small,
        color: COLORS.grey,
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: SPACING.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SPACING.l,
        marginBottom: SPACING.l,
        ...SHADOWS.small,
    },
    closeButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
    chatButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: SPACING.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.l,
        ...SHADOWS.small,
    },
    chatButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    chatIcon: {
        marginRight: SPACING.s,
    },
    chatButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
    unreadBadge: {
        position: 'absolute',
        top: -8,
        right: -15,
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    unreadBadgeText: {
        color: COLORS.light,
        fontSize: 10,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.grey,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
        fontSize: SIZES.medium,
        color: COLORS.danger,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyTitle: {
        marginTop: SPACING.m,
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    emptyText: {
        marginTop: SPACING.s,
        marginBottom: SPACING.l,
        fontSize: SIZES.medium,
        color: COLORS.grey,
        textAlign: 'center',
    },
    highPriority: {
        backgroundColor: '#FF9500', // Orange
    },
    criticalPriority: {
        backgroundColor: COLORS.danger, // Red
    },
    mediumPriority: {
        backgroundColor: '#FFD60A', // Yellow
    },
    lowPriority: {
        backgroundColor: COLORS.success, // Green
    },
});

export default ViewResponseScreen;