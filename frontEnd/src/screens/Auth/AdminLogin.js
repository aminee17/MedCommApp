import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { API_BASE_URL } from '../../utils/constants';
import { parseJSONResponse } from '../../utils/jsonUtils';
import { fetchWithErrorHandling } from '../../utils/errorMessages';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';
import { Button, Input, Card } from '../../components/common';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLogin({ navigation }) {
    const [showLogin, setShowLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigateToRegistration = () => {
        console.log('Navigating to AdminRegistration');
        navigation.navigate('AdminRegistration');
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await parseJSONResponse(response);

            if (data.role === 'ADMIN') {
                // Store user data in AsyncStorage
                await AsyncStorage.setItem('userId', data.userId.toString());
                await AsyncStorage.setItem('userName', data.name);
                await AsyncStorage.setItem('userEmail', data.email);
                await AsyncStorage.setItem('userRole', data.role.toString());
                
                Alert.alert('Succès', 'Connexion réussie');
                navigation.navigate('AdminDashboard', { userId: data.userId });
            } else {
                Alert.alert('Erreur', 'Accès non autorisé pour les administrateurs');
            }
        } catch (error) {
            Alert.alert('Erreur de connexion', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (showLogin) {
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Text style={styles.title}>Connexion Administrateur</Text>
                    
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    
                    <Input
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry
                    />
                    
                    <Button
                        title="Se connecter"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                    />
                    
                    <Button
                        title="Retour"
                        onPress={() => setShowLogin(false)}
                        type="outline"
                        style={styles.button}
                    />
                </Card>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>Espace Administrateur</Text>
                <Text style={styles.subtitle}>Choisissez une option :</Text>

                <Button
                    title="Se connecter"
                    onPress={() => setShowLogin(true)}
                    style={styles.button}
                />

                <Button
                    title="Créer un compte"
                    onPress={navigateToRegistration}
                    type="secondary"
                    style={styles.button}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.l,
        backgroundColor: COLORS.background,
    },
    card: {
        padding: SPACING.xl,
        borderRadius: 16,
        ...SHADOWS.large,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    title: {
        fontSize: SIZES.xxlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.xl,
        textAlign: 'center',
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: SIZES.large,
        marginBottom: SPACING.xl,
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    button: {
        marginVertical: SPACING.s,
    },
});