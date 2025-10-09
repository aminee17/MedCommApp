// Use environment variable if available, otherwise fallback to development URL
// The URL has been updated to use localhost, as the backend Docker container
// is exposing its port 8080 to the host machine's localhost.
import { Platform } from 'react-native';

const guessLocalBackend = () => {
    // Web: reuse current host (useful for Expo web dev server on LAN)
    if (typeof window !== 'undefined' && window.location?.hostname) {
        const host = window.location.hostname;
        const protocol = window.location.protocol || 'http:';
        return `${protocol}//${host}:8080`;
    }
    // Android emulator localhost mapping
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }
    // iOS simulator or default
    return 'http://localhost:8080';
};

export const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL || guessLocalBackend()
).trim().replace(/\/+$/, '');

export const EMAIL_SERVICE_ID = 'service_9zv6eyt';
export const EMAIL_TEMPLATE_ID = 'template_n54dytm';
export const EMAIL_PUBLIC_KEY = '64NjucXfMHuHw6cA7';
export const EMAIL_PRIVATE_KEY = '6Fq-rOvRJEXOhy-r3JPmL';
