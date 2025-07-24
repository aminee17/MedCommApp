import {API_BASE_URL} from '../utils/constants';
import {parseJSONResponse} from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Add userId as query parameter and header, plus the filter parameter
        const response = await fetch(
            `${API_BASE_URL}/api/medical-forms/doctor?userId=${userId}&filter=${filter}`, 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                credentials: 'include' // Include credentials for session cookies
            }
        );
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error fetching medical forms:', error);
        throw error;  // rethrow so caller can handle
    }
}