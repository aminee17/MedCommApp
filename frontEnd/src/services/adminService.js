import { API_BASE_URL } from '../utils/constants';
import { sendDoctorCredentials } from '../utils/sendEmail';
import { parseJSONResponse } from '../utils/jsonUtils';
import { getAuthHeaders } from './authService';

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
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/admin/create-doctor`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        credentials: 'include'
    });

    const data = await parseJSONResponse(response);

    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du compte');
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
        } catch (error) {
            console.error('❌ Failed to send credentials email:', error.message);
        }
    }

    return { ...data, emailSent };
}

export async function rejectRequest(userId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/admin/reject-request/${userId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
    });
    if (!response.ok) throw new Error(await response.text());
}