import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ImagePickerInput from '../ImagePickerInput';
import * as ImagePicker from 'expo-image-picker';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    MediaType: {
        Images: 'Images'
    },
    launchImageLibraryAsync: jest.fn(),
    requestMediaLibraryPermissionsAsync: jest.fn()
}));

describe('ImagePickerInput', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        label: 'Test Image',
        value: null,
        onChange: mockOnChange
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful permission
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    });

    it('renders correctly without an image', () => {
        const { getByText } = render(
            <ImagePickerInput {...defaultProps} />
        );

        expect(getByText('Test Image')).toBeTruthy();
        expect(getByText('Choisir une image')).toBeTruthy();
    });

    it('renders correctly with an image', () => {
        const { getByText } = render(
            <ImagePickerInput {...defaultProps} value="file://image.jpg" />
        );

        expect(getByText('Test Image')).toBeTruthy();
        expect(getByText("Changer l'image")).toBeTruthy();
    });

    it('handles successful image selection', async () => {
        const mockImage = {
            canceled: false,
            assets: [{
                uri: 'file://test-image.jpg'
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockImage);

        const { getByText } = render(<ImagePickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une image'));

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('file://test-image.jpg');
        });
    });

    it('handles image selection cancellation', async () => {
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });

        const { getByText } = render(<ImagePickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une image'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('handles permission denial', async () => {
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

        const { getByText } = render(<ImagePickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une image'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('shows loading state while processing image', async () => {
        ImagePicker.launchImageLibraryAsync.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => 
                resolve({
                    canceled: false,
                    assets: [{
                        uri: 'file://test-image.jpg'
                    }]
                }), 100)
            )
        );

        const { getByText, getByTestId } = render(<ImagePickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une image'));

        expect(getByTestId('loading-indicator')).toBeTruthy();

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('file://test-image.jpg');
        });
    });

    it('handles file writing error', async () => {
        ImagePicker.launchImageLibraryAsync.mockRejectedValue(
            new Error('Failed to write a file')
        );

        const { getByText, findByText } = render(<ImagePickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une image'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        const errorMessage = await findByText(/Impossible d'enregistrer l'image/);
        expect(errorMessage).toBeTruthy();
    });
});