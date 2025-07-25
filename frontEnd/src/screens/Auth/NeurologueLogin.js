import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/constants';
import { fetchWithErrorHandling } from '../../utils/errorMessages';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';
import { Button, Input, Card, Header } from '../../components/common';

const NeurologueLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    navigation.replace('NeurologueDashboard');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [navigation]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez entrer votre email et mot de passe');
            return;
        }

        setLoading(true);
        try {
            const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: 'include'
            });

            const data = await response.json();
            
            // Store user data in AsyncStorage
            await AsyncStorage.setItem('userId', data.userId.toString());
            await AsyncStorage.setItem('userName', data.name);
            await AsyncStorage.setItem('userEmail', data.email);
            await AsyncStorage.setItem('userRole', data.role.toString());
            
            console.log('Login successful:', data.message);
            
            navigation.replace('NeurologueDashboard');
        } catch (error) {
            Alert.alert('Erreur de connexion', error.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.loginCard}>
                <Text style={styles.title}>Connexion Neurologue</Text>
                
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
                    style={styles.loginButton}
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
        backgroundColor: COLORS.lightGrey,
    },
    loginCard: {
        width: '100%',
        maxWidth: 400,
        padding: SPACING.l,
    },
    title: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.xl,
        color: COLORS.dark,
        textAlign: 'center',
    },
    loginButton: {
        marginTop: SPACING.m,
    },
});

export default NeurologueLogin;