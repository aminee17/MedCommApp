import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { fetchPendingFormsForNeurologue, fetchCompletedFormsForNeurologue, fetchAllFormsForNeurologue } from '../../services/neurologueService';
import { countUnreadMessagesForForm } from '../../services/chatService';
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

    // Load forms based on active filter
    const loadForms = async () => {
        try {
            setLoading(true);
            let data;
            switch (activeFilter) {
                case 'completed':
                    data = await fetchCompletedFormsForNeurologue();
                    break;
                case 'all':
                    data = await fetchAllFormsForNeurologue();
                    break;
                case 'ai':
                    data = await fetchAllFormsForNeurologue();
                    break;
                case 'pending':
                default:
                    data = await fetchPendingFormsForNeurologue();
                    break;
            }
            setForms(data || []);
            
            // Extract unique patients for AI insights
            const uniquePatients = (data || []).reduce((acc, form) => {
                const patientName = form.patientName || 'Unknown Patient';
                
                if (!acc.find(p => p.patientId === form.patientId)) {
                    acc.push({
                        patientId: form.patientId,
                        fullName: patientName,
                        formId: form.formId
                    });
                }
                return acc;
            }, []);
            setPatients(uniquePatients);
        } catch (error) {
            console.error('Error fetching forms:', error);
            if (error.message.includes('User ID not found')) {
                Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
                    { text: 'OK', onPress: () => navigation.replace('NeurologueLogin') }
                ]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadUserData();
        loadForms();
    }, []);

    // Refresh when active filter changes
    useEffect(() => {
        console.log('🔄 Filter changed to:', activeFilter);
        loadForms();
    }, [activeFilter]);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Screen focused, refreshing data...');
            loadForms();
        }, [activeFilter])
    );

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadForms();
    }, [activeFilter]);

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

    // Handle filter change with immediate refresh
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        // The useEffect above will automatically trigger loadForms()
    };

    // Component for form card with chat functionality
    const FormCardWithChat = ({ form, onPress, onChatPress }) => {
        const [unreadCount, setUnreadCount] = useState(0);

        useEffect(() => {
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
        }, [form.formId]);

        return (
            <TouchableOpacity style={styles.formCard} onPress={onPress}>
                <View style={styles.formCardHeader}>
                    <View style={styles.formInfo}>
                        <Text style={styles.formTitle}>Formulaire #{form.formId}</Text>
                        <Text style={styles.patientInfo}>{form.patientName} - {form.status}</Text>
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

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}> </Text>
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
                <View style={styles.headerIcons}>
                    {/* Remove the in-screen logout button since it's in header */}
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

                        const patientForms = forms.filter(f => f.patientId === patientId);

                        if (patientForms.length > 0) {
                            handleFormPress(patientForms[0]);
                        }
                    }}
                />
            ) : (
                <FlatList
                    data={forms}
                    keyExtractor={(item, index) => item.formId?.toString() || index.toString()}
                    renderItem={({ item }) => (
                        <FormCardWithChat 
                            form={item} 
                            onPress={() => handleFormPress(item)}
                            onChatPress={() => navigation.navigate('NeurologueChat', { 
                                formId: item.formId, 
                                doctorId: item.referringDoctorId 
                            })}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {activeFilter === 'pending' ? 'Aucun formulaire en attente' : 
                                 activeFilter === 'completed' ? 'Aucun formulaire complété' : 
                                 'Aucun formulaire disponible'}
                            </Text>
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

// Add these styles to your existing styles or create them
const additionalStyles = StyleSheet.create({
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
    },
});

export default NeurologueDashboard;