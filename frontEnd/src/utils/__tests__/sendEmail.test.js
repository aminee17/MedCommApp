import { sendDoctorCredentials } from '../sendEmail';

// Mock fetch globally
global.fetch = jest.fn();

describe('sendDoctorCredentials', () => {
    beforeEach(() => {
        // Clear mock before each test
        fetch.mockClear();
    });

    it('should successfully send email and return response', async () => {
        const mockResponse = { status: 200, ok: true };
        fetch.mockResolvedValueOnce(mockResponse);

        const result = await sendDoctorCredentials({
            toEmail: 'doctor@example.com',
            name: 'Dr. Smith',
            password: 'password123'
        });

        expect(result).toEqual({
            success: true,
            status: 200
        });
    });

    it('should handle API errors properly', async () => {
        const errorMessage = 'API Error';
        const mockResponse = { 
            status: 400, 
            ok: false, 
            text: jest.fn().mockResolvedValue(errorMessage)
        };
        fetch.mockResolvedValueOnce(mockResponse);

        await expect(sendDoctorCredentials({
            toEmail: 'doctor@example.com',
            name: 'Dr. Smith',
            password: 'password123'
        })).rejects.toThrow(`Email sending failed: ${errorMessage}`);
    });

    it('should handle network errors', async () => {
        const networkError = new Error('Network error');
        fetch.mockRejectedValueOnce(networkError);

        await expect(sendDoctorCredentials({
            toEmail: 'doctor@example.com',
            name: 'Dr. Smith',
            password: 'password123'
        })).rejects.toThrow('Network error');
    });
});