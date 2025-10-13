// src/services/corsProxy.js

// Direct API calls - no proxy needed since CORS is configured
const API_BASE_URL = 'https://medcommapp.onrender.com';

// For direct API calls (use this instead of fetchWithProxy)
export const fetchDirect = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

// Keep this for backward compatibility, but it now makes direct calls
export const fetchWithProxy = async (endpoint, options = {}) => {
  console.log('Making direct API call to:', endpoint);
  return fetchDirect(endpoint, options);
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// For making direct fetch calls without the proxy wrapper
export const directFetch = (endpoint, options = {}) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
};