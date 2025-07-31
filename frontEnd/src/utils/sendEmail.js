import { Platform } from 'react-native';
import {EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY, EMAIL_PRIVATE_KEY } from './constants';

/**
 * Sends the login credentials to the doctor's email after account creation.
 * @param {Object} params
 * @param {string} params.toEmail - Doctor's email address
 * @param {string} params.name - Doctor's full name
 * @param {string} params.password - Generated password
 */
export async function sendDoctorCredentials({ toEmail, name, password }) {
    // For React Native, we'll use a REST API approach instead of the browser-based emailjs
    const serviceId = EMAIL_SERVICE_ID;
    const templateId = EMAIL_TEMPLATE_ID;
    const publicKey = EMAIL_PUBLIC_KEY;

    const templateParams = {
        name: name,
        email: toEmail,
        password: password,
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'origin': Platform.OS === 'web' ? window.location.origin : 'http://localhost',
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                accessToken: EMAIL_PRIVATE_KEY,
                template_params: templateParams,
            }),
        });

        if (!response.ok) {
            let errorText = 'Unknown error';
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = `HTTP status ${response.status}`;
            }
            throw new Error(`Email sending failed: ${errorText}`);
        }

        console.log('Email sent successfully');
        return { 
            success: true,
            status: response.status
        };
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}