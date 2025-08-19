// src/utils/jsonUtils.js

/**
 * Safely parse the response text into JSON.
 * Throws an error if parsing fails.
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function parseJSONResponse(response) {
    console.log('Parsing response with status:', response.status);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        console.error('Error response body:', text);
        
        // Try to parse error message from response body
        try {
            const errorJson = JSON.parse(text);
            throw new Error(errorJson.message || text);
        } catch (parseError) {
            // If it's not JSON, use the text directly as error message
            throw new Error(text || `Erreur serveur: ${response.status}`);
        }
    }
    
    try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', json);
        return json;
    } catch (error) {
        console.error('JSON parse error:', error);
        console.error('Raw text:', text);
        throw new Error('Réponse invalide du serveur');
    }
}
