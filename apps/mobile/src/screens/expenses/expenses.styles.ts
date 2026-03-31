import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#122033',
  },
  card: {
    backgroundColor: '#f5f7fb',
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#122033',
  },
  meta: {
    fontSize: 14,
    color: '#526077',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a7d35',
  },
});

export default styles;
