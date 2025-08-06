import apiClient from './axios';

export default {
  getStatistics(params = {}) {
    return apiClient.get('/api/statistics', { params });
  },

  // Helper methods for specific time periods
  getDailyStatistics() {
    return this.getStatistics({ period: 'day' });
  },

  getMonthlyStatistics() {
    return this.getStatistics({ period: 'month' });
  },

  getQuarterlyStatistics() {
    return this.getStatistics({ period: 'quarter' });
  },

  getYearlyStatistics() {
    return this.getStatistics({ period: 'year' });
  },

  getCustomStatistics(startDate, endDate) {
    return this.getStatistics({
      period: 'custom',
      start_date: startDate,
      end_date: endDate
    });
  }
};
