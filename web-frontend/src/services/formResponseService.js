import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import { getAuthHeaders } from './authService';

// Internal helper: retry once on 403 for flaky permission checks
const requestWithRetry = async (url, options = {}) => {
    const doFetch = async () => fetch(url, { ...options });
    let res = await doFetch();
    if (res.status === 403) {
        await new Promise(r => setTimeout(r, 200));
        const headers = await getAuthHeaders();
        res = await fetch(url, { ...options, headers: { ...(options.headers || {}), ...headers } });
    }
    return res;
};

/**
 * Check if a form has a neurologist response (for doctors)
 * @param {number} formId - The ID of the medical form
 * @returns {Promise<boolean>} - Whether the form has a response
 */
export async function checkFormResponse(formId) {
    try {
        const headers = await getAuthHeaders();
        const response = await requestWithRetry(
            `${API_BASE_URL}/api/medical-forms/responses/check/${formId}`, 
            {
                method: 'GET',
                headers,
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
        const headers = await getAuthHeaders();
        const response = await requestWithRetry(
            `${API_BASE_URL}/api/medical-forms/responses/${formId}`, 
            {
                method: 'GET',
                headers,
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
        const headers = await getAuthHeaders();
        const response = await requestWithRetry(
            `${API_BASE_URL}/api/neurologue/form-response/${formId}`, 
            {
                method: 'GET',
                headers,
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
        const headers = await getAuthHeaders();
        const response = await fetch(
            `${API_BASE_URL}/api/neurologue/form-response`, 
            {
                method: 'POST',
                headers,
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