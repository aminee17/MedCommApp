export const COLORS = {
    // Primary medical blues
    primary: '#0F5CA8',       // Cobalt blue
    primaryDark: '#0B2E4F',   // Navy
    primaryLight: '#3B8CD9',  // Sky blue
    iceBlue: '#E6F2FB',       // Ice blue / backgrounds

    // Accents and states
    teal: '#16A6A1',
    success: '#27AE60',
    warning: '#F39C12',
    danger: '#E65C5C',

    // Neutrals
    dark: '#233F62',
    grey: '#7F8C8D',
    lightGrey: '#F4F7FA',
    border: '#C8D9EC',
    light: '#FFFFFF',
    background: '#F9FBFE',
    surface: '#FFFFFF',

    // Text
    textPrimary: '#233F62',
    textSecondary: '#5B6E84',
    textInverse: '#FFFFFF',
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
};

export const SIZES = {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 20,
    xxlarge: 24,
    display: 32,
};

export const SHADOWS = {
    small: {
        shadowColor: '#0F5CA8',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#0F5CA8',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#0F5CA8',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
};

export const BORDER_RADIUS = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
};

// Gradient tokens for consistent usage
export const GRADIENTS = {
    auth: ['#0F5CA8', '#E6F2FB'],           // Blue → Ice
    header: ['#0B2E4F', '#0F5CA8'],         // Navy → Cobalt
    hero: ['#3B8CD9', '#FFFFFF'],           // Sky → White
    panel: ['#E6F2FB', '#FFFFFF'],          // Subtle ice → white
};