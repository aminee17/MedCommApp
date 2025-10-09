import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthHeaders } from './authService';

// Get a medical form by ID
export async function getMedicalFormById(formId) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/medical-forms/${formId}`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error fetching form: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching medical form:', error);
        throw error;
    }
}

const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    
    console.log('Formatting date:', dateString);
    
    // If already in YYYY-MM-DD format, return as is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = dateString.split('/');
        console.log('Converted date:', `${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;
    }
    
    console.log('Invalid date format:', dateString);
    return null;
};

const TIMEOUT_DURATION = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Sleep function for retry delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert seizureOccurrence to seizureFrequency enum
const getSeizureFrequencyFromOccurrence = (seizureOccurrence) => {
    if (!seizureOccurrence || typeof seizureOccurrence !== 'object') {
        return null;
    }
    
    // Check which frequency is selected
    if (seizureOccurrence.quotidienne) return 'DAILY';
    if (seizureOccurrence.hebdomadaire) return 'WEEKLY';
    if (seizureOccurrence.mensuelle) return 'MONTHLY';
    
    return null;
};

export async function submitMedicalForm(formData) {
    try {
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Form data keys:', Object.keys(formData));
        console.log('=== FRONTEND FORM DATA VALUES ===');
        console.log('progressiveFall:', formData.progressiveFall);
        console.log('suddenFall:', formData.suddenFall);
        console.log('clonicJerks:', formData.clonicJerks);
        console.log('automatisms:', formData.automatisms);
        console.log('activityStop:', formData.activityStop);
        console.log('sensitiveDisorders:', formData.sensitiveDisorders);
        console.log('sensoryDisorders:', formData.sensoryDisorders);
        console.log('lateralTongueBiting:', formData.lateralTongueBiting);
        console.log('seizureType:', formData.seizureType);
        console.log('=== END FRONTEND VALUES ===');

        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        // Format dates to match backend expectations (YYYY-MM-DD)
        const birthDate = formatDateForBackend(formData.birthDate);
        const firstSeizureDate = formatDateForBackend(formData.firstSeizureDate);
        const lastSeizureDate = formatDateForBackend(formData.lastSeizureDate);

        // Create a clean object matching the MedicalFormRequest DTO
        const requestData = {
            // Patient Info
            fullName: formData.fullName,
            birthDate,
            gender: formData.gender,
            cinNumber: formData.cinNumber ? parseInt(formData.cinNumber) : null,
            governorate_id: formData.governorate_id ? parseInt(formData.governorate_id) : null,
            city_id: formData.city_id ? parseInt(formData.city_id) : null,
            address: formData.address,
            phoneNumber: formData.phoneNumber,

            // Seizure History
            firstSeizureDate,
            lastSeizureDate,
            isFirstSeizure: formData.isFirstSeizure,
            // Handle seizureFrequency - convert from seizureOccurrence
            seizureFrequency: getSeizureFrequencyFromOccurrence(formData.seizureOccurrence),
            seizureDuration: formData.seizureDuration ? parseInt(formData.seizureDuration) : null,
            totalSeizures: formData.totalSeizures ? parseInt(formData.totalSeizures) : null,

            // Characteristics
            hasAura: formData.hasAura,
            auraDescription: formData.auraDescription,
            seizureType: formData.seizureType, // Changed from seizureTypes to seizureType

            // Updated "Pendant la crise" symptoms
            lossOfConsciousness: formData.lossOfConsciousness,
            progressiveFall: formData.progressiveFall,
            suddenFall: formData.suddenFall,
            bodyStiffening: formData.bodyStiffening,
            clonicJerks: formData.clonicJerks,
            automatisms: formData.automatisms,
            eyeDeviation: formData.eyeDeviation,
            activityStop: formData.activityStop,
            sensitiveDisorders: formData.sensitiveDisorders,
            sensoryDisorders: formData.sensoryDisorders,
            incontinence: formData.incontinence,
            lateralTongueBiting: formData.lateralTongueBiting,

            // Miscellaneous
            otherInformation: formData.otherInformation
        };

        // Log the request data for debugging
        console.log('Request data:', JSON.stringify(requestData));

        // Create FormData object for multipart request
        const form = new FormData();

        // Add the JSON data as a string parameter (not a part)
        form.append('form', JSON.stringify(requestData));

        // Add files if they exist
        if (formData.mriPhoto?.uri) {
            form.append('mriPhoto', {
                uri: formData.mriPhoto.uri,
                name: 'mri_photo.jpg',
                type: 'image/jpeg'
            });
        }

        if (formData.seizureVideo?.uri) {
            form.append('seizureVideo', {
                uri: formData.seizureVideo.uri,
                name: 'seizure_video.mp4',
                type: 'video/mp4'
            });
        }

        // Use fetch with proper JWT headers
        const headers = await getAuthHeaders();
        // Remove Content-Type to let browser set it for multipart/form-data
        delete headers['Content-Type'];
        
        const response = await fetch(`${API_BASE_URL}/api/medical-forms/submit?userId=${userId}`, {
            method: 'POST',
            headers,
            body: form,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', response.status, errorText);
            throw new Error('File upload error. Please try again.');
        }
        
        const data = await response.json();
        console.log('Form submitted successfully:', data);
        return data;
    } catch (error) {
        console.error('=== FORM SUBMISSION ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        throw new Error('File upload error. Please try again.');
    }
}