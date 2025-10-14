import { API_BASE_URL } from '../utils/constants';
import { parseJSONResponse } from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthHeaders } from './authService';

/**
 * Get all notifications for the current user
 * @returns {Promise<Array>} - List of notifications
 */
export async function getNotifications() {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

/**
 * Get unread notifications for the current user
 * @returns {Promise<Array>} - List of unread notifications
 */
export async function getUnreadNotifications() {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications/unread`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
}

/**
 * Count unread notifications for the current user
 * @returns {Promise<number>} - Count of unread notifications
 */
export async function countUnreadNotifications() {
    try {
    
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications/count`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        
        const data = await parseJSONResponse(response);
        return data.count;
    } catch (error) {
        console.error('Error counting unread notifications:', error);
        return 0;
    }
}

/**
 * Mark a notification as read
 * @param {number} notificationId - The ID of the notification
 * @returns {Promise<Object>} - The updated notification
 */
export async function markNotificationAsRead(notificationId) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
            method: 'POST',
            headers,
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - The response message
 */
export async function markAllNotificationsAsRead() {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
            method: 'POST',
            headers,
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

/**
 * Delete a notification
 * @param {number} notificationId - The ID of the notification to delete
 * @returns {Promise<Object>} - The response message
 */
export async function deleteNotification(notificationId) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
            method: 'DELETE',
            headers,
            credentials: 'include'
        });
        
        return await parseJSONResponse(response);
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
}