export const COLORS = {
  primary: '#2B5364', // Slate blue from the spine dots
  secondary: '#F0F6F6', // Light teal/grey background
  accent: '#3CA59D', // Teal from the swoosh
  error: '#FF5252',
  textPrimary: '#1A1C1E',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  border: '#E0E4E8',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  base: 10,
  font: 14,
  radius: 12,
  padding: 24,
  h1: 32,
  h2: 24,
  h3: 18,
  body: 16,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};
