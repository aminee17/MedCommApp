import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get a medical form by ID
export async function getMedicalFormById(formId) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/medical-forms/${formId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId
            },
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

// Helper to format dates safely
const formatDate = (dateString) => {
    if (!dateString) return null;
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    const parts = dateString.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return null;
};

const TIMEOUT_DURATION = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Sleep function for retry delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitMedicalForm(formData) {
    try {
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Form data keys:', Object.keys(formData));

        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

        // Format dates to match backend expectations (YYYY-MM-DD)
        const birthDate = formatDate(formData.birthDate);
        const firstSeizureDate = formatDate(formData.firstSeizureDate);
        const lastSeizureDate = formatDate(formData.lastSeizureDate);

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
            // Fix for empty string in seizureFrequency enum
            seizureFrequency: formData.seizureFrequency || null,
            seizureDuration: formData.seizureDuration ? parseInt(formData.seizureDuration) : null,
            totalSeizures: formData.totalSeizures ? parseInt(formData.totalSeizures) : null,

            // Characteristics
            hasAura: formData.hasAura,
            auraDescription: formData.auraDescription,
            seizureTypes: formData.seizureTypes,

            // Symptoms
            lossOfConsciousness: formData.lossOfConsciousness,
            bodyStiffening: formData.bodyStiffening,
            jerkingMovements: formData.jerkingMovements,
            eyeDeviation: formData.eyeDeviation,
            incontinence: formData.incontinence,
            tongueBiting: formData.tongueBiting,
            tongueBitingLocation: formData.tongueBitingLocation,

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

        // Use XMLHttpRequest for better multipart handling
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // Add userId as query parameter
            xhr.open('POST', `${API_BASE_URL}/api/medical-forms/submit?userId=${userId}`);
            
            // Set withCredentials to true for session cookies
            xhr.withCredentials = true;
            
            // Add userId as header as well
            xhr.setRequestHeader('userId', userId);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('Form submitted successfully:', data);
                        resolve(data);
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        reject(new Error('Error parsing server response'));
                    }
                } else {
                    console.error('Server response:', xhr.status, xhr.responseText);
                    reject(new Error('File upload error. Please try again.'));
                }
            };
            
            xhr.onerror = function() {
                console.error('Network error during form submission');
                reject(new Error('Network error. Please check your connection and try again.'));
            };
            
            xhr.timeout = TIMEOUT_DURATION;
            xhr.ontimeout = function() {
                reject(new Error('Request timed out. Please try again.'));
            };
            
            xhr.send(form);
        });
    } catch (error) {
        console.error('=== FORM SUBMISSION ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        throw new Error('File upload error. Please try again.');
    }
}