import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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