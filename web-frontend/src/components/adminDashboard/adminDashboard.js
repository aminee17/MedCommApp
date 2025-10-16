
import React, { useState, useEffect } from 'react';
import styles from './styles';
import {

    View, Text, FlatList, TouchableOpacity, Alert, Button, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
    fetchPendingRequests,
    createDoctorAccount,
    rejectRequest,
} from '../../services/adminService';
import { useLogout } from '../../hooks/useLogout';
import { fetchMedicalFormsForAdmin, downloadPdf } from '../../services/pdfService';

export default function AdminDashboard({ navigation }) {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [medicalForms, setMedicalForms] = useState([]);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'forms'
    const [loading, setLoading] = useState(true);
    const [formsLoading, setFormsLoading] = useState(false);
    const handleLogout = useLogout();
    const route = useRoute();

    // React to header-triggered logout param changes
    useEffect(() => {

        if (route.params?.triggerLogout) {
            navigation.setParams({ triggerLogout: null });
            handleLogout();
        }
    }, [route.params?.triggerLogout]);

    useEffect(() => {
        if (activeTab === 'requests') {
            loadPendingRequests();
        } else {
            loadMedicalForms();
        }
    }, [activeTab]);

    const loadPendingRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchPendingRequests();
            setPendingRequests(data);
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Impossible de récupérer les demandes');
        } finally {
            setLoading(false);
        }
    };

    const loadMedicalForms = async () => {
        try {
            setFormsLoading(true);
            const data = await fetchMedicalFormsForAdmin();
            setMedicalForms(data);
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Impossible de récupérer les formulaires');
        } finally {
            setFormsLoading(false);
        }
    };

    const handleCreateAccount = async (request) => {
        try {
            const data = await createDoctorAccount(request);
            const message = data.emailSent 
                ? 'Compte créé et email envoyé avec succès'
                : 'Compte créé avec succès, mais l\'envoi de l\'email a échoué';
            Alert.alert('Succès', message);
            await loadPendingRequests();
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Une erreur est survenue');
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await rejectRequest(id);
            Alert.alert('Succès', 'Demande rejetée avec succès');
            loadPendingRequests();
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleDownloadPdf = async (formId, fileName) => {
        try {
            Alert.alert('Téléchargement', 'Téléchargement du PDF en cours...');
            await downloadPdf(formId, fileName);
            Alert.alert('Succès', 'PDF téléchargé avec succès');
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du téléchargement du PDF');
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.roleBadge, { backgroundColor: item.role === 'MEDECIN' ? '#E8F4F8' : '#F5E8F0' }]}>
                    <Text style={styles.roleBadgeText}>{item.role}</Text>
                </View>
            </View>
            
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>{item.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="card-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>{item.cin}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="medical-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>{item.specialization || 'Non spécifié'}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Créer le compte"
                    onPress={() => handleCreateAccount(item)}
                    color="#27AE60"
                />
                <View style={{ width: 10 }} />
                <Button
                    title="Rejeter"
                    onPress={() => handleRejectRequest(item.userId)}
                    color="#E74C3C"
                />
            </View>
        </View>
    );

    const renderFormItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}>Formulaire #{item.formId}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                </View>
            </View>
            
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>Patient: {item.patientName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="medical-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>Médecin: {item.doctorName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>Créé le: {formatDate(item.createdAt)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="document-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.infoText}>
                        PDF: {item.pdfGenerated ? 'Généré' : 'Non généré'}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                {item.pdfGenerated ? (
                    <Button
                        title="Télécharger PDF"
                        onPress={() => handleDownloadPdf(item.formId, item.pdfFileName)}
                        color="#3498DB"
                    />
                ) : (
                    <Text style={styles.noPdfText}>PDF non disponible</Text>
                )}
            </View>
        </View>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUBMITTED': return '#F39C12';
            case 'UNDER_REVIEW': return '#3498DB';
            case 'COMPLETED': return '#27AE60';
            case 'REQUIRES_SUPERVISION': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tableau de bord administrateur</Text>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
                        Demandes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'forms' && styles.activeTab]}
                    onPress={() => setActiveTab('forms')}
                >
                    <Text style={[styles.tabText, activeTab === 'forms' && styles.activeTabText]}>
                        Formulaires
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'requests' ? (
                <>
                    <Text style={styles.subtitle}>Demandes de création de compte</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : pendingRequests.length === 0 ? (
                        <Text style={styles.noData}>Aucune demande en attente</Text>
                    ) : (
                        <FlatList
                            data={pendingRequests}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item.userId.toString()}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </>
            ) : (
                <>
                    <Text style={styles.subtitle}>Formulaires médicaux</Text>
                    {formsLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : medicalForms.length === 0 ? (
                        <Text style={styles.noData}>Aucun formulaire médical</Text>
                    ) : (
                        <FlatList
                            data={medicalForms}
                            renderItem={renderFormItem}
                            keyExtractor={(item) => item.formId.toString()}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </>
            )}
        </SafeAreaView>
    );
}