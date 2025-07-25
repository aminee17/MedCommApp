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
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>CIN: {item.cin}</Text>
            <Text>Rôle: {item.role}</Text>
            <Text>Spécialisation: {item.specialization || 'Non spécifié'}</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Créer le compte"
                    onPress={() => handleCreateAccount(item)}
                    color="#4CAF50"
                />
                <View style={{ width: 10 }} />
                <Button
                    title="Supprimer"
                    onPress={() => handleRejectRequest(item.userId)}
                    color="#F44336"
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