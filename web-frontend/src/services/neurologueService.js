import {API_BASE_URL} from '../utils/constants';
import { fetchWithErrorHandling } from '../utils/errorMessages';
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

// Cache for forms data to prevent unnecessary API calls
let formsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 seconds

// Clear cache (useful after form submissions)
export const clearFormsCache = () => {
    formsCache = null;
    cacheTimestamp = null;
};

// ✅ FIXED: Fetch all forms for neurologist with proper error handling
export const fetchAllFormsForNeurologue = async (forceRefresh = false) => {
    try {
        // Check cache if not forcing refresh
        const now = Date.now();
        if (!forceRefresh && formsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            console.log('📦 Returning cached forms data');
            return formsCache;
        }
        
        const url = `${API_BASE_URL}/api/neurologue/all-forms`;
        
        const headers = await getAuthHeaders();
        const response = await requestWithRetry(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        // ✅ FIX: Check response status before parsing JSON
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // If we can't parse JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            
            console.error('❌ Server error response:', errorMessage);
            
            // Clear cache on error
            formsCache = null;
            cacheTimestamp = null;
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // ✅ FIX: Ensure we always return an array, even if data is null/undefined
        const formsArray = Array.isArray(data) ? data : [];
        
        // Update cache
        formsCache = formsArray;
        cacheTimestamp = Date.now();
        
        console.log(`✅ Fetched ${formsArray.length} forms from server`);
        return formsArray;
    } catch (error) {
        console.error("❌ Error fetching all forms:", error.message || error);
        
        // Clear cache on error
        formsCache = null;
        cacheTimestamp = null;
        
        throw error;
    }
};

// ✅ FIXED: Fetch pending forms with safe array handling
export const fetchPendingFormsForNeurologue = async () => {
    try {
        const allForms = await fetchAllFormsForNeurologue();
        // ✅ FIX: Safe array filtering
        return Array.isArray(allForms) ? allForms.filter(form => form.status !== 'COMPLETED') : [];
    } catch (error) {
        console.error("❌ Error fetching pending forms:", error.message || error);
        return []; // Return empty array instead of throwing
    }
};

// ✅ FIXED: Fetch completed forms with safe array handling
export const fetchCompletedFormsForNeurologue = async () => {
    try {
        const allForms = await fetchAllFormsForNeurologue();
        // ✅ FIX: Safe array filtering
        return Array.isArray(allForms) ? allForms.filter(form => form.status === 'COMPLETED') : [];
    } catch (error) {
        console.error("❌ Error fetching completed forms:", error.message || error);
        return []; // Return empty array instead of throwing
    }
};

// Submit form response from neurologist
export const submitFormResponse = async (formResponseData) => {
    try {
        console.log('📤 Submitting form response:', formResponseData);
        
        const url = `${API_BASE_URL}/api/neurologue/form-response`;
        
        // Get auth headers and ensure Content-Type is set
        const headers = await getAuthHeaders();
        headers['Content-Type'] = 'application/json';
        
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
        // Use the correct endpoint from the NeurologueController
        const url = `${API_BASE_URL}/api/neurologue/form-response/${formId}`;
        
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



// Fetch attachments for a form with JWT authentication
export const fetchAttachmentsForForm = async (formId) => {
    try {
        const url = `${API_BASE_URL}/api/neurologue/forms/${formId}/attachments`;
        
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
        const url = `${API_BASE_URL}/api/neurologue/attachments/${attachmentId}`;
        
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