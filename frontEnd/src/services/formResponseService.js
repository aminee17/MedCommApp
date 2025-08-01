import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if a form has a neurologist response (for doctors)
 * @param {number} formId - The ID of the medical form
 * @returns {Promise<boolean>} - Whether the form has a response
 */
export async function checkFormResponse(formId) {
    try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Use the doctor endpoint to check for responses
        const response = await fetch(
            `${API_BASE_URL}/api/medical-forms/responses/check/${formId}?userId=${userId}`, 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                credentials: 'include'
            }
        );
        
        const data = await parseJSONResponse(response);
        return data.hasResponse;
    } catch (error) {
        console.error('Error checking form response:', error);
        return false;
    }
}

/**
 * Get the neurologist's response for a form (for doctors)
 * @param {number} formId - The ID of the medical form
 * @returns {Promise<Object>} - The form response data
 */
export async function getFormResponse(formId) {
    try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Use the doctor endpoint to get the response
        const response = await fetch(
            `${API_BASE_URL}/api/medical-forms/responses/${formId}?userId=${userId}`, 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                credentials: 'include'
            }
        );
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error getting form response:', error);
        throw error;
    }
}

/**
 * Get the neurologist's own response for a form (for neurologists)
 * @param {number} formId - The ID of the medical form
 * @returns {Promise<Object>} - The form response data
 */
export async function getNeurologistFormResponse(formId) {
    try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Use the neurologist endpoint to get the response
        const response = await fetch(
            `${API_BASE_URL}/api/neurologue/form-response/${formId}?userId=${userId}`, 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                credentials: 'include'
            }
        );
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error getting neurologist form response:', error);
        throw error;
    }
}

/**
 * Submit a neurologist's response to a form (for neurologists)
 * @param {Object} responseData - The form response data
 * @returns {Promise<Object>} - The result of the submission
 */
export async function submitFormResponse(responseData) {
    try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Use the neurologist endpoint to submit the response
        const response = await fetch(
            `${API_BASE_URL}/api/neurologue/form-response?userId=${userId}`, 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                body: JSON.stringify(responseData),
                credentials: 'include'
            }
        );
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error submitting form response:', error);
        throw error;
    }
}