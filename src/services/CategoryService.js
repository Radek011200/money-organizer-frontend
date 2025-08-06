import apiClient from './axios';

export default {
  getCategories(type = null) {
    if (type) {
      return apiClient.get(`/api/categories?type=${type}`);
    }
    return apiClient.get('/api/categories');
  },
  getIncomeCategories() {
    return apiClient.get('/api/categories/income');
  },
  getExpenseCategories() {
    return apiClient.get('/api/categories/expense');
  },
  getCategory(id) {
    return apiClient.get(`/api/categories/${id}`);
  },
  createCategory(category) {
    return apiClient.post('/api/categories', category);
  },
  updateCategory(id, category) {
    return apiClient.put(`/api/categories/${id}`, category);
  },
  deleteCategory(id) {
    return apiClient.delete(`/api/categories/${id}`);
  }
};
