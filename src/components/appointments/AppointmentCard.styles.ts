import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF4E5',
  },
  statusConfirmed: {
    backgroundColor: '#E8F4FF',
  },
  statusCancelled: {
    backgroundColor: '#FFEBEE',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  body: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  comment: {
    fontSize: 13,
    color: '#666',
  },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFEBEE',
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
  },
});
