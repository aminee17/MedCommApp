import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get user ID from AsyncStorage
 */
const getUserId = async () => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

/**
 * Send a chat message
 * @param {Object} messageData - The message data
 * @returns {Promise<Object>} - The sent message
 */
export const sendChatMessage = async (messageData) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/chat/send?userId=${userId}`;
        console.log('Sending chat message to URL:', url);
        console.log('With userId:', userId);
        console.log('Message data:', messageData);
        
        const requestBody = JSON.stringify(messageData);
        console.log('Request body:', requestBody);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'userId': userId.toString()
            },
            credentials: 'include',
            body: requestBody
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const responseData = await parseJSONResponse(response);
        console.log('Response data:', responseData);
        
        return responseData;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

/**
 * Get messages for a form
 * @param {number} formId - The form ID
 * @returns {Promise<Array>} - List of messages
 */
export const getMessagesForForm = async (formId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/chat/messages/${formId}?userId=${userId}`;
        console.log('Getting messages from URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId.toString()
            },
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error getting chat messages:', error);
        throw error;
    }
};

/**
 * Count unread messages for a form
 * @param {number} formId - The form ID
 * @returns {Promise<number>} - Count of unread messages
 */
export const countUnreadMessagesForForm = async (formId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }
        
        const url = `${API_BASE_URL}/api/chat/unread-count/${formId}?userId=${userId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId.toString()
            },
            credentials: 'include'
        });
        
        const data = await parseJSONResponse(response);
        return data.count || 0;
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return 0;
    }
};