// services/pdfService.js
import { API_BASE_URL } from '../utils/constants';
import { getAuthHeaders } from './authService';

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

        // For React Native, you might need to handle the file download differently
        // This is a basic implementation - you might want to use a file download library
        const blob = await response.blob();
        
        // Create a temporary link to download the file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `formulaire_${formId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
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