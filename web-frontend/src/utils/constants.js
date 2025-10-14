// constants.js
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
    // Always use production URL when deployed
    if (typeof window !== 'undefined' && window.location?.hostname !== 'localhost') {
        return 'https://medcommapp.onrender.com';
    }
    
    // Development URLs
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl().trim().replace(/\/+$/, '');

export const EMAIL_SERVICE_ID = 'service_9zv6eyt';
export const EMAIL_TEMPLATE_ID = 'template_n54dytm';
export const EMAIL_PUBLIC_KEY = '64NjucXfMHuHw6cA7';
export const EMAIL_PRIVATE_KEY = '6Fq-rOvRJEXOhy-r3JPmL';