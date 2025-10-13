const API_BASE_URL = 'https://web-production-c46dd.railway.app';

// Direct URL (for reference)
export const getApiUrl = (endpoint) => {
  return API_BASE_URL + endpoint;
};

// Proxy function using Netlify function
export const fetchWithProxy = async (endpoint, options = {}) => {
  const proxyUrl = '/.netlify/functions/cors-proxy';
  const targetUrl = API_BASE_URL + endpoint;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
        method: options.method || 'GET',
        body: options.body,
        headers: options.headers
      })
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Proxy fetch error:', error);
    throw error;
  }
};

export { API_BASE_URL };