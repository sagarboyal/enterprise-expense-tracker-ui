import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 24,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 14,
  },
  buttonContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontFamily: fonts.medium,
  },
});

export default styles;
