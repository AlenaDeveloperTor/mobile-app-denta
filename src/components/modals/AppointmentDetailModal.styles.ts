import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(23, 41, 51, 0.6)',
		padding: 20,
	},
	modalContent: {
		width: '100%',
		maxWidth: 420,
		maxHeight: '90%',
		backgroundColor: COLORS.white,
		borderRadius: RADIUS.card,
		padding: 24,
		...SHADOW.medium,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	closeButton: { padding: 4 },
	title: {
		fontSize: 22,
		fontFamily: FONT.medium,
		color: COLORS.dark,
	},
	serviceName: {
		fontSize: 18,
		fontFamily: FONT.medium,
		color: COLORS.dark,
		marginBottom: 20,
	},
	infoBlock: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#DCE3EA',
		paddingVertical: 12,
	},
	label: {
		fontSize: 12,
		fontFamily: FONT.medium,
		color: COLORS.textSecondary,
		marginBottom: 5,
	},
	value: {
		fontSize: 15,
		fontFamily: FONT.regular,
		color: COLORS.dark,
	},
	notFound: {
		fontSize: 16,
		fontFamily: FONT.regular,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginBottom: 20,
	},
});
