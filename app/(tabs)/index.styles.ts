import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#F5F7FA',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginTop: 2,
  },
  profileIcon: {
    padding: 4,
  },
  servicesSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 30,
  },
});
