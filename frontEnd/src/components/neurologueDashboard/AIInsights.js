import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import aiService from '../../services/aiService';
import { styles } from './styles';

const AIInsights = ({ patients, onPatientSelect }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientPredictions, setPatientPredictions] = useState([]);

  useEffect(() => {
    loadDashboardInsights();
  }, []);

  const loadDashboardInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.getDashboardInsights();
      setInsights(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async (patientId) => {
    setLoading(true);
    try {
      await aiService.predictSeizureRisk(patientId);
      Alert.alert('Success', 'AI prediction generated successfully');
      loadDashboardInsights();
    } catch (error) {
      Alert.alert('Error', 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const viewPatientPredictions = async (patientId) => {
    setLoading(true);
    try {
      const predictions = await aiService.getPatientPredictions(patientId);
      setPatientPredictions(predictions);
      setSelectedPatient(patientId);
    } catch (error) {
      Alert.alert('Error', 'Failed to load patient predictions');
    } finally {
      setLoading(false);
    }
  };

  const renderInsightCard = (analysis) => {
    const results = aiService.parseAnalysisResults(analysis.results);
    const riskColor = aiService.getRiskColor(results.riskLevel);
    const riskIcon = aiService.getRiskIcon(results.riskLevel);

    return (
      <View key={analysis.analysisId} style={[styles.card, { borderLeftColor: riskColor, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {riskIcon} {analysis.patient?.name || 'Unknown Patient'}
          </Text>
          <Text style={[styles.riskBadge, { backgroundColor: riskColor }]}>
            {results.riskLevel} RISK
          </Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(analysis.confidenceScore * 100)}%
          </Text>
          <Text style={styles.dateText}>
            Generated: {new Date(analysis.createdAt).toLocaleDateString()}
          </Text>
          
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            <Text style={styles.recommendationsText}>
              {analysis.recommendations}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => viewPatientPredictions(analysis.patient?.patientId)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPatientSelector = () => (
    <View style={styles.patientSelector}>
      <Text style={styles.sectionTitle}>Generate New Prediction</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {patients.map(patient => (
          <TouchableOpacity
            key={patient.patientId}
            style={styles.patientChip}
            onPress={() => generatePrediction(patient.patientId)}
          >
            <Text style={styles.patientChipText}>{patient.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPredictionHistory = () => {
    if (!selectedPatient || patientPredictions.length === 0) return null;

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Prediction History</Text>
        {patientPredictions.map(prediction => {
          const results = aiService.parseAnalysisResults(prediction.results);
          return (
            <View key={prediction.analysisId} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>
                  {new Date(prediction.createdAt).toLocaleDateString()}
                </Text>
                <Text style={[styles.historyRisk, { color: aiService.getRiskColor(results.riskLevel) }]}>
                  {results.riskLevel}
                </Text>
              </View>
              <Text style={styles.historyScore}>
                Risk Score: {Math.round(prediction.confidenceScore * 100)}%
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 AI Seizure Risk Insights</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadDashboardInsights}
          disabled={loading}
        >
          <Text style={styles.refreshText}>
            {loading ? 'Loading...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderPatientSelector()}

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Recent High-Risk Predictions</Text>
        {insights.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent high-risk predictions</Text>
            <Text style={styles.emptySubtext}>Generate predictions for your patients to see AI insights</Text>
          </View>
        ) : (
          insights.map(renderInsightCard)
        )}
      </View>

      {renderPredictionHistory()}
    </ScrollView>
  );
};

export default AIInsights;