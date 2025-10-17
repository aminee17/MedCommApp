// services/pdfService.js - UPDATED VERSION
import { API_BASE_URL } from '../utils/constants';
import { getAuthHeaders } from './authService';

export const fetchMedicalFormsForAdmin = async () => {
    try {
        console.log('📡 Fetching medical forms for admin...');
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/admin/forms`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error response:', errorText);
            throw new Error('Erreur lors de la récupération des formulaires: ' + response.status);
        }

        const data = await response.json();
        console.log('✅ Medical forms data received:', data);
        
        // Debug: Check PDF status
        data.forEach(form => {
            console.log(`📄 Form ${form.formId}: PDF Generated = ${form.pdfGenerated}, File = ${form.pdfFileName}`);
        });
        
        return data;
    } catch (error) {
        console.error('❌ Error fetching medical forms for admin:', error);
        throw error;
    }
};

export const downloadPdf = async (formId, fileName) => {
    try {
        console.log(`📥 Downloading PDF for form ${formId}, filename: ${fileName}`);
        
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/download/${formId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors du téléchargement du PDF: ' + response.status);
        }

        // For React Native, use a different approach for file download
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `formulaire_${formId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ PDF download completed');
        
    } catch (error) {
        console.error('❌ Error downloading PDF:', error);
        throw error;
    }
};

export const regeneratePdf = async (formId) => {
    try {
        console.log(`🔄 Regenerating PDF for form ${formId}`);
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/regenerate/${formId}`, {
            method: 'POST',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la régénération du PDF: ' + response.status);
        }

        const result = await response.json();
        console.log('✅ PDF regeneration result:', result);
        return result;
    } catch (error) {
        console.error('❌ Error regenerating PDF:', error);
        throw error;
    }
};