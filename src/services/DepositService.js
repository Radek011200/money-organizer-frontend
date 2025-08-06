import apiClient from './axios';

export default {
  getDeposits() {
    return apiClient.get('/api/deposits');
  },
  getDeposit(id) {
    return apiClient.get(`/api/deposits/${id}`);
  },
  createDeposit(deposit) {
    return apiClient.post('/api/deposits', deposit);
  },
  updateDeposit(id, deposit) {
    return apiClient.put(`/api/deposits/${id}`, deposit);
  },
  deleteDeposit(id) {
    return apiClient.delete(`/api/deposits/${id}`);
  }
};
