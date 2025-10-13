// src/hooks/useLocations.js
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/constants';
import { getApiUrl, fetchWithProxy } from '../services/corsProxy';
export default function useLocations() {
    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);
    const FALLBACK_GOVERNORATES = [
        { id: 1, name: 'Tunis' },
        { id: 2, name: 'Ariana' },
        { id: 3, name: 'Ben Arous' },
        { id: 4, name: 'Manouba' }
    ];
    const FALLBACK_CITIES_BY_GOV = {
        1: [ { id: 101, name: 'Tunis Centre' }, { id: 102, name: 'La Marsa' } ],
        2: [ { id: 201, name: 'Ariana Ville' }, { id: 202, name: 'Raoued' } ],
        3: [ { id: 301, name: 'Ben Arous Ville' }, { id: 302, name: 'Ezzahra' } ],
        4: [ { id: 401, name: 'Manouba Ville' }, { id: 402, name: 'Oued Ellil' } ]
    };

    useEffect(() => {
        fetchGovernorates();
    }, []);

    const fetchGovernorates = async () => {
        try {
            const response = await fetchWithProxy('/api/locations/governorates', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to load governorates: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setGovernorates(data);
            } else {
                console.warn('Governorates API returned empty list. Using fallback data.');
                setGovernorates(FALLBACK_GOVERNORATES);
            }
        } catch (error) {
            console.error('Error fetching governorates:', error);
            // Fallback to built-in list so UI remains usable
            setGovernorates(FALLBACK_GOVERNORATES);
        }
    };

    const fetchCities = async (governorateId) => {
        try {
            const response = await fetchWithProxy(`/api/locations/cities/${governorateId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to load cities: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setCities(data);
            } else {
                console.warn('Cities API returned empty list. Using fallback data.');
                setCities(FALLBACK_CITIES_BY_GOV[governorateId] || []);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            // Fallback to built-in list for the selected governorate
            setCities(FALLBACK_CITIES_BY_GOV[governorateId] || []);
        }
    };

    return { governorates, cities, fetchCities };
}