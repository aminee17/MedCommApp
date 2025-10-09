import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import aiService from '../../services/aiService';
import { styles } from './styles';

const AIInsights = ({ patients, onPatientSelect }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientPredictions, setPatientPredictions] = useState([]);

  const translateRiskLevel = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH': return 'ÉLEVÉ';
      case 'MEDIUM': return 'MODÉRÉ';
      case 'LOW': return 'FAIBLE';
      default: return 'INCONNU';
    }
  };

  useEffect(() => {
    loadDashboardInsights();
  }, []);

  const loadDashboardInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.getDashboardInsights();
      setInsights(data);
    } catch (error) {
      Alert.alert('Erreur', 'Échec du chargement des analyses IA');
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async (patientId) => {
    console.log('Patient ID received:', patientId);
    if (!patientId || patientId === 'undefined' || patientId === undefined) {
      Alert.alert('Erreur', 'ID patient invalide');
      return;
    }
    setLoading(true);
    try {
      await aiService.predictSeizureRisk(patientId);
      Alert.alert('Succès', 'Prédiction IA générée avec succès');
      loadDashboardInsights();
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la génération de prédiction');
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
      Alert.alert('Erreur', 'Échec du chargement des prédictions patient');
    } finally {
      setLoading(false);
    }
  };

  const renderInsightCard = (analysis, index) => {
    const results = aiService.parseAnalysisResults(analysis.results);
    const riskColor = aiService.getRiskColor(results.riskLevel);
    const riskIcon = aiService.getRiskIcon(results.riskLevel);

    return (
      <View key={analysis.analysisId || `insight-${index}`} style={[styles.card, { borderLeftColor: riskColor, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {riskIcon} {analysis.patient?.name || 'Patient Inconnu'}
          </Text>
          <Text style={[styles.riskBadge, { backgroundColor: riskColor }]}>
            RISQUE {translateRiskLevel(results.riskLevel)}
          </Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.confidenceText}>
            Confiance: {Math.round(analysis.confidenceScore * 100)}%
          </Text>
          <Text style={styles.dateText}>
            Généré le: {new Date(analysis.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommandations:</Text>
            <Text style={styles.recommendationsText}>
              {analysis.recommendations}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => viewPatientPredictions(analysis.patient?.patientId)}
        >
          <Text style={styles.viewDetailsText}>Voir Détails</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPatientSelector = () => (
    <View style={styles.patientSelector}>
      <Text style={styles.sectionTitle}>Générer Nouvelle Prédiction</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {patients.map((patient, index) => {
          console.log('Patient object:', patient);
          const patientId = patient.patientId || patient.formId;
          return (
            <TouchableOpacity
              key={patientId || `patient-${index}`}
              style={styles.patientChip}
              onPress={() => generatePrediction(patientId)}
            >
              <Text style={styles.patientChipText}>{patient.fullName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderPredictionHistory = () => {
    if (!selectedPatient || patientPredictions.length === 0) return null;

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Historique des Prédictions</Text>
        {patientPredictions.map(prediction => {
          const results = aiService.parseAnalysisResults(prediction.results);
          return (
            <View key={prediction.analysisId} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>
                  {new Date(prediction.createdAt).toLocaleDateString('fr-FR')}
                </Text>
                <Text style={[styles.historyRisk, { color: aiService.getRiskColor(results.riskLevel) }]}>
                  {translateRiskLevel(results.riskLevel)}
                </Text>
              </View>
              <Text style={styles.historyScore}>
                Score de Risque: {Math.round(prediction.confidenceScore * 100)}%
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
        <Text style={styles.title}>🧠 Analyses IA du Risque de Crise</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadDashboardInsights}
          disabled={loading}
        >
          <Text style={styles.refreshText}>
            {loading ? 'Chargement...' : 'Actualiser'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderPatientSelector()}

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Prédictions Récentes à Haut Risque</Text>
        {insights.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune prédiction récente à haut risque</Text>
            <Text style={styles.emptySubtext}>Générez des prédictions pour vos patients pour voir les analyses IA</Text>
          </View>
        ) : (
          insights.map((insight, index) => renderInsightCard(insight, index))
        )}
      </View>

      {renderPredictionHistory()}
    </ScrollView>
  );
};

export default AIInsights;