import { useState } from 'react';
import { Alert } from 'react-native';
import { parseJSONResponse } from '../utils/jsonUtils';
import { fetchWithErrorHandling } from '../utils/errorMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, fetchDirect } from '../services/corsProxy';

export default function useMedecinAuth(navigation) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetchDirect('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
                credentials: 'include'
            });

            const data = await parseJSONResponse(response);

            // Store user data in AsyncStorage
            await AsyncStorage.setItem('userId', data.userId.toString());
            await AsyncStorage.setItem('userName', data.name);
            await AsyncStorage.setItem('userEmail', data.email);
            await AsyncStorage.setItem('userRole', data.role.toString());
            await AsyncStorage.setItem('token', data.token);

            // Role-based navigation here:
            if (data.role === 'ADMIN') {
                navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
            } else if (data.role === 'NEUROLOGUE' || data.role === 'NEUROLOGUE_RESIDENT') {
                navigation.reset({ index: 0, routes: [{ name: 'NeurologueDashboard' }] });
            } else if (data.role === 'MEDECIN') {
                navigation.reset({ index: 0, routes: [{ name: 'DoctorDashboard' }] });
            } else {
                alert('Rôle utilisateur non reconnu.');
            }

        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Erreur de connexion', error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        loading
    };
}