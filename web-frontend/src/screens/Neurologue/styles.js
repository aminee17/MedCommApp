import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        paddingBottom: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    welcomeText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginTop: 5,
    },
    newFormButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    newFormButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 10,
    },
    formList: {
        padding: 10,
    },
    formCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    formDate: {
        color: '#666',
    },
    formStatus: {
        color: '#007AFF',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 350,
        maxHeight:  600,
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalField: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Add these to your styles
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: '#34C759',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    // New styles for form card with chat
    formCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formInfo: {
        flex: 1,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    patientInfo: {
        fontSize: 14,
        color: '#666',
    },
    chatButtonSmall: {
        backgroundColor: '#34C759',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        height: 40,
    },
    chatIconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadBadgeSmall: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    unreadBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // AI Insights Styles
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    refreshText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    patientSelector: {
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    patientChip: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    patientChipText: {
        color: '#1976D2',
        fontWeight: '500',
    },
    insightsContainer: {
        paddingHorizontal: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    cardContent: {
        marginBottom: 10,
    },
    confidenceText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    recommendationsContainer: {
        backgroundColor: '#F8F9FA',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    recommendationsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    recommendationsText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },
    viewDetailsButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    viewDetailsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    historyContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#E0E0E0',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    historyDate: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    historyRisk: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    historyScore: {
        fontSize: 12,
        color: '#666',
    },
});
export default styles;