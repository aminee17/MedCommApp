import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.s,
        backgroundColor: COLORS.lightGrey,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: SPACING.s,
        marginBottom: SPACING.m,
    },
    logoutButton: {
        backgroundColor: COLORS.danger,
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 6,
        alignSelf: 'flex-end',
        ...SHADOWS.small,
    },
    logoutText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
    title: {
        fontSize: width > 360 ? SIZES.xlarge : SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
        flexShrink: 1,
    },
    subtitle: {
        fontSize: SIZES.medium,
        marginBottom: SPACING.m,
        textAlign: 'center',
        color: COLORS.grey,
    },
    loading: {
        textAlign: 'center',
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
    },
    noData: {
        textAlign: 'center',
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.grey,
    },
    list: {
        paddingBottom: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.light,
        borderRadius: 8,
        padding: SPACING.m,
        marginVertical: SPACING.s,
        ...SHADOWS.medium,
    },
    name: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
        color: COLORS.dark,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.m,
        alignItems: 'center',
    },
    button: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 4,
        flex: 1,
        marginHorizontal: SPACING.xs,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: COLORS.secondary,
    },
    rejectButton: {
        backgroundColor: COLORS.danger,
    },
    buttonText: {
        color: COLORS.light,
        fontWeight: 'bold',
    },
});

export default styles;