// src/screens/NeurologueFormDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Linking, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AttachmentItem from '../../components/neurologueDashboard/AttachmentItem';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '../../utils/theme';
import { API_BASE_URL } from '../../utils/constants';
import { fetchPendingFormsForNeurologue, fetchCompletedFormsForNeurologue, fetchAllFormsForNeurologue } from '../../services/neurologueService';
import { countUnreadMessagesForForm } from '../../services/chatService';

const NeurologueFormDetails = ({ route }) => {
    const { form: initialForm, formId } = route.params;
    const [form, setForm] = useState(initialForm || null);
    const [loading, setLoading] = useState(!initialForm && formId);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    
    // Fetch form data if only formId is provided
    useEffect(() => {
        if (!initialForm && formId) {
            const fetchFormData = async () => {
                try {
                    setLoading(true);
                    
                    // First try to find in pending forms
                    const pendingForms = await fetchPendingFormsForNeurologue();
                    let matchingForm = pendingForms.find(form => form.formId === parseInt(formId));
                    
                    // If not found in pending, try completed forms
                    if (!matchingForm) {
                        const completedForms = await fetchCompletedFormsForNeurologue();
                        matchingForm = completedForms.find(form => form.formId === parseInt(formId));
                    }
                    
                    if (matchingForm) {
                        setForm(matchingForm);
                        setError(null);
                    } else {
                        setError('Formulaire non trouvé. Il a peut-être été supprimé ou vous n\'avez pas les permissions nécessaires.');
                    }
                } catch (err) {
                    console.error('Error fetching form data:', err);
                    setError('Impossible de charger les détails du formulaire.');
                } finally {
                    setLoading(false);
                }
            };
            
            fetchFormData();
        }
    }, [initialForm, formId]);

    // Open attachment URL in device browser/viewer
    const openAttachment = (url) => {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        Linking.openURL(fullUrl).catch(err => console.error('Failed to open URL:', err));
    };
    
    // Handle respond button press
    const handleRespond = () => {
        navigation.navigate('FormResponse', { formId: form.formId });
    };
    
    // Handle chat button press
    const handleChat = () => {
        navigation.navigate('NeurologueChat', { formId: form.formId, doctorId: form.referringDoctorId });
    };
    
    // Count unread messages
    const [unreadCount, setUnreadCount] = useState(0);
    
    useEffect(() => {
        if (!form) return;
        
        // Check for unread messages
        const checkUnreadMessages = async () => {
            try {
                const count = await countUnreadMessagesForForm(form.formId);
                setUnreadCount(count);
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };
        
        checkUnreadMessages();
        
        // Set up polling for unread messages every 30 seconds
        const interval = setInterval(checkUnreadMessages, 30000);
        
        return () => clearInterval(interval);
    }, [form]);

    // Helper function to safely display values that might be objects
    const safeDisplay = (value) => {
        if (value === null || value === undefined) {
            return '-';
        }
        
        if (typeof value === 'object') {
            // If it's an object with a name property, use that
            if (value.name) {
                return value.name;
            }
            // Otherwise return a placeholder
            return '[Object]';
        }
        
        return String(value);
    };

    const SectionTitle = ({ children }) => (
        <Text style={styles.sectionTitle}>{children}</Text>
    );

    const SectionContent = ({ children, style }) => (
        <View style={[styles.sectionContent, style]}>
            {children}
        </View>
    );

    const InfoRow = ({ label, value }) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{safeDisplay(value)}</Text>
        </View>
    );

    // Show loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement des détails du formulaire...</Text>
            </View>
        );
    }
    
    // Show error state
    if (error || !form) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Formulaire non trouvé'}</Text>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.pageTitle}>Détails du formulaire</Text>

                <View style={styles.card}>
                    <SectionTitle>Patient</SectionTitle>
                    <SectionContent>
                        <InfoRow label="Nom" value={form.patientName} />
                        <InfoRow label="CIN" value={form.patientCin} />
                        <InfoRow label="Âge" value={form.patientAge} />
                        <InfoRow label="Sexe" value={form.patientGender} />
                    </SectionContent>
                </View>

                <View style={styles.card}>
                    <SectionTitle>Symptômes</SectionTitle>
                    <SectionContent>
                        <Text style={styles.symptomText}>{form.symptoms || 'Aucun symptôme précisé'}</Text>
                    </SectionContent>
                </View>

                <View style={styles.card}>
                    <SectionTitle>Dates des crises</SectionTitle>
                    <SectionContent>
                        <InfoRow label="Première crise" value={form.dateFirstSeizure} />
                        <InfoRow label="Dernière crise" value={form.dateLastSeizure} />
                    </SectionContent>
                </View>

                <View style={styles.card}>
                    <SectionTitle>Informations complémentaires</SectionTitle>
                    <SectionContent>
                        <InfoRow label="Total des crises" value={form.totalSeizures} />
                        <InfoRow label="Durée moyenne" value={form.averageSeizureDuration ? `${form.averageSeizureDuration} minutes` : '-'} />
                        <InfoRow label="Fréquence" value={form.seizureFrequency} />
                    </SectionContent>
                </View>

                <View style={styles.card}>
                    <SectionTitle>Médecin référent</SectionTitle>
                    <SectionContent>
                        <InfoRow label="Nom" value={form.referringDoctorName} />
                        <InfoRow label="Email" value={form.referringDoctorEmail} />
                        <InfoRow label="Téléphone" value={form.referringDoctorPhone} />
                        <InfoRow label="Rôle" value={form.referringDoctorRole} />
                        <InfoRow label="Gouvernorat" value={form.referringDoctorGovernorate} />
                    </SectionContent>
                </View>

                {/* Attachments */}
                <View style={styles.card}>
                    <SectionTitle>Pièces jointes</SectionTitle>
                    <SectionContent>
                        {form.attachmentUrls && form.attachmentUrls.length > 0 ? (
                            <FlatList
                                horizontal
                                data={form.attachmentUrls.map((url, index) => ({
                                    url,
                                    mimeType: url.includes('mri_photo') ? 'image/jpeg' : 'video/mp4',
                                    id: index
                                }))}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <AttachmentItem
                                        uri={item.url}
                                        mimeType={item.mimeType}
                                        onPress={() => openAttachment(item.url)}
                                    />
                                )}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.attachmentList}
                            />
                        ) : (
                            <Text style={styles.noAttachments}>Aucune pièce jointe disponible</Text>
                        )}
                    </SectionContent>
                </View>
            </ScrollView>
            
            {/* Action Buttons - Fixed at bottom */}
            <View style={styles.buttonContainer}>
                {form.status !== 'COMPLETED' ? (
                    <TouchableOpacity 
                        style={[styles.button, styles.respondButton]} 
                        onPress={handleRespond}
                    >
                        <Text style={styles.buttonText}>Répondre</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.button, styles.viewResponseButton]} 
                        onPress={() => navigation.navigate('ViewResponse', { formId: form.formId })}
                    >
                        <Text style={styles.buttonText}>Voir ma réponse</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                    style={[styles.button, styles.chatButton]} 
                    onPress={handleChat}
                >
                    <View style={styles.chatButtonContent}>
                        <Text style={styles.buttonText}>Discuter avec le médecin</Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
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
        backgroundColor: COLORS.lightGrey,
        padding: SPACING.xl,
    },
    errorText: {
        marginBottom: SPACING.l,
        fontSize: SIZES.medium,
        color: COLORS.danger,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 80, // Reduced space for fixed buttons
    },
    pageTitle: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginVertical: SPACING.l,
        marginHorizontal: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.light,
        borderRadius: 10,
        marginHorizontal: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sectionContent: {
        padding: SPACING.m,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: SPACING.s,
    },
    infoLabel: {
        width: '40%',
        fontSize: SIZES.medium,
        fontWeight: '500',
        color: COLORS.dark,
    },
    infoValue: {
        flex: 1,
        fontSize: SIZES.medium,
        color: COLORS.dark,
    },
    symptomText: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
        lineHeight: 22,
    },
    attachmentList: {
        paddingVertical: SPACING.s,
    },
    noAttachments: {
        fontSize: SIZES.medium,
        color: COLORS.grey,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20, // Moved up more from bottom edge
        left: 0,
        right: 0,
        backgroundColor: COLORS.light,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.medium,
    },
    button: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SPACING.s,
        ...SHADOWS.small,
    },
    respondButton: {
        backgroundColor: COLORS.secondary,
    },
    viewResponseButton: {
        backgroundColor: COLORS.success,
    },
    chatButton: {
        backgroundColor: COLORS.primary,
    },
    chatButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
    buttonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    }
});

export default NeurologueFormDetails;