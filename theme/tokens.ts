import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const fontFamilies = {
  regular: 'Urbanist_400Regular',
  medium: 'Urbanist_500Medium',
  semibold: 'Urbanist_600SemiBold',
  bold: 'Urbanist_700Bold',
  extrabold: 'Urbanist_800ExtraBold',
};

type ThemePalette = {
  background: string;
  card: string;
  cardMuted: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textSoft: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryMuted: string;
  primaryDark: string;
  secondary: string;
  warning: string;
  success: string;
  danger: string;
  overlay: string;
  shadow: string;
  skeleton: string;
};

export type AppTheme = {
  dark: boolean;
  colors: ThemePalette;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: {
    caption: number;
    body: number;
    bodyLg: number;
    title: number;
    heading: number;
    display: number;
  };
  shadow: {
    card: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
    soft: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
  };
  navigationTheme: Theme;
};

const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

const typography = {
  caption: 12,
  body: 15,
  bodyLg: 17,
  title: 22,
  heading: 28,
  display: 36,
};

const lightColors = {
  background: '#FFF9F4',
  card: '#FFFFFF',
  cardMuted: '#FFF1E6',
  surface: '#FDF4EC',
  surfaceMuted: '#F6ECE4',
  text: '#171313',
  textMuted: '#7F746B',
  textSoft: '#A1958D',
  border: '#F1E3D7',
  borderStrong: '#E6D2C1',
  primary: '#FF6B2C',
  primaryMuted: '#FFF0E8',
  primaryDark: '#E75A1D',
  secondary: '#1C1C20',
  warning: '#FFBF47',
  success: '#3AB66B',
  danger: '#F35B5B',
  overlay: 'rgba(17, 15, 15, 0.48)',
  shadow: '#2E2014',
  skeleton: '#F1E5DA',
};

const darkColors = {
  background: '#121214',
  card: '#1B1B1F',
  cardMuted: '#242429',
  surface: '#17171A',
  surfaceMuted: '#222227',
  text: '#FAF8F6',
  textMuted: '#B4ACA4',
  textSoft: '#8B837D',
  border: '#2A2A31',
  borderStrong: '#383842',
  primary: '#FF6B2C',
  primaryMuted: '#2F211A',
  primaryDark: '#FF7F45',
  secondary: '#F6F2ED',
  warning: '#FFBF47',
  success: '#42C87B',
  danger: '#FF7373',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  skeleton: '#26262D',
};

function createNavigationTheme(baseTheme: Theme, colors: typeof lightColors) {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };
}

export function getAppTheme(mode: 'light' | 'dark'): AppTheme {
  const colors = mode === 'dark' ? darkColors : lightColors;

  return {
    dark: mode === 'dark',
    colors,
    spacing,
    radii,
    typography,
    shadow: {
      card: {
        shadowColor: colors.shadow,
        shadowOpacity: mode === 'dark' ? 0.28 : 0.14,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      },
      soft: {
        shadowColor: colors.shadow,
        shadowOpacity: mode === 'dark' ? 0.18 : 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      },
    },
    navigationTheme: createNavigationTheme(
      mode === 'dark' ? DarkTheme : DefaultTheme,
      colors
    ),
  };
}
