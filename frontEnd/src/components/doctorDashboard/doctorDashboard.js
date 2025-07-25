import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import FormCard from './FormCard';
import FormPreviewModal from './FormPreviewModal';
import ResponseModal from './ResponseModal';
import { COLORS } from '../../utils/theme';

// Import services
import { fetchMedicalFormsForDoctor } from '../../services/dashboardService';
import { logout } from '../../services/authService';

const DoctorDashboard = () => {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('active');
    const navigation = useNavigation();

    useEffect(() => {
        fetchForms(activeFilter);
    }, [activeFilter]);

    const fetchForms = async (filter) => {
        try {
            setLoading(true);
            const data = await fetchMedicalFormsForDoctor(filter);
            setForms(data);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les formulaires');
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

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { 
                    text: 'Déconnecter', 
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'RoleSelection' }]
                        });
                    }
                }
            ]
        );
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
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
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