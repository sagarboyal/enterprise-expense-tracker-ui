import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#122033',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#526077',
  },
  button: {
    backgroundColor: '#155eef',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
