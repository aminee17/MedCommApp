import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import FormCard from './FormCard';
import FormPreviewModal from './FormPreviewModal';
import ResponseModal from './ResponseModal';
import { COLORS } from '../../utils/theme';
import { useLogout } from '../../hooks/useLogout';
// Import services
import { fetchMedicalFormsForDoctor } from '../../services/dashboardService';
import { checkFormResponse, getFormResponse, debugFormResponse } from '../../services/medicalFormService';
import { countUnreadNotifications } from '../../services/notificationService';

const DoctorDashboard = () => {
    const [forms, setForms] = useState([]);
    const [formsWithResponses, setFormsWithResponses] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active');
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const handleLogout = useLogout();

    // Handle logout from header
    useEffect(() => {
        console.log('DoctorDashboard - forceLogout param:', route.params?.forceLogout);
        if (route.params?.forceLogout) {
            console.log('DoctorDashboard - Triggering logout from header...');
            navigation.setParams({ forceLogout: null });
            handleLogout(false);
        }
    }, [route.params?.forceLogout, handleLogout, navigation]);

    useEffect(() => {
        fetchForms(activeFilter);
        loadUnreadNotifications();
    }, [activeFilter]);

    // Load unread notifications count
    const loadUnreadNotifications = async () => {
        try {
            const count = await countUnreadNotifications();
            setUnreadNotifications(count);
            console.log('📢 Unread notifications:', count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    // Load form responses for all forms
    const loadFormResponses = async (formsData) => {
        try {
            console.log('🔄 Loading form responses for', formsData.length, 'forms');
            const formsWithResponsesData = [];
            
            for (const form of formsData) {
                try {
                    console.log(`🔍 Checking response for form ${form.formId}`);
                    const hasResponse = await checkFormResponse(form.formId);
                    console.log(`📋 Form ${form.formId} has response:`, hasResponse);
                    
                    if (hasResponse) {
                        const responseData = await getFormResponse(form.formId);
                        console.log(`✅ Loaded response for form ${form.formId}:`, responseData);
                        formsWithResponsesData.push({
                            ...form,
                            response: responseData,
                            hasResponse: true
                        });
                    } else {
                        formsWithResponsesData.push({
                            ...form,
                            hasResponse: false
                        });
                    }
                } catch (error) {
                    console.error(`❌ Error loading response for form ${form.formId}:`, error);
                    formsWithResponsesData.push({
                        ...form,
                        hasResponse: false,
                        error: error.message
                    });
                }
            }
            
            setFormsWithResponses(formsWithResponsesData);
            console.log('✅ Form responses loaded:', formsWithResponsesData.length, 'forms processed');
        } catch (error) {
            console.error('❌ Error loading form responses:', error);
        }
    };

    const fetchForms = async (filter) => {
        try {
            setLoading(true);
            console.log('🔄 Fetching forms with filter:', filter);
            const data = await fetchMedicalFormsForDoctor(filter);
            console.log('✅ Forms fetched:', data.length);
            setForms(data);
            
            // Load responses for all forms
            await loadFormResponses(data);
            
        } catch (error) {
            console.error('❌ Error fetching forms:', error);
            Alert.alert('Erreur', error.message || 'Impossible de récupérer les formulaires');
            
            // Handle session expiry
            if (error.message?.includes('Session expirée') || error.message?.includes('User ID not found')) {
                Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
                    { text: 'OK', onPress: () => navigation.replace('RoleSelection') }
                ]);
                return;
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchForms(activeFilter);
        loadUnreadNotifications();
    };

    const handleFormPress = (form) => {
        console.log('📋 Form pressed:', form.formId);
        setSelectedForm(form);
        setModalVisible(true);
    };

    const handleViewResponse = async (formId) => {
        try {
            console.log('👁️ Viewing response for form:', formId);
            setSelectedFormId(formId);
            
            // Debug the response first
            await debugFormResponse(formId);
            
            setResponseModalVisible(true);
        } catch (error) {
            console.error('Error viewing response:', error);
            Alert.alert('Erreur', 'Impossible de charger la réponse. Veuillez réessayer.');
        }
    };
    
    const handleChatPress = (formId, neurologistId) => {
        console.log('💬 Chat pressed for form:', formId, 'neurologist:', neurologistId);
        navigation.navigate('DoctorChat', { 
            formId, 
            neurologistId,
            onGoBack: () => {
                // Refresh data when returning from chat
                fetchForms(activeFilter);
                loadUnreadNotifications();
            }
        });
    };

    const handleNotificationsPress = () => {
        navigation.navigate('Notifications');
    };

    const handleDebugResponses = async () => {
        try {
            console.log('🐛 Debugging all form responses...');
            for (const form of forms) {
                await debugFormResponse(form.formId);
            }
            Alert.alert('Debug', 'Vérification des réponses terminée. Voir la console pour les détails.');
        } catch (error) {
            console.error('Debug error:', error);
        }
    };

    const renderFilterButton = (label, filter) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter)}
        >
            <Text 
                style={[
                    styles.filterButtonText,
                    activeFilter === filter && styles.activeFilterButtonText
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    // Filter forms based on active filter
    const getFilteredForms = () => {
        return formsWithResponses.filter(form => {
            switch (activeFilter) {
                case 'active':
                    return form.status !== 'COMPLETED';
                case 'completed':
                    return form.status === 'COMPLETED';
                case 'recent':
                    // Show forms from last 7 days
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(form.createdAt) > oneWeekAgo;
                case 'all':
                default:
                    return true;
            }
        });
    };

    const filteredForms = getFilteredForms();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Tableau de bord</Text>
                    {unreadNotifications > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>{unreadNotifications}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={handleNotificationsPress}
                    >
                        <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                        {unreadNotifications > 0 && (
                            <View style={styles.headerNotificationBadge}>
                                <Text style={styles.headerNotificationText}>{unreadNotifications}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.newFormButton}
                        onPress={() => navigation.navigate('MedicalForm')}
                    >
                        <Text style={styles.newFormButtonText}>+ Nouveau formulaire</Text>
                    </TouchableOpacity>

                    {/* Debug button - remove in production */}
                    <TouchableOpacity
                        style={styles.debugButton}
                        onPress={handleDebugResponses}
                    >
                        <Ionicons name="bug-outline" size={20} color={COLORS.warning} />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.filterContainer}>
                {renderFilterButton('Actifs', 'active')}
                {renderFilterButton('Complétés', 'completed')}
                {renderFilterButton('Récents', 'recent')}
                {renderFilterButton('Tous', 'all')}
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{filteredForms.length}</Text>
                    <Text style={styles.statLabel}>Formulaires</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {filteredForms.filter(f => f.hasResponse).length}
                    </Text>
                    <Text style={styles.statLabel}>Avec réponse</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{unreadNotifications}</Text>
                    <Text style={styles.statLabel}>Notifications</Text>
                </View>
            </View>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Chargement des formulaires...</Text>
                </View>
            ) : filteredForms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={64} color={COLORS.lightGray} />
                    <Text style={styles.emptyText}>
                        Aucun formulaire {activeFilter === 'active' ? 'actif' : 
                                         activeFilter === 'completed' ? 'complété' : 
                                         activeFilter === 'recent' ? 'récent' : ''} trouvé
                    </Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                    >
                        <Ionicons name="refresh" size={20} color={COLORS.primary} />
                        <Text style={styles.refreshButtonText}>Actualiser</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredForms}
                    renderItem={({ item }) => (
                        <FormCard 
                            form={item} 
                            onPress={handleFormPress}
                            onViewResponse={handleViewResponse}
                            onChatPress={handleChatPress}
                            hasResponse={item.hasResponse}
                        />
                    )}
                    keyExtractor={(item) => item.formId ? item.formId.toString() : Math.random().toString()}
                    contentContainerStyle={styles.formList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
            
            <FormPreviewModal
                visible={modalVisible}
                form={selectedForm}
                onClose={() => setModalVisible(false)}
                onViewResponse={() => {
                    setModalVisible(false);
                    if (selectedForm) {
                        handleViewResponse(selectedForm.formId);
                    }
                }}
            />
            
            <ResponseModal
                visible={responseModalVisible}
                formId={selectedFormId}
                onClose={() => {
                    setResponseModalVisible(false);
                    // Refresh data when closing response modal
                    fetchForms(activeFilter);
                    loadUnreadNotifications();
                }}
                onRefresh={() => {
                    fetchForms(activeFilter);
                    loadUnreadNotifications();
                }}
            />
        </View>
    );
};

export default DoctorDashboard;