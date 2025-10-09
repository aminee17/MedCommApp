export const validateVideoData = (videoData) => {
    if (!videoData) return null;
    
    // Ensure we're using the correct property name
    if (videoData.uri) {
        return videoData.uri;
    }
    
    // If the video data is just a string URI
    if (typeof videoData === 'string') {
        return videoData;
    }
    
    return null;
};

export const processVideoResult = (result) => {
    if (!result || result.canceled) {
        return null;
    }

    if (result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
    }

    return null;
};