import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    ScrollView,
    Image,
    StyleSheet
} from 'react-native';
import { getFormResponse } from '../../services/formResponseService';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const ResponseModal = ({ visible, formId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && formId) {
            fetchResponse();
        }
    }, [visible, formId]);

    const fetchResponse = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFormResponse(formId);
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

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.responseModalContent}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color={COLORS.grey} />
                    </TouchableOpacity>
                    
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Chargement de la réponse...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={50} color={COLORS.danger} />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    ) : response && response.message ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="information-circle" size={50} color={COLORS.primary} />
                            <Text style={styles.emptyTitle}>Aucune réponse</Text>
                            <Text style={styles.emptyText}>
                                Le neurologue n'a pas encore répondu à ce formulaire.
                            </Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
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
                            </View>
                            
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: SPACING.m,
    },
    responseModalContent: {
        backgroundColor: COLORS.light,
        borderRadius: 15,
        width: '100%',
        maxHeight: '90%',
        padding: 0,
        ...SHADOWS.large,
        overflow: 'hidden',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 5,
    },
    headerSection: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
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
        backgroundColor: COLORS.lightGrey,
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
        backgroundColor: COLORS.lightGrey,
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
    loadingContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.grey,
    },
    errorContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
        fontSize: SIZES.medium,
        color: COLORS.danger,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
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

export default ResponseModal;