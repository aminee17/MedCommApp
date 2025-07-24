import { renderHook, act } from '@testing-library/react-hooks';
import useMedecinAuth from '../useMedecinAuth';

// Mock fetch globally
global.fetch = jest.fn();

describe('useMedecinAuth', () => {
    const mockNavigation = {
        navigate: jest.fn(),
    };

    beforeEach(() => {
        fetch.mockClear();
        mockNavigation.navigate.mockClear();
        global.alert = jest.fn();
    });

    it('should initialize with empty email and password', () => {
        const { result } = renderHook(() => useMedecinAuth(mockNavigation));
        
        expect(result.current.email).toBe('');
        expect(result.current.password).toBe('');
        expect(result.current.loading).toBe(false);
    });

    it('should update email and password when setters are called', () => {
        const { result } = renderHook(() => useMedecinAuth(mockNavigation));
        
        act(() => {
            result.current.setEmail('test@example.com');
            result.current.setPassword('password123');
        });

        expect(result.current.email).toBe('test@example.com');
        expect(result.current.password).toBe('password123');
    });

    it('should handle successful login', async () => {
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'fake-token' })
            })
        );

        const { result } = renderHook(() => useMedecinAuth(mockNavigation));
        
        act(() => {
            result.current.setEmail('test@example.com');
            result.current.setPassword('password123');
        });

        await act(async () => {
            await result.current.handleLogin();
        });

        expect(mockNavigation.navigate).toHaveBeenCalledWith('DoctorDashboard');
        expect(global.alert).toHaveBeenCalledWith('Connexion réussie');
    });

    it('should handle login failure', async () => {
        const errorMessage = 'Invalid credentials';
        fetch.mockImplementationOnce(() => 
            Promise.reject(new Error(errorMessage))
        );

        const { result } = renderHook(() => useMedecinAuth(mockNavigation));
        
        await act(async () => {
            await result.current.handleLogin();
        });

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith(errorMessage);
    });
});