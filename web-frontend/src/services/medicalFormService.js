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

// Validate file before upload
const validateFile = (file, maxSize, allowedTypes) => {
    if (!file || !file.uri) return null;
    
    // Check file size (convert MB to bytes)
    if (file.fileSize && file.fileSize > maxSize * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSize}MB limit`);
    }
    
    // Check file type
    if (file.type && !allowedTypes.includes(file.type)) {
        throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    return true;
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

        // Validate files before upload
        if (formData.mriPhoto?.uri) {
            validateFile(formData.mriPhoto, 10, ['image/jpeg', 'image/png', 'image/jpg']);
        }
        
        if (formData.seizureVideo?.uri) {
            validateFile(formData.seizureVideo, 50, ['video/mp4', 'video/avi', 'video/mov']);
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

            seizureFrequency: getSeizureFrequencyFromOccurrence(formData.seizureOccurrence),
            seizureDuration: formData.seizureDuration ? parseInt(formData.seizureDuration) : null,
            totalSeizures: formData.totalSeizures ? parseInt(formData.totalSeizures) : null,

            // Characteristics
            hasAura: formData.hasAura,
            auraDescription: formData.auraDescription,
            seizureType: formData.seizureType,

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
        console.log('Request data:', JSON.stringify(requestData, null, 2));

        // Create FormData object for multipart request
        const form = new FormData();

        // Add the JSON data as a string parameter
        form.append('form', JSON.stringify(requestData));

        // Add files if they exist
        if (formData.mriPhoto?.uri) {
            console.log('Adding MRI photo:', formData.mriPhoto);
            form.append('mriPhoto', {
                uri: formData.mriPhoto.uri,
                name: 'mri_photo.jpg',
                type: 'image/jpeg'
            });
        }

        if (formData.seizureVideo?.uri) {
            console.log('Adding seizure video:', formData.seizureVideo);
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
        
        console.log('📤 Sending form submission request...');
        const response = await fetch(`${API_BASE_URL}/api/medical-forms/submit?userId=${userId}`, {
            method: 'POST',
            headers,
            body: form,
            credentials: 'include'
        });
        
        console.log('📥 Server response status:', response.status);
        
        if (!response.ok) {
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.error || JSON.stringify(errorData);
            } catch {
                errorText = await response.text();
            }
            console.error('❌ Server error response:', errorText);
            throw new Error(errorText || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Form submitted successfully:', data);
        return data;
    } catch (error) {
        console.error('=== FORM SUBMISSION ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        throw error; // Re-throw the original error to preserve the message
    }
}

// Get form response for a specific form
export const getFormResponse = async (formId) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/medical-forms/${formId}/response?userId=${userId}`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        console.log('📥 Form response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error fetching form response: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Form response data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching form response:', error);
        throw error;
    }
};

// Check if a form has a response
export const checkFormResponse = async (formId) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/medical-forms/responses/check/${formId}?userId=${userId}`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error checking form response: ${response.status}`);
        }

        const data = await response.json();
        return data.hasResponse;
    } catch (error) {
        console.error('Error checking form response:', error);
        return false;
    }
};

// Test function to debug form responses
export const debugFormResponse = async (formId) => {
    try {
        console.log('🔍 Debugging form response for form:', formId);
        
        const userId = await AsyncStorage.getItem('userId');
        console.log('👤 User ID:', userId);
        
        // Check if form has response
        const hasResponse = await checkFormResponse(formId);
        console.log('📋 Form has response:', hasResponse);
        
        if (hasResponse) {
            const response = await getFormResponse(formId);
            console.log('✅ Form response details:', response);
            return response;
        } else {
            console.log('❌ No response found for form');
            return null;
        }
    } catch (error) {
        console.error('❌ Debug error:', error);
        throw error;
    }
};