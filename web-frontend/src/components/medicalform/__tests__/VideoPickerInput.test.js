import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VideoPickerInput from '../VideoPickerInput';
import * as ImagePicker from 'expo-image-picker';
import { validateVideoData, processVideoResult } from '../../../utils/videoHelpers';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    MediaType: {
        Videos: 'Videos'
    },
    launchImageLibraryAsync: jest.fn(),
    requestMediaLibraryPermissionsAsync: jest.fn()
}));

// Mock expo-av
jest.mock('expo-av', () => ({
    Video: 'Video'
}));

// Mock videoHelpers
jest.mock('../../../utils/videoHelpers', () => ({
    validateVideoData: jest.fn(),
    processVideoResult: jest.fn()
}));

describe('VideoPickerInput', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        label: 'Test Video',
        value: null,
        onChange: mockOnChange
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful permission
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
        // Mock successful video processing
        processVideoResult.mockImplementation(result => result?.assets?.[0]?.uri || null);
        validateVideoData.mockImplementation(data => data || null);
    });

    it('renders correctly without a video', () => {
        const { getByText, queryByTestId } = render(
            <VideoPickerInput {...defaultProps} />
        );

        expect(getByText('Test Video')).toBeTruthy();
        expect(getByText('Choisir une vidéo')).toBeTruthy();
        expect(queryByTestId('video-player')).toBeNull();
    });

    it('renders correctly with a video', () => {
        const { getByText, getByTestId } = render(
            <VideoPickerInput {...defaultProps} value="file://video.mp4" />
        );

        expect(getByText('Test Video')).toBeTruthy();
        expect(getByText('Changer la vidéo')).toBeTruthy();
        expect(getByTestId('video-player')).toBeTruthy();
    });

    it('handles successful video selection', async () => {
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 120 // 2 minutes
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('file://test-video.mp4');
        });
    });

    it('handles video selection cancellation', async () => {
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('handles permission denial', async () => {
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('handles video removal', () => {
        const { getByText } = render(
            <VideoPickerInput {...defaultProps} value="file://video.mp4" />
        );

        fireEvent.press(getByText('Supprimer la vidéo'));
        expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('shows loading state while processing video', async () => {
        // Mock a delay in video processing
        ImagePicker.launchImageLibraryAsync.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => 
                resolve({
                    canceled: false,
                    assets: [{
                        uri: 'file://test-video.mp4',
                        duration: 120
                    }]
                }), 100)
            )
        );

        const { getByText, getByTestId } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        // Loading indicator should be visible
        expect(getByTestId('loading-indicator')).toBeTruthy();

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('file://test-video.mp4');
        });
    });

    it('handles video processing error', async () => {
        processVideoResult.mockReturnValue(null);
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 120
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('handles invalid video data', async () => {
        validateVideoData.mockReturnValue(null);
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 120
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('handles video duration in milliseconds correctly', async () => {
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 240000 // 4 minutes in milliseconds
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('file://test-video.mp4');
        });
    });

    it('rejects videos longer than 5 minutes', async () => {
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 360 // 6 minutes in seconds
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    it('rejects videos longer than 5 minutes when duration is in milliseconds', async () => {
        const mockVideo = {
            canceled: false,
            assets: [{
                uri: 'file://test-video.mp4',
                duration: 360000 // 6 minutes in milliseconds
            }]
        };
        ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockVideo);

        const { getByText } = render(<VideoPickerInput {...defaultProps} />);
        
        fireEvent.press(getByText('Choisir une vidéo'));

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
});