import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { fetchPendingFormsForNeurologue, fetchCompletedFormsForNeurologue, fetchAllFormsForNeurologue } from '../../services/neurologueService';
import { countUnreadMessagesForForm } from '../../services/chatService';
import { countUnreadNotifications } from '../../services/notificationService';
import { COLORS, SPACING } from '../../utils/theme';
import styles from './styles';
import AIInsights from '../../components/neurologueDashboard/AIInsights';
import { useLogout } from '../../hooks/useLogout';

const NeurologueDashboard = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('');
    const [activeFilter, setActiveFilter] = useState('pending'); // 'pending', 'completed', 'all', or 'ai'
    const [patients, setPatients] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const navigation = useNavigation();
    const handleLogout = useLogout();
    const route = useRoute();

    // Load user data
    const loadUserData = async () => {
        try {
            const name = await AsyncStorage.getItem('userName');
            if (name) {
                setUserName(name);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // ✅ FIXED: Load all forms with proper error handling
    const loadForms = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching forms from server...');
            
            // Fetch all to avoid multiple server calls and flakiness
            const data = await fetchAllFormsForNeurologue();
            
            // ✅ FIX: Always ensure we have an array
            const formsArray = Array.isArray(data) ? data : [];
            setForms(formsArray);
            
            console.log(`✅ Loaded ${formsArray.length} forms`);
            
            // ✅ FIX: Safe array operations for patients extraction
            const uniquePatients = formsArray.reduce((acc, form) => {
                if (form && form.patientId) {
                    const patientName = form.patientName || 'Unknown Patient';
                    
                    if (!acc.find(p => p.patientId === form.patientId)) {
                        acc.push({
                            patientId: form.patientId,
                            fullName: patientName,
                            formId: form.formId
                        });
                    }
                }
                return acc;
            }, []);
            
            setPatients(uniquePatients);
        } catch (error) {
            console.error('❌ Error fetching forms:', error);
            
            // ✅ FIX: Reset to empty arrays on error
            setForms([]);
            setPatients([]);
            
            if (error.message.includes('User ID not found') || error.message.includes('403') || error.message.includes('Session')) {
                Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
                    { text: 'OK', onPress: () => navigation.replace('NeurologueLogin') }
                ]);
            } else {
                // Show generic error for other issues
                Alert.alert('Erreur', 'Impossible de charger les formulaires. Veuillez réessayer.', [
                    { text: 'OK' }
                ]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load unread notifications count
    const loadNotifications = async () => {
        try {
            const count = await countUnreadNotifications();
            setUnreadNotifications(count);
            console.log('📢 Unread notifications:', count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    // Initial load
    useEffect(() => {
        loadUserData();
        loadForms();
        loadNotifications();
    }, []);
    

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Screen focused, refreshing data...');
            loadForms();
            loadNotifications();
        }, []) // Empty dependency array - only runs when screen focuses
    );

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadForms();
        loadNotifications();
    }, []); // Remove activeFilter dependency

    // Handle logout from header
    useEffect(() => {
        console.log('NeurologueDashboard - forceLogout param:', route.params?.forceLogout);
        if (route.params?.forceLogout) {
            console.log('NeurologueDashboard - Triggering logout from header...');
            navigation.setParams({ forceLogout: null });
            handleLogout(false); // false = no confirmation
        }
    }, [route.params?.forceLogout, handleLogout, navigation]);

    const handleFormPress = (form) => {
        navigation.navigate('NeurologueFormDetails', { form });
    };

    // Instant filter switching - no API calls
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // ✅ FIXED: Optimized filtering with safe array handling
    const filteredForms = React.useMemo(() => {
        if (!Array.isArray(forms) || forms.length === 0) return [];
        
        switch (activeFilter) {
            case 'completed':
                return forms.filter(f => f && f.status === 'COMPLETED');
            case 'pending':
                return forms.filter(f => f && f.status !== 'COMPLETED');
            case 'all':
            default:
                return forms.filter(f => f); // Ensure all items are truthy
        }
    }, [forms, activeFilter]);

    // Component for form card with chat functionality
    const FormCardWithChat = ({ form, onPress, onChatPress }) => {
        const [unreadCount, setUnreadCount] = useState(0);

        useEffect(() => {
            if (!form || !form.formId) return;
            
            const checkUnreadMessages = async () => {
                try {
                    const count = await countUnreadMessagesForForm(form.formId);
                    setUnreadCount(count);
                } catch (error) {
                    console.error('Error checking unread messages:', error);
                }
            };

            checkUnreadMessages();
            const interval = setInterval(checkUnreadMessages, 30000);
            return () => clearInterval(interval);
        }, [form?.formId]);

        if (!form) return null;

        return (
            <TouchableOpacity style={styles.formCard} onPress={onPress}>
                <View style={styles.formCardHeader}>
                    <View style={styles.formInfo}>
                        <Text style={styles.formTitle}>Formulaire #{form.formId || 'N/A'}</Text>
                        <Text style={styles.patientInfo}>{form.patientName || 'Unknown'} - {form.status || 'Unknown'}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.chatButtonSmall}
                        onPress={onChatPress}
                    >
                        <View style={styles.chatIconContainer}>
                            <Ionicons name="chatbubbles" size={20} color={COLORS.light} />
                            {unreadCount > 0 && (
                                <View style={styles.unreadBadgeSmall}>
                                    <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // Show loading only for initial load, not for filter changes
    if (loading && !refreshing && forms.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement des formulaires...</Text>
            </View>
        );
    }

    // Function to get the header title based on active filter
    const getHeaderTitle = () => {
        switch (activeFilter) {
            case 'completed':
                return 'Formulaires complétés';
            case 'all':
                return 'Tous les formulaires';
            case 'ai':
                return 'AI Insights';
            case 'pending':
            default:
                return 'Formulaires en attente';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
                    {userName && <Text style={styles.welcomeText}>Bienvenue, Dr. {userName}</Text>}
                </View>
                
            </View>
            
            <View style={filterStyles.filterContainer}>
                <TouchableOpacity 
                    style={[filterStyles.filterButton, activeFilter === 'pending' && filterStyles.activeFilter]}
                    onPress={() => handleFilterChange('pending')}
                >
                    <Text style={[filterStyles.filterText, activeFilter === 'pending' && filterStyles.activeFilterText]}>
                        En attente
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[filterStyles.filterButton, activeFilter === 'completed' && filterStyles.activeFilter]}
                    onPress={() => handleFilterChange('completed')}
                >
                    <Text style={[filterStyles.filterText, activeFilter === 'completed' && filterStyles.activeFilterText]}>
                        Complétés
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[filterStyles.filterButton, activeFilter === 'all' && filterStyles.activeFilter]}
                    onPress={() => handleFilterChange('all')}
                >
                    <Text style={[filterStyles.filterText, activeFilter === 'all' && filterStyles.activeFilterText]}>
                        Tous
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[filterStyles.filterButton, activeFilter === 'ai' && filterStyles.activeFilter]}
                    onPress={() => handleFilterChange('ai')}
                >
                    <Text style={[filterStyles.filterText, activeFilter === 'ai' && filterStyles.activeFilterText]}>
                        🧠 AI
                    </Text>
                </TouchableOpacity>
            </View>
            
            {activeFilter === 'ai' ? (
                <AIInsights 
                    patients={patients}
                    onPatientSelect={(patientId) => {
                        const patientForms = Array.isArray(forms) ? forms.filter(f => f && f.patientId === patientId) : [];
                        if (patientForms.length > 0) {
                            handleFormPress(patientForms[0]);
                        }
                    }}
                />
            ) : (
                <FlatList
                    data={filteredForms}
                    keyExtractor={(item, index) => item?.formId?.toString() || `form-${index}`}
                    renderItem={({ item }) => (
                        <FormCardWithChat 
                            form={item} 
                            onPress={() => handleFormPress(item)}
                            onChatPress={() => navigation.navigate('NeurologueChat', { 
                                formId: item?.formId, 
                                doctorId: item?.referringDoctorId 
                            })}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {loading ? 'Chargement...' :
                                 activeFilter === 'pending' ? 'Aucun formulaire en attente' : 
                                 activeFilter === 'completed' ? 'Aucun formulaire complété' : 
                                 'Aucun formulaire disponible'}
                            </Text>
                            {!loading && (
                                <TouchableOpacity 
                                    style={localStyles.retryButton}
                                    onPress={loadForms}
                                >
                                    <Text style={localStyles.retryButtonText}>Réessayer</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                />
            )}
        </View>
    );
};

// Styles for the filter buttons
const filterStyles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
        alignItems: 'center',
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        color: '#555',
        fontWeight: '500',
        fontSize: 12,
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

// Local styles for this component
const localStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.grey,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.grey,
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
    },
});

export default NeurologueDashboard;