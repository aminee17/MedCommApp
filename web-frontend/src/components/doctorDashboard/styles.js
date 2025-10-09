import { StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    header: {
        padding: SPACING.m,
        backgroundColor: COLORS.primary,
        paddingBottom: SPACING.l,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        color: COLORS.light,
        marginBottom: SPACING.s,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: SPACING.s,
    },
    newFormButton: {
        backgroundColor: COLORS.light,
        padding: SPACING.s,
        borderRadius: 5,
        flex: 1,
        marginRight: SPACING.s,
        alignItems: 'center',
    },
    newFormButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.s,
        backgroundColor: COLORS.light,
        ...SHADOWS.small,
    },
    filterButton: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.s,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 2,
        alignItems: 'center',
    },
    activeFilterButton: {
        backgroundColor: COLORS.primary,
    },
    filterButtonText: {
        fontSize: SIZES.small,
        color: COLORS.dark,
    },
    activeFilterButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    emptyText: {
        fontSize: SIZES.medium,
        color: COLORS.grey,
        textAlign: 'center',
    },
    formList: {
        padding: SPACING.s,
    },
    formCard: {
        backgroundColor: COLORS.light,
        padding: SPACING.m,
        marginVertical: SPACING.xs,
        borderRadius: 10,
        ...SHADOWS.medium,
    },
    patientName: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    formDate: {
        color: COLORS.grey,
    },
    formStatus: {
        color: COLORS.primary,
        marginTop: SPACING.xs,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.light,
        padding: SPACING.m,
        borderRadius: 10,
        width: 350,
        maxHeight: 600,
        alignSelf: 'center',
        ...SHADOWS.large,
    },
    modalTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginBottom: SPACING.m,
    },
    modalField: {
        fontSize: SIZES.medium,
        marginBottom: SPACING.s,
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.s,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: SPACING.m,
    },
    closeButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
    },
    // Action buttons
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.s,
        paddingTop: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.s,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: SPACING.xs,
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: COLORS.secondary,
    },
    chatIconContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    unreadBadgeText: {
        color: COLORS.light,
        fontSize: 10,
        fontWeight: 'bold',
    },
    actionButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.small,
    },
});

export default styles;