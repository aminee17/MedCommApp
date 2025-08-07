import {API_BASE_URL} from '../utils/constants';
import {parseJSONResponse} from '../utils/jsonUtils';
import { fetchWithErrorHandling } from '../utils/errorMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthHeaders } from './authService';

/**
 * Fetch medical forms for the current doctor with optional filtering
 * @param {string} filter - Filter type: 'all', 'active', 'completed', or 'recent'
 * @returns {Promise<Array>} - List of medical forms
 */
export async function fetchMedicalFormsForDoctor(filter = 'active') {
    try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        const headers = await getAuthHeaders();
        const response = await fetchWithErrorHandling(
            `${API_BASE_URL}/api/medical-forms/doctor?userId=${userId}&filter=${filter}`, 
            {
                method: 'GET',
                headers,
                credentials: 'include'
            }
        );
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error fetching medical forms:', error);
        throw error;  // rethrow so caller can handle
    }
}