import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  heading: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
  },
  cardBody: {
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.semibold,
    fontWeight: '600',
  },
  meta: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  amount: {
    color: colors.secondary,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
});

export default styles;
