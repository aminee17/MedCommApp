// services/pdfService.js - ENHANCED VERSION
import { API_BASE_URL } from '../utils/constants';
import { getAuthHeaders } from './authService';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

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
        
        // Enhanced Debug: Check PDF status
        let pdfGeneratedCount = 0;
        data.forEach(form => {
            console.log(`📄 Form ${form.formId}: PDF Generated = ${form.pdfGenerated}, File = ${form.pdfFileName}, Status = ${form.status}`);
            if (form.pdfGenerated) {
                pdfGeneratedCount++;
            }
        });
        console.log(`📊 PDF Generation Summary: ${pdfGeneratedCount}/${data.length} forms have PDFs generated`);
        
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
        
        // Create a proper filename
        const finalFileName = fileName || `formulaire_${formId}.pdf`;
        const cleanFileName = finalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        // For React Native - save file locally and then share
        const fileUri = `${FileSystem.documentDirectory}${cleanFileName}`;
        
        // Download the file directly using React Native FileSystem
        try {
            const downloadResult = await FileSystem.downloadAsync(
                `${API_BASE_URL}/api/pdf/download/${formId}`,
                fileUri,
                {
                    headers: headers
                }
            );
            
            if (downloadResult.status === 200) {
                // Check if sharing is available and share the file
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                    await Sharing.shareAsync(downloadResult.uri, {
                        mimeType: 'application/pdf',
                        dialogTitle: 'Télécharger le formulaire médical',
                        UTI: 'com.adobe.pdf'
                    });
                    console.log('✅ PDF download completed and shared');
                } else {
                    Alert.alert('Succès', `PDF téléchargé dans: ${downloadResult.uri}`);
                }
            } else {
                throw new Error(`Download failed with status: ${downloadResult.status}`);
            }
        } catch (fileSystemError) {
            console.error('❌ FileSystem download failed, trying fetch approach:', fileSystemError);
            
            // Fallback to fetch + blob approach if FileSystem download fails
            const response = await fetch(`${API_BASE_URL}/api/pdf/download/${formId}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Download error:', errorText);
                throw new Error('Erreur lors du téléchargement du PDF: ' + response.status);
            }
            
            const pdfData = await response.blob();
            
            // Convert blob to base64 for React Native FileSystem
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64Data = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
                    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    
                    // Check if sharing is available and share the file
                    const isAvailable = await Sharing.isAvailableAsync();
                    if (isAvailable) {
                        await Sharing.shareAsync(fileUri, {
                            mimeType: 'application/pdf',
                            dialogTitle: 'Télécharger le formulaire médical',
                            UTI: 'com.adobe.pdf'
                        });
                        console.log('✅ PDF download completed and shared');
                    } else {
                        Alert.alert('Succès', `PDF téléchargé dans: ${fileUri}`);
                    }
                } catch (shareError) {
                    console.error('❌ Error saving/sharing PDF:', shareError);
                    Alert.alert('Erreur', 'Impossible de sauvegarder le PDF');
                }
            };
            reader.readAsDataURL(pdfData);
        }
        
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

// Generate PDF for a form if it doesn't exist
export const generatePdfForForm = async (formId) => {
    try {
        console.log(`🔄 Generating PDF for form ${formId}`);
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/regenerate/${formId}`, {
            method: 'POST',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ PDF generation error:', errorText);
            throw new Error('Erreur lors de la génération du PDF: ' + response.status);
        }

        const result = await response.json();
        console.log('✅ PDF generation result:', result);
        return result;
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        throw error;
    }
};

// Download PDF with automatic generation if needed
export const downloadPdfWithGeneration = async (formId, fileName) => {
    try {
        console.log(`📥 Downloading PDF for form ${formId} (with auto-generation if needed)`);
        
        // First try to download directly
        try {
            await downloadPdf(formId, fileName);
            return;
        } catch (downloadError) {
            console.log('📄 PDF not found, attempting to generate first...');
            
            // If download fails, try to generate the PDF first
            try {
                await generatePdfForForm(formId);
                // Wait a moment for the generation to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Try downloading again
                await downloadPdf(formId, fileName);
            } catch (generateError) {
                console.error('❌ Error generating PDF:', generateError);
                throw new Error('Impossible de générer ou télécharger le PDF');
            }
        }
    } catch (error) {
        console.error('❌ Error in downloadPdfWithGeneration:', error);
        throw error;
    }
};

// ADD THIS NEW METHOD FOR DEBUGGING
export const debugPdfStatus = async () => {
    try {
        console.log('🔍 Debugging PDF status...');
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/pdf/admin/debug`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors du debug: ' + response.status);
        }

        const data = await response.json();
        console.log('🔍 PDF Debug Info:', data);
        return data;
    } catch (error) {
        console.error('❌ Error debugging PDF status:', error);
        throw error;
    }
};