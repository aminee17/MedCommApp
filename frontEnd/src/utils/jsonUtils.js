// src/utils/jsonUtils.js

/**
 * Safely parse the response text into JSON.
 * Throws an error if parsing fails.
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function parseJSONResponse(response) {
    console.log('Parsing response with status:', response.status);
    
    if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        const text = await response.text();
        console.error('Error response body:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', json);
        return json;
    } catch (error) {
        console.error('JSON parse error:', error);
        console.error('Raw text:', text);
        throw new Error('Invalid JSON response from server');
    }
}
