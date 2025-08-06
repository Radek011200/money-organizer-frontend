<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { useCategoryStore } from '@/stores/category';

const route = useRoute();
const router = useRouter();
const depositStore = useDepositStore();
const categoryStore = useCategoryStore();

const depositId = computed(() => route.params.id);

// Format date to a more readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format amount to currency
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount);
};

// Get category name by ID
const getCategoryName = (categoryId) => {
  if (!categoryId) return 'N/A';
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category ? category.name : 'N/A';
};

// Navigate to edit deposit
const editDeposit = () => {
  router.push({ name: 'deposit-edit', params: { id: depositId.value } });
};

// Delete deposit and navigate back to list
const deleteDeposit = async () => {
  if (confirm('Czy na pewno chcesz usunąć tę wpłatę?')) {
    try {
      await depositStore.deleteDeposit(depositId.value);
      alert('Wpłata usunięta pomyślnie');
      router.push({ name: 'deposits' });
    } catch (error) {
      alert('Błąd podczas usuwania wpłaty');
    }
  }
};

// Navigate back to deposit list
const goBack = () => {
  router.push({ name: 'deposits' });
};

// Fetch deposit details on component mount
onMounted(async () => {
  try {
    // Fetch categories first
    await categoryStore.fetchCategories();

    // Then fetch deposit details
    await depositStore.fetchDeposit(depositId.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <div class="deposit-details">
    <h1>Szczegóły wpłaty</h1>

    <div v-if="depositStore.loading" class="loading">
      Ładowanie szczegółów wpłaty...
    </div>

    <div v-else-if="depositStore.error" class="error">
      {{ depositStore.error }}
    </div>

    <div v-else-if="!depositStore.deposit" class="not-found">
      Wpłata nie znaleziona.
    </div>

    <div v-else class="deposit-card">
      <div class="deposit-header">
        <h2>{{ depositStore.deposit.name }}</h2>
        <div class="amount">{{ formatAmount(depositStore.deposit.amount) }}</div>
      </div>

      <div class="deposit-info">
        <div class="info-row">
          <div class="label">Kategoria:</div>
          <div class="value">{{ getCategoryName(depositStore.deposit.category_id) }}</div>
        </div>

        <div class="info-row">
          <div class="label">Data:</div>
          <div class="value">{{ formatDate(depositStore.deposit.date) }}</div>
        </div>

        <div class="info-row">
          <div class="label">Utworzono:</div>
          <div class="value">{{ formatDate(depositStore.deposit.created_at) }}</div>
        </div>

        <div class="info-row">
          <div class="label">Ostatnia aktualizacja:</div>
          <div class="value">{{ formatDate(depositStore.deposit.updated_at) }}</div>
        </div>
      </div>

      <div class="actions">
        <button @click="goBack" class="back-button">Powrót do listy</button>
        <button @click="editDeposit" class="edit-button">Edytuj</button>
        <button @click="deleteDeposit" class="delete-button">Usuń</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modern minimalist styling inspired by Apple/Google */
.deposit-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

h1 {
  margin-bottom: 2rem;
  color: #1d1d1f;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: -0.5px;
}

.deposit-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  border: 1px solid #f5f5f7;
  overflow: hidden;
}

.deposit-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.deposit-header h2 {
  margin: 0;
  color: #1d1d1f;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: #34c759;
  background-color: rgba(52, 199, 89, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  letter-spacing: -0.2px;
}

.deposit-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

.label {
  font-weight: 500;
  color: #86868b;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.value {
  color: #1d1d1f;
  font-size: 1.05rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f5f5f7;
}

.back-button, .edit-button, .delete-button {
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.back-button {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
  order: 3; /* Place back button last on mobile */
}

.edit-button {
  background-color: #0071e3;
  color: white;
  order: 1; /* Place edit button first on mobile */
}

.delete-button {
  background-color: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  order: 2; /* Place delete button second on mobile */
}

.back-button:hover {
  background-color: #e8e8ed;
  transform: translateY(-1px);
}

.edit-button:hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 113, 227, 0.3);
}

.delete-button:hover {
  background-color: rgba(255, 59, 48, 0.15);
  transform: translateY(-1px);
}

.loading, .error, .not-found {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
}

.loading {
  color: #86868b;
  background-color: #f5f5f7;
}

.error {
  color: #ff3b30;
  background-color: rgba(255, 59, 48, 0.05);
}

.not-found {
  color: #86868b;
  background-color: #f5f5f7;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .deposit-details {
    padding: 3rem;
  }

  h1 {
    font-size: 2.25rem;
    text-align: center;
  }

  .deposit-card {
    padding: 2.5rem;
  }

  .deposit-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .deposit-header h2 {
    font-size: 2rem;
  }

  .amount {
    font-size: 1.5rem;
  }

  .info-row {
    flex-direction: row;
    margin-bottom: 1rem;
    align-items: center;
  }

  .label {
    width: 200px;
    margin-bottom: 0;
  }

  .actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
  }

  .back-button, .edit-button, .delete-button {
    width: auto;
    padding: 0.9rem 1.75rem;
  }

  .back-button {
    order: 1; /* Reset order for larger screens */
  }

  .edit-button {
    order: 2; /* Reset order for larger screens */
  }

  .delete-button {
    order: 3; /* Reset order for larger screens */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .deposit-details {
    padding: 4rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .deposit-card {
    padding: 3rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .deposit-details {
    color: #f5f5f7;
    background-color: #000000;
  }

  h1, h2 {
    color: #f5f5f7;
  }

  .deposit-card {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .deposit-header {
    border-bottom-color: #2c2c2e;
  }

  .amount {
    color: #30d158;
    background-color: rgba(48, 209, 88, 0.2);
  }

  .label {
    color: #98989d;
  }

  .value {
    color: #f5f5f7;
  }

  .actions {
    border-top-color: #2c2c2e;
  }

  .back-button {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .back-button:hover {
    background-color: #3a3a3c;
  }

  .edit-button {
    background-color: #0071e3;
  }

  .edit-button:hover {
    background-color: #0077ed;
  }

  .delete-button {
    background-color: rgba(255, 69, 58, 0.2);
    color: #ff453a;
    border-color: rgba(255, 69, 58, 0.3);
  }

  .delete-button:hover {
    background-color: rgba(255, 69, 58, 0.25);
  }

  .loading, .not-found {
    color: #98989d;
    background-color: #2c2c2e;
  }

  .error {
    color: #ff453a;
    background-color: rgba(255, 69, 58, 0.1);
  }
}
</style>
