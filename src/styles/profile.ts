import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  phone: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  balanceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceInfo: {
    marginLeft: 12,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#666',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 2,
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A2E',
    marginLeft: 12,
  },
});
