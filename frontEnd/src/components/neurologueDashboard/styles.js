// styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F7F9FC',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E1E1E',
    },
    refreshButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    refreshText: {
        color: 'white',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 12,
        color: '#333',
    },
    patientSelector: {
        marginBottom: 16,
    },
    patientChip: {
        backgroundColor: '#E0F7FA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
    },
    patientChipText: {
        color: '#00796B',
        fontWeight: '500',
    },
    insightsContainer: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    riskBadge: {
        color: 'white',
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
    },
    cardContent: {
        marginTop: 8,
    },
    confidenceText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 13,
        color: '#777',
        marginBottom: 8,
    },
    recommendationsContainer: {
        marginTop: 8,
    },
    recommendationsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#444',
    },
    recommendationsText: {
        fontSize: 13,
        color: '#666',
    },
    viewDetailsButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#F1F3F5',
        borderRadius: 6,
    },
    viewDetailsText: {
        color: '#007AFF',
        fontWeight: '500',
    },
    historyContainer: {
        marginTop: 24,
        marginBottom: 32,
    },
    historyItem: {
        backgroundColor: '#FAFAFA',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#DDD',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    historyDate: {
        fontSize: 13,
        color: '#555',
    },
    historyRisk: {
        fontSize: 13,
        fontWeight: '600',
    },
    historyScore: {
        fontSize: 13,
        color: '#444',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#777',
        textAlign: 'center',
    },
});
