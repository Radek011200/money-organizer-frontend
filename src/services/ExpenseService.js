import apiClient from './axios';

export default {
  getExpenses() {
    return apiClient.get('/api/expenses');
  },
  getExpense(id) {
    return apiClient.get(`/api/expenses/${id}`);
  },
  createExpense(expense) {
    return apiClient.post('/api/expenses', expense);
  },
  updateExpense(id, expense) {
    return apiClient.put(`/api/expenses/${id}`, expense);
  },
  deleteExpense(id) {
    return apiClient.delete(`/api/expenses/${id}`);
  }
};
