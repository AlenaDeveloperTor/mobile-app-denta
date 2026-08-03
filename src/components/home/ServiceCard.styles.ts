import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 130,
  },
  serviceContent: {
    padding: 14,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  servicePrice: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  servicePriceText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDurationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  bookingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
