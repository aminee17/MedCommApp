import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import { getAuthHeaders } from './authService';

/**
 * Send a chat message
 * @param {Object} messageData - The message data
 * @returns {Promise<Object>} - The sent message
 */
export const sendChatMessage = async (messageData) => {
    try {
        const url = `${API_BASE_URL}/api/chat/send`;
        console.log('Sending chat message to URL:', url);
        console.log('Message data:', messageData);
        
        const requestBody = JSON.stringify(messageData);
        console.log('Request body:', requestBody);

        const headers = await getAuthHeaders();
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
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
        const url = `${API_BASE_URL}/api/chat/messages/${formId}`;
        console.log('Getting messages from URL:', url);

        const headers = await getAuthHeaders();
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';
        
        const response = await fetch(url, {
            method: 'GET',
            headers,
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
        const url = `${API_BASE_URL}/api/chat/unread-count/${formId}`;

        const headers = await getAuthHeaders();
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';
        
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        const data = await parseJSONResponse(response);
        return data.count || 0;
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return 0;
    }
};

/**
 * Send a voice message
 * @param {Object} voiceData - The voice message data
 * @returns {Promise<Object>} - The sent voice message
 */
export const sendVoiceMessage = async (voiceData) => {
    try {
        const formData = new FormData();
        formData.append('formId', voiceData.formId.toString());
        formData.append('audioFile', voiceData.audioFile);
        if (voiceData.receiverId) {
            formData.append('receiverId', voiceData.receiverId.toString());
        }
        
        const url = `${API_BASE_URL}/api/chat/send-voice`;

        const headers = await getAuthHeaders();
        // Remove content-type to allow multipart boundary
        delete headers['Content-Type'];
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: formData
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error sending voice message:', error);
        throw error;
    }
};

/**
 * Get audio URL for a voice message
 * @param {number} messageId - The message ID
 * @returns {string} - The audio URL
 */
export const getAudioUrl = (messageId) => {
    return `${API_BASE_URL}/api/chat/audio/${messageId}`;
};