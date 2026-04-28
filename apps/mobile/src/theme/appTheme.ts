import { MD3LightTheme } from 'react-native-paper';

import { colors } from './colors';
import { fonts } from './fonts';

export const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: fonts.bold,
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: fonts.bold,
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: fonts.bold,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: fonts.bold,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: fonts.bold,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: fonts.bold,
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: fonts.semibold,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: fonts.semibold,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: fonts.semibold,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: fonts.regular,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: fonts.regular,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: fonts.regular,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: fonts.medium,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: fonts.medium,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: fonts.medium,
    },
  },
};
