import { defineStore } from 'pinia';
import CategoryService from '@/services/CategoryService';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    category: null,
    loading: false,
    error: null
  }),
  getters: {
    getCategoryById: (state) => (id) => {
      return state.categories.find(category => category.id === parseInt(id));
    },
    getMainCategories: (state) => {
      return state.categories.filter(category => category.isMain);
    },
    getSubCategories: (state) => (parentId) => {
      return state.categories.filter(category => category.parent_id === parseInt(parentId));
    },
    getIncomeCategories: (state) => {
      return state.categories.filter(category => category.is_income);
    },
    getExpenseCategories: (state) => {
      return state.categories.filter(category => !category.is_income);
    },
    getMainIncomeCategories: (state) => {
      return state.categories.filter(category => category.isMain && category.is_income);
    },
    getMainExpenseCategories: (state) => {
      return state.categories.filter(category => category.isMain && !category.is_income);
    }
  },
  actions: {
    async fetchCategories(type = null) {
      this.loading = true;
      try {
        const response = await CategoryService.getCategories(type);
        this.categories = response.data.categories;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Nie udało się pobrać kategorii';
        console.error('Błąd podczas pobierania kategorii:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchIncomeCategories() {
      this.loading = true;
      try {
        const response = await CategoryService.getIncomeCategories();
        this.categories = response.data.categories;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Nie udało się pobrać kategorii przychodów';
        console.error('Błąd podczas pobierania kategorii przychodów:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchExpenseCategories() {
      this.loading = true;
      try {
        const response = await CategoryService.getExpenseCategories();
        this.categories = response.data.categories;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Nie udało się pobrać kategorii wydatków';
        console.error('Błąd podczas pobierania kategorii wydatków:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategory(id) {
      this.loading = true;
      try {
        const response = await CategoryService.getCategory(id);
        this.category = response.data.category;
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się pobrać kategorii o ID ${id}`;
        console.error(`Błąd podczas pobierania kategorii o ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    async createCategory(category) {
      this.loading = true;
      try {
        const response = await CategoryService.createCategory(category);
        this.categories.push(response.data.category);
        this.error = null;
        return response.data.category;
      } catch (error) {
        this.error = error.message || 'Nie udało się utworzyć kategorii';
        console.error('Błąd podczas tworzenia kategorii:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCategory(id, category) {
      this.loading = true;
      try {
        const response = await CategoryService.updateCategory(id, category);
        const index = this.categories.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          this.categories[index] = response.data.category;
        }
        this.error = null;
        return response.data.category;
      } catch (error) {
        this.error = error.message || `Nie udało się zaktualizować kategorii o ID ${id}`;
        console.error(`Błąd podczas aktualizacji kategorii o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteCategory(id) {
      this.loading = true;
      try {
        await CategoryService.deleteCategory(id);
        this.categories = this.categories.filter(c => c.id !== parseInt(id));
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się usunąć kategorii o ID ${id}`;
        console.error(`Błąd podczas usuwania kategorii o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
