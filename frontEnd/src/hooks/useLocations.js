// src/hooks/useLocations.js
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/constants';

export default function useLocations() {
    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchGovernorates();
    }, []);

    const fetchGovernorates = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/governorates`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include credentials for session cookies
            });
            const data = await response.json();
            setGovernorates(data);
        } catch (error) {
            console.error('Error fetching governorates:', error);
        }
    };

    const fetchCities = async (governorateId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/cities/${governorateId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include credentials for session cookies
            });
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    return { governorates, cities, fetchCities };
}