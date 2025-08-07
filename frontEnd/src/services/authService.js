import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get auth headers with JWT token
export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (userId) {
        headers['userId'] = userId;
    }
    
    return headers;
};

// Logout function - clears AsyncStorage and redirects to login
export const logout = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};