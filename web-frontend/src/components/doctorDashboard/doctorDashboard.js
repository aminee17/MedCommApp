import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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

const DoctorDashboard = () => {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('active');
    const navigation = useNavigation();
    const route = useRoute();
    const handleLogout = useLogout();

    // Handle logout from header
    useEffect(() => {
        console.log('DoctorDashboard - forceLogout param:', route.params?.forceLogout);
        if (route.params?.forceLogout) {
            console.log('DoctorDashboard - Triggering logout from header...');
            navigation.setParams({ forceLogout: null });
            handleLogout(false); // false = no confirmation (already confirmed in header)
        }
    }, [route.params?.forceLogout, handleLogout, navigation]);

    useEffect(() => {
        fetchForms(activeFilter);
    }, [activeFilter]);

    const fetchForms = async (filter) => {
        try {
            setLoading(true);
            const data = await fetchMedicalFormsForDoctor(filter);
            setForms(data);
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Impossible de récupérer les formulaires');
            
            // Handle session expiry
            if (error.message?.includes('Session expirée')) {
                Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
                    { text: 'OK', onPress: () => navigation.replace('RoleSelection') }
                ]);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFormPress = (form) => {
        setSelectedForm(form);
        setModalVisible(true);
    };

    const handleViewResponse = (formId) => {
        setSelectedFormId(formId);
        setResponseModalVisible(true);
    };
    
    const handleChatPress = (formId, neurologistId) => {
        navigation.navigate('DoctorChat', { formId, neurologistId });
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Tableau de bord</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.newFormButton}
                        onPress={() => navigation.navigate('MedicalForm')}
                    >
                        <Text style={styles.newFormButtonText}>+ Nouveau formulaire</Text>
                    </TouchableOpacity>
                    {/* Remove the in-screen logout button since it's in header */}
                </View>
            </View>
            
            <View style={styles.filterContainer}>
                {renderFilterButton('Actifs', 'active')}
                {renderFilterButton('Complétés', 'completed')}
                {renderFilterButton('Récents', 'recent')}
                {renderFilterButton('Tous', 'all')}
            </View>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : forms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Aucun formulaire {activeFilter === 'active' ? 'actif' : 
                                         activeFilter === 'completed' ? 'complété' : 
                                         activeFilter === 'recent' ? 'récent' : ''} trouvé
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={forms}
                    renderItem={({ item }) => (
                        <FormCard 
                            form={item} 
                            onPress={handleFormPress}
                            onViewResponse={handleViewResponse}
                            onChatPress={handleChatPress}
                        />
                    )}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    contentContainerStyle={styles.formList}
                />
            )}
            
            <FormPreviewModal
                visible={modalVisible}
                form={selectedForm}
                onClose={() => setModalVisible(false)}
            />
            
            <ResponseModal
                visible={responseModalVisible}
                formId={selectedFormId}
                onClose={() => setResponseModalVisible(false)}
            />
        </View>
    );
};

export default DoctorDashboard;