import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.s,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: SPACING.s,
        marginBottom: SPACING.m,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: COLORS.danger,
        alignSelf: 'flex-end',
        ...SHADOWS.small,
    },
    title: {
        fontSize: width > 360 ? SIZES.xlarge : SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
        flexShrink: 1,
    },
    subtitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        marginBottom: SPACING.xl,
        textAlign: 'center',
        color: COLORS.textSecondary,
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
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.l,
        marginVertical: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.medium,
    },
    name: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
        color: COLORS.textPrimary,
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
        color: COLORS.textInverse,
        fontWeight: 'bold',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    roleBadge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: SPACING.xs,
        borderRadius: 12,
    },
    roleBadgeText: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    infoContainer: {
        marginBottom: SPACING.m,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    infoText: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        marginLeft: SPACING.s,
    },
        // Add to your styles.js for admin dashboard
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#3498DB',
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    noPdfText: {
        color: '#95A5A6',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default styles;