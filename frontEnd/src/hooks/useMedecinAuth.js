import { useState } from 'react';
import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useMedecinAuth(navigation) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
                credentials: 'include' // Include credentials for session cookies
            });

            const data = await parseJSONResponse(response);

            if (!response.ok) {
                throw new Error(data || 'Erreur lors de la connexion');
            }

            // Store user data in AsyncStorage
            await AsyncStorage.setItem('userId', data.userId.toString());
            await AsyncStorage.setItem('userName', data.name);
            await AsyncStorage.setItem('userEmail', data.email);
            await AsyncStorage.setItem('userRole', data.role.toString());

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
            alert(error.message || 'Problème de connexion au serveur');
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