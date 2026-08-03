import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  promoSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 15,
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  promoButton: {
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
