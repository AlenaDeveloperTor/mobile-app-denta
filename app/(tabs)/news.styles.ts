import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
