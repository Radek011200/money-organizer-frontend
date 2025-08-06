import { defineStore } from 'pinia';
import ExpenseService from '@/services/ExpenseService';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    expense: null,
    loading: false,
    error: null
  }),
  getters: {
    getExpenseById: (state) => (id) => {
      return state.expenses.find(expense => expense.id === parseInt(id));
    }
  },
  actions: {
    async fetchExpenses() {
      this.loading = true;
      try {
        const response = await ExpenseService.getExpenses();
        this.expenses = response.data.expenses;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Nie udało się pobrać wydatków';
        console.error('Błąd podczas pobierania wydatków:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchExpense(id) {
      this.loading = true;
      try {
        const response = await ExpenseService.getExpense(id);
        this.expense = response.data.expense;
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się pobrać wydatku o ID ${id}`;
        console.error(`Błąd podczas pobierania wydatku o ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    async createExpense(expense) {
      this.loading = true;
      try {
        const response = await ExpenseService.createExpense(expense);
        this.expenses.push(response.data.expense);
        this.error = null;
        return response.data.expense;
      } catch (error) {
        this.error = error.message || 'Nie udało się utworzyć wydatku';
        console.error('Błąd podczas tworzenia wydatku:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateExpense(id, expense) {
      this.loading = true;
      try {
        const response = await ExpenseService.updateExpense(id, expense);
        const index = this.expenses.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
          this.expenses[index] = response.data.expense;
        }
        this.error = null;
        return response.data.expense;
      } catch (error) {
        this.error = error.message || `Nie udało się zaktualizować wydatku o ID ${id}`;
        console.error(`Błąd podczas aktualizacji wydatku o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteExpense(id) {
      this.loading = true;
      try {
        await ExpenseService.deleteExpense(id);
        this.expenses = this.expenses.filter(e => e.id !== parseInt(id));
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się usunąć wydatku o ID ${id}`;
        console.error(`Błąd podczas usuwania wydatku o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
