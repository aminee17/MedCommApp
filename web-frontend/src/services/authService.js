import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get auth headers with JWT token
export const getAuthHeaders = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        
        console.log('Auth headers - Token exists:', !!token);
        console.log('Auth headers - User ID:', userId);
        
        const headers = {
            'Accept': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (userId) {
            headers['userId'] = userId;
        }
        
        return headers;
    } catch (error) {
        console.error('Error getting auth headers:', error);
        return {
            'Accept': 'application/json'
        };
    }
};

// Enhanced fetch with proper error handling
export const fetchWithAuth = async (url, options = {}) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers },
            credentials: 'include'
        });

        return response;
    } catch (error) {
        console.error('Fetch with auth error:', error);
        throw error;
    }
};

// Logout function - clears AsyncStorage
export const logout = async () => {
    try {
        console.log('Starting logout process...');
        
        // Clear all stored data
        await AsyncStorage.multiRemove([
            'token',
            'userId', 
            'userName',
            'userEmail',
            'userRole'
        ]);
        
        console.log('Logout completed successfully');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        return !!(token && userId);
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
};