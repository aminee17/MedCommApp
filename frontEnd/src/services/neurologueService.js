import {API_BASE_URL} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get user ID from AsyncStorage
const getUserId = async () => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

// Fetch pending forms for neurologist
export const fetchPendingFormsForNeurologue = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Build URL with userId parameter
        const url = `${API_BASE_URL}/api/neurologue/pending?userId=${userId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId
            },
            credentials: 'include' // Include credentials for session cookies
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pending forms:", error.message || error);
        throw error;
    }
};

// Fetch completed forms for neurologist
export const fetchCompletedFormsForNeurologue = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Build URL with userId parameter
        const url = `${API_BASE_URL}/api/neurologue/completed?userId=${userId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId
            },
            credentials: 'include' // Include credentials for session cookies
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching completed forms:", error.message || error);
        throw error;
    }
};

// Fetch all forms for neurologist (both pending and completed)
export const fetchAllFormsForNeurologue = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        // Build URL with userId parameter
        const url = `${API_BASE_URL}/api/neurologue/all-forms?userId=${userId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId
            },
            credentials: 'include' // Include credentials for session cookies
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all forms:", error.message || error);
        throw error;
    }
};

// Submit form response from neurologist
export const submitFormResponse = async (formResponseData) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/neurologue/form-response?userId=${userId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'userId': userId
            },
            credentials: 'include', // Include credentials for session cookies
            body: JSON.stringify(formResponseData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to submit form response');
        }
        
        return response.json();
    } catch (error) {
        console.error("Error submitting form response:", error.message || error);
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
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId
            },
            credentials: 'include' // Include credentials for session cookies
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
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'userId': userId
            },
            credentials: 'include', // Include credentials for session cookies
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