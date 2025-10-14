import { API_BASE_URL } from '../utils/constants';
import { sendDoctorCredentials } from '../utils/sendEmail';
import { parseJSONResponse } from '../utils/jsonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchPendingRequests() {
    console.log('📡 Fetching pending requests...');
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/admin/pending-requests`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        console.log('🌐 Response status:', response.status);

        const json = await parseJSONResponse(response);
        console.log('✅ Parsed JSON:', json);

        return json;
    } catch (error) {
        console.error('❌ Fetch failed:', error.message);
        throw error;
    }
}

export async function createDoctorAccount(request) {
    try {
        console.log('📡 Creating doctor account with request:', request);
        
        // Get headers manually to ensure proper Content-Type
        const token = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        
        // Add auth headers if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            headers['userid'] = userId;
        }
        
        console.log('📡 Sending headers:', headers);

        const response = await fetch(`${API_BASE_URL}/api/admin/create-doctor`, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
            credentials: 'include'
        });

        console.log('🌐 Response status:', response.status);

        const data = await parseJSONResponse(response);

        if (!response.ok) {
            console.error('❌ Server error:', data);
            throw new Error(data.message || data.error || 'Erreur lors de la création du compte');
        }

        let emailSent = false;
        if (data.doctor?.email && data.doctor?.name && data.doctor?.password) {
            try {
                await sendDoctorCredentials({
                    toEmail: data.doctor.email,
                    name: data.doctor.name,
                    password: data.doctor.password,
                });
                emailSent = true;
                console.log('✅ Email sent successfully');
            } catch (error) {
                console.error('❌ Failed to send credentials email:', error.message);
            }
        }

        console.log('✅ Doctor account created successfully');
        return { ...data, emailSent };
    } catch (error) {
        console.error('❌ Error in createDoctorAccount:', error);
        throw error;
    }
}

export async function rejectRequest(userId) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/admin/reject-request/${userId}`, {
            method: 'DELETE',
            headers,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erreur lors du rejet de la demande');
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Error rejecting request:', error);
        throw error;
    }
}

// Helper function to get auth headers
async function getAuthHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
        headers['userid'] = userId;
    }
    
    return headers;
}