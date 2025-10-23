import {API_BASE_URL} from '../utils/constants';
import { fetchWithErrorHandling } from '../utils/errorMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthHeaders } from './authService';

// Internal helper: robust fetch with one retry on 403
const requestWithRetry = async (url, options = {}) => {
    const doFetch = async () => fetch(url, { ...options });
    let res = await doFetch();
    if (res.status === 403) {
        // Retry once after brief delay and refreshed headers
        await new Promise(r => setTimeout(r, 200));
        const headers = await getAuthHeaders();
        res = await fetch(url, { ...options, headers: { ...(options.headers || {}), ...headers } });
    }
    return res;
};

// Get user ID from AsyncStorage
const getUserId = async () => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

// Cache for forms data to prevent unnecessary API calls
let formsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 seconds

// Clear cache (useful after form submissions)
export const clearFormsCache = () => {
    formsCache = null;
    cacheTimestamp = null;
};

// Fetch all forms for neurologist with caching
export const fetchAllFormsForNeurologue = async (forceRefresh = false) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        // Check cache if not forcing refresh
        const now = Date.now();
        if (!forceRefresh && formsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            console.log('📦 Returning cached forms data');
            return formsCache;
        }
        
        // Build URL with userId parameter
        const url = `${API_BASE_URL}/api/neurologue/all-forms?userId=${userId}`;
        
        const headers = await getAuthHeaders();
        const response = await requestWithRetry(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        const data = await response.json();
        
        // Update cache
        formsCache = data;
        cacheTimestamp = Date.now();
        
        return data;
    } catch (error) {
        console.error("Error fetching all forms:", error.message || error);
        throw error;
    }
};

// Fetch pending forms for neurologist (uses cache when possible)
export const fetchPendingFormsForNeurologue = async () => {
    try {
        const allForms = await fetchAllFormsForNeurologue();
        return allForms.filter(form => form.status !== 'COMPLETED');
    } catch (error) {
        console.error("Error fetching pending forms:", error.message || error);
        throw error;
    }
};

// Fetch completed forms for neurologist (uses cache when possible)
export const fetchCompletedFormsForNeurologue = async () => {
    try {
        const allForms = await fetchAllFormsForNeurologue();
        return allForms.filter(form => form.status === 'COMPLETED');
    } catch (error) {
        console.error("Error fetching completed forms:", error.message || error);
        throw error;
    }
};

// Submit form response from neurologist - FIXED VERSION
export const submitFormResponse = async (formResponseData) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        console.log('📤 Submitting form response:', formResponseData);
        
        const url = `${API_BASE_URL}/api/neurologue/form-response?userId=${userId}`;
        
        // Get auth headers and ensure Content-Type is set
        const headers = await getAuthHeaders();
        headers['Content-Type'] = 'application/json'; // Add this line
        
        console.log('📤 Headers:', headers);
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(formResponseData)
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.error || JSON.stringify(errorData);
            } catch {
                errorText = await response.text();
            }
            console.error('❌ Server error:', errorText);
            throw new Error(errorText || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Form response submitted successfully:', result);
        
        // Clear cache after form submission to ensure fresh data
        clearFormsCache();
        
        return result;
    } catch (error) {
        console.error("❌ Error submitting form response:", error.message || error);
        throw error;
    }
};

// Fetch a specific form by ID
export const fetchFormById = async (formId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Use the correct endpoint from the NeurologueController
        const url = `${API_BASE_URL}/api/neurologue/form-response/${formId}?userId=${userId}`;
        
        const headers = await getAuthHeaders();
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching form by ID:", error.message || error);
        throw error;
    }
};

// Placeholder for chat functionality
export const sendChatMessage = async (formId, message, senderId, receiverId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/chat/send?userId=${userId}`;
        
        const headers = await getAuthHeaders();
        const response = await fetch(url, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({
                formId,
                message,
                senderId,
                receiverId,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to send message');
        }
        
        return response.json();
    } catch (error) {
        console.error("Error sending message:", error.message || error);
        throw error;
    }
};

// Fetch attachments for a form with JWT authentication
export const fetchAttachmentsForForm = async (formId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/neurologue/forms/${formId}/attachments?userId=${userId}`;
        
        const headers = await getAuthHeaders();
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching attachments:", error.message || error);
        throw error;
    }
};

// Fetch a specific attachment with JWT authentication
export const fetchAttachment = async (attachmentId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/neurologue/attachments/${attachmentId}?userId=${userId}`;
        
        const headers = await getAuthHeaders();
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }
        
        return response.blob();
    } catch (error) {
        console.error("Error fetching attachment:", error.message || error);
        throw error;
    }
};