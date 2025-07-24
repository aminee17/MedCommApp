import { API_BASE_URL } from '../utils/constants';
import { sendDoctorCredentials } from '../utils/sendEmail';
import { parseJSONResponse } from '../utils/jsonUtils';

export async function fetchPendingRequests() {
    console.log('📡 Fetching pending requests...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/pending-requests`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Add credentials for session cookies
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
    const response = await fetch(`${API_BASE_URL}/api/admin/create-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        credentials: 'include' // Add credentials for session cookies
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
    const response = await fetch(`${API_BASE_URL}/api/admin/reject-request/${userId}`, {
        method: 'DELETE',
        credentials: 'include' // Add credentials for session cookies
    });
    if (!response.ok) throw new Error(await response.text());
}