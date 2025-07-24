import { submitMedicalForm } from '../medicalFormService';
import { API_BASE_URL } from '../../utils/constants';

// Mock fetch globally
global.fetch = jest.fn();

describe('medicalFormService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        // Reset fetch mock
        global.fetch.mockReset();
    });

    const mockFormData = {
        fullName: 'Test User',
        birthDate: '2000-01-01',
        gender: 'MALE',
        cinNumber: '12345',
        address: 'Test Address',
        phoneNumber: '1234567890',
        firstSeizureDate: '2023-01-01',
        lastSeizureDate: '2023-12-31',
        isFirstSeizure: false,
        seizureOccurrence: 'quotidienne',
        seizureDuration: '30',
        seizureFrequency: '5',
        hasAura: true,
        auraDescription: 'Test aura',
        seizureTypes: ['TYPE_1', 'TYPE_2'],
        lossOfConsciousness: true,
        bodyStiffening: true,
        jerkingMovements: true,
        eyeDeviation: false,
        incontinence: false,
        tongueBiting: true,
        tongueBitingLocation: 'left',
        otherInformation: 'Additional info'
    };

    it('should successfully submit form data', async () => {
        const mockResponse = { id: 1, status: 'SUCCESS' };
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
                status: 200,
                statusText: 'OK'
            })
        );

        const result = await submitMedicalForm(mockFormData);

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/api/medical-forms/submit`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Accept': 'application/json'
                })
            })
        );
    });

    it('should retry on network failure', async () => {
        // First two calls fail, third succeeds
        global.fetch
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ id: 1, status: 'SUCCESS' }),
                    status: 200,
                    statusText: 'OK'
                })
            );

        const result = await submitMedicalForm(mockFormData);

        expect(result).toEqual({ id: 1, status: 'SUCCESS' });
        expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout errors', async () => {
        jest.useFakeTimers();
        global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

        const submitPromise = submitMedicalForm(mockFormData);
        jest.advanceTimersByTime(31000); // Advance past the 30s timeout

        await expect(submitPromise).rejects.toThrow('Request timed out');
        jest.useRealTimers();
    });

    it('should handle server errors with proper messages', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: () => Promise.resolve({ message: 'Server error occurred' })
            })
        );

        await expect(submitMedicalForm(mockFormData)).rejects.toThrow('Server error occurred');
    });

    it('should handle file uploads correctly', async () => {
        const mockFormDataWithFiles = {
            ...mockFormData,
            seizureVideo: new File([''], 'test.mp4', { type: 'video/mp4' }),
            mriPhoto: new File([''], 'test.jpg', { type: 'image/jpeg' })
        };

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, status: 'SUCCESS' }),
                status: 200,
                statusText: 'OK'
            })
        );

        await submitMedicalForm(mockFormDataWithFiles);

        expect(fetch).toHaveBeenCalledTimes(1);
        const [, options] = fetch.mock.calls[0];
        expect(options.body instanceof FormData).toBeTruthy();
    });
});