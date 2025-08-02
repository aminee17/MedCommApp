import React, { useState, useEffect } from 'react';
import styles from './styles';
import {
    View, Text, FlatList, TouchableOpacity, Alert, Button, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    fetchPendingRequests,
    createDoctorAccount,
    rejectRequest,
} from '../../services/adminService';
import { logout } from '../../services/authService';

export default function AdminDashboard({ navigation }) {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingRequests();
    }, []);

    const loadPendingRequests = async () => {
        try {
            const data = await fetchPendingRequests();
            setPendingRequests(data);
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Impossible de récupérer les demandes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (request) => {
        try {
            const data = await createDoctorAccount(request);
            const message = data.emailSent 
                ? 'Compte créé et email envoyé avec succès'
                : 'Compte créé avec succès, mais l\'envoi de l\'email a échoué';
            Alert.alert('Succès', message);
            await loadPendingRequests(); // reload UI
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

    const renderItem = ({ item }) => (
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

            <Text style={styles.subtitle}>Demandes de création de compte</Text>

            {loading ? (
                <Text style={styles.loading}>Chargement...</Text>
            ) : pendingRequests.length === 0 ? (
                <Text style={styles.noData}>Aucune demande en attente</Text>
            ) : (
                <FlatList
                    data={pendingRequests}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.userId.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}