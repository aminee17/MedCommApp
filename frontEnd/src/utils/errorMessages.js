// Utility function to convert HTTP status codes and server errors to user-friendly messages
export const getErrorMessage = (error, statusCode) => {
    // Handle network errors
    if (error.message === 'Network request failed' || error.message.includes('fetch')) {
        return 'Problème de connexion réseau. Vérifiez votre connexion internet.';
    }

    // Handle specific HTTP status codes
    switch (statusCode) {
        case 400:
            return 'Données invalides. Veuillez vérifier vos informations.';
        case 401:
            return 'Email ou mot de passe invalide.';
        case 403:
            return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        case 404:
            return 'Service non trouvé. Veuillez réessayer plus tard.';
        case 409:
            return 'Conflit de données. Cette information existe déjà.';
        case 422:
            return 'Données incomplètes ou invalides.';
        case 500:
            return 'Erreur du serveur. Veuillez réessayer plus tard.';
        case 502:
        case 503:
        case 504:
            return 'Service temporairement indisponible. Veuillez réessayer.';
        default:
            break;
    }

    // Handle specific error messages from server
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('invalid credentials') || errorMessage.includes('unauthorized')) {
        return 'Email ou mot de passe invalide.';
    }
    
    if (errorMessage.includes('user not found')) {
        return 'Aucun compte trouvé avec cet email.';
    }
    
    if (errorMessage.includes('email already exists')) {
        return 'Un compte avec cet email existe déjà.';
    }
    
    if (errorMessage.includes('cin already exists')) {
        return 'Un compte avec ce CIN existe déjà.';
    }
    
    if (errorMessage.includes('validation failed')) {
        return 'Informations invalides. Veuillez vérifier vos données.';
    }
    
    if (errorMessage.includes('timeout')) {
        return 'Délai d\'attente dépassé. Veuillez réessayer.';
    }

    // Default fallback message
    return error.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
};

// Enhanced fetch function with better error handling
export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            const error = new Error(errorText);
            error.status = response.status;
            throw error;
        }
        
        return response;
    } catch (error) {
        const friendlyMessage = getErrorMessage(error, error.status);
        const enhancedError = new Error(friendlyMessage);
        enhancedError.originalError = error;
        enhancedError.status = error.status;
        throw enhancedError;
    }
};