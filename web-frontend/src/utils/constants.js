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

// ✅ EmailJS configuration (your own IDs)
export const EMAIL_SERVICE_ID = 'service_y3t3n43';
export const EMAIL_TEMPLATE_ID = 'template_h733f6c';
export const EMAIL_PUBLIC_KEY = 'JuNZnJAaXluXgT8G2';   // public key (safe to expose)
export const EMAIL_PRIVATE_KEY = '8l8XgCIThJLJUA9yO6lYA'; // keep secret if backend-side use only
