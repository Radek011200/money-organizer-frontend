import { defineStore } from 'pinia';
import DepositService from '@/services/DepositService';

export const useDepositStore = defineStore('deposit', {
  state: () => ({
    deposits: [],
    deposit: null,
    loading: false,
    error: null
  }),
  getters: {
    getDepositById: (state) => (id) => {
      return state.deposits.find(deposit => deposit.id === parseInt(id));
    }
  },
  actions: {
    async fetchDeposits() {
      this.loading = true;
      try {
        const response = await DepositService.getDeposits();
        this.deposits = response.data.deposits;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Nie udało się pobrać wpłat';
        console.error('Błąd podczas pobierania wpłat:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchDeposit(id) {
      this.loading = true;
      try {
        const response = await DepositService.getDeposit(id);
        this.deposit = response.data.deposit;
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się pobrać wpłaty o ID ${id}`;
        console.error(`Błąd podczas pobierania wpłaty o ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    async createDeposit(deposit) {
      this.loading = true;
      try {
        const response = await DepositService.createDeposit(deposit);
        this.deposits.push(response.data.deposit);
        this.error = null;
        return response.data.deposit;
      } catch (error) {
        this.error = error.message || 'Nie udało się utworzyć wpłaty';
        console.error('Błąd podczas tworzenia wpłaty:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateDeposit(id, deposit) {
      this.loading = true;
      try {
        const response = await DepositService.updateDeposit(id, deposit);
        const index = this.deposits.findIndex(d => d.id === parseInt(id));
        if (index !== -1) {
          this.deposits[index] = response.data.deposit;
        }
        this.error = null;
        return response.data.deposit;
      } catch (error) {
        this.error = error.message || `Nie udało się zaktualizować wpłaty o ID ${id}`;
        console.error(`Błąd podczas aktualizacji wpłaty o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteDeposit(id) {
      this.loading = true;
      try {
        await DepositService.deleteDeposit(id);
        this.deposits = this.deposits.filter(d => d.id !== parseInt(id));
        this.error = null;
      } catch (error) {
        this.error = error.message || `Nie udało się usunąć wpłaty o ID ${id}`;
        console.error(`Błąd podczas usuwania wpłaty o ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
