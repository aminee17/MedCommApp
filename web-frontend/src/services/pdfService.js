// services/pdfService.js
import { API_BASE_URL } from '../utils/constants';
import { getAuthHeaders } from './authService';
import * as FileSystem from 'expo-file-system';

export const fetchMedicalFormsForAdmin = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/admin/forms`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des formulaires');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching medical forms for admin:', error);
        throw error;
    }
};

export const downloadPdf = async (formId, fileName) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/download/${formId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors du téléchargement du PDF');
        }

        
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];
                const uri = `${FileSystem.documentDirectory}${fileName}`;
                await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                console.log('PDF saved to:', uri);
                resolve(uri);
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};

export const regeneratePdf = async (formId) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/regenerate/${formId}`, {
            method: 'POST',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la régénération du PDF');
        }

        return await response.json();
    } catch (error) {
        console.error('Error regenerating PDF:', error);
        throw error;
    }
};