import { API_BASE_URL } from '../utils/constants';

class AIService {
  async predictSeizureRisk(patientId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/predict-seizure-risk/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ patientId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting seizure risk:', error);
      throw error;
    }
  }

  async getPatientPredictions(patientId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/patient-predictions/${patientId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient predictions:', error);
      throw error;
    }
  }

  async getDashboardInsights() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/dashboard-insights`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard insights:', error);
      throw error;
    }
  }

  parseAnalysisResults(resultsJson) {
    try {
      return JSON.parse(resultsJson);
    } catch (error) {
      console.error('Error parsing analysis results:', error);
      return {};
    }
  }

  getRiskColor(riskLevel) {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH': return '#FF4444';
      case 'MEDIUM': return '#FFA500';
      case 'LOW': return '#4CAF50';
      default: return '#999999';
    }
  }

  getRiskIcon(riskLevel) {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH': return '⚠️';
      case 'MEDIUM': return '⚡';
      case 'LOW': return '✅';
      default: return '❓';
    }
  }
}

export default new AIService();