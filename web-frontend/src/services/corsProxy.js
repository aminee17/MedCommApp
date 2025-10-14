// src/services/corsProxy.js
import { API_BASE_URL } from '../utils/constants';

// For direct API calls
export const fetchDirect = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Call:', url);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response;
};

// Backward compatibility
export const fetchWithProxy = async (endpoint, options = {}) => {
  console.log('Making API call to:', `${API_BASE_URL}${endpoint}`);
  return fetchDirect(endpoint, options);
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Direct fetch
export const directFetch = (endpoint, options = {}) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
};