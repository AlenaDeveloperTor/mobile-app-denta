import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A1A2E',
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
