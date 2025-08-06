<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { useCategoryStore } from '@/stores/category';

const depositStore = useDepositStore();
const categoryStore = useCategoryStore();
const router = useRouter();
const searchQuery = ref('');

// Computed property for filtered deposits
const filteredDeposits = computed(() => {
  if (!searchQuery.value) {
    return depositStore.deposits;
  }
  const query = searchQuery.value.toLowerCase();
  return depositStore.deposits.filter(deposit => {
    const categoryName = getCategoryName(deposit.category_id).toLowerCase();
    return deposit.name.toLowerCase().includes(query) ||
           categoryName.includes(query);
  });
});

// Format date to a more readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format amount to currency
const formatAmount = (amount) => {
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

// Navigate to deposit details
const viewDeposit = (id) => {
  router.push({ name: 'deposit-details', params: { id } });
};

// Navigate to edit deposit
const editDeposit = (id) => {
  router.push({ name: 'deposit-edit', params: { id } });
};

// Delete deposit
const deleteDeposit = async (id) => {
  if (confirm('Czy na pewno chcesz usunąć tę wpłatę?')) {
    try {
      await depositStore.deleteDeposit(id);
      alert('Wpłata usunięta pomyślnie');
    } catch (error) {
      alert('Błąd podczas usuwania wpłaty');
    }
  }
};

// Navigate to create deposit
const createDeposit = () => {
  router.push({ name: 'deposit-create' });
};

// Fetch deposits on component mount
onMounted(async () => {
  try {
    // Fetch categories first
    await categoryStore.fetchCategories();

    // Then fetch deposits
    await depositStore.fetchDeposits();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <div class="deposit-list">
    <h1>Wpłaty</h1>

    <div class="controls">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Szukaj wpłat..."
          class="search-input"
        />
      </div>
      <button @click="createDeposit" class="create-button">
        <span class="button-icon">+</span>
        <span class="button-text">Dodaj Wpłatę</span>
      </button>
    </div>

    <div v-if="depositStore.loading" class="status-message loading">
      <div class="loading-spinner"></div>
      Ładowanie wpłat...
    </div>

    <div v-else-if="depositStore.error" class="status-message error">
      <span class="error-icon">⚠️</span>
      {{ depositStore.error }}
    </div>

    <div v-else-if="filteredDeposits.length === 0" class="status-message no-deposits">
      <span class="empty-icon">📋</span>
      <p>Nie znaleziono wpłat.</p>
      <button @click="createDeposit" class="create-button-inline">Dodaj pierwszą wpłatę</button>
    </div>

    <div v-else class="deposit-cards">
      <div
        v-for="deposit in filteredDeposits"
        :key="deposit.id"
        class="deposit-card"
        @click="viewDeposit(deposit.id)"
      >
        <div class="deposit-card-header">
          <h3 class="deposit-name">{{ deposit.name }}</h3>
          <div class="deposit-amount">{{ formatAmount(deposit.amount) }}</div>
        </div>

        <div class="deposit-card-details">
          <div class="deposit-category">
            <span class="detail-label">Kategoria:</span>
            <span class="detail-value">{{ getCategoryName(deposit.category_id) }}</span>
          </div>
          <div class="deposit-date">
            <span class="detail-label">Data:</span>
            <span class="detail-value">{{ formatDate(deposit.date) }}</span>
          </div>
        </div>

        <div class="deposit-card-actions">
          <button @click.stop="editDeposit(deposit.id)" class="action-button edit-button">
            <span class="action-icon">✏️</span>
            <span class="action-text">Edytuj</span>
          </button>
          <button @click.stop="deleteDeposit(deposit.id)" class="action-button delete-button">
            <span class="action-icon">🗑️</span>
            <span class="action-text">Usuń</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling consistent with StatisticsView */
.deposit-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-container {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.9rem 1.25rem;
  border: 1px solid #d2d2d7;
  border-radius: 10px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
}

.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 113, 227, 0.2);
}

.button-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.create-button:hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 113, 227, 0.3);
}

.create-button:active {
  transform: translateY(0);
}

.status-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
}

.error-icon, .empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.create-button-inline {
  margin-top: 1.5rem;
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-button-inline:hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 113, 227, 0.3);
}

.deposit-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.deposit-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.deposit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.deposit-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.deposit-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.deposit-amount {
  font-weight: 600;
  color: #34c759;
  font-size: 1.2rem;
  background-color: rgba(52, 199, 89, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  letter-spacing: -0.2px;
}

.deposit-card-details {
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.deposit-category, .deposit-date {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.deposit-date {
  margin-bottom: 0;
}

.detail-label {
  color: #86868b;
  font-size: 0.95rem;
  font-weight: 500;
}

.detail-value {
  font-weight: 500;
  color: #1d1d1f;
  font-size: 1.05rem;
}

.deposit-card-actions {
  display: flex;
  padding: 1rem;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.edit-button {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.delete-button {
  background-color: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.edit-button:hover {
  background-color: #e8e8ed;
  transform: translateY(-1px);
}

.delete-button:hover {
  background-color: rgba(255, 59, 48, 0.15);
  transform: translateY(-1px);
}

.action-text {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .date-inputs {
    flex-direction: column;
  }

  .deposit-cards {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .deposit-list {
    color: #f5f5f7;
    background-color: #000000;
  }

  h1 {
    color: #f5f5f7;
  }

  .controls {
    background-color: #1d1d1f;
  }

  .search-input {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .search-input:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3);
  }

  .create-button {
    background-color: #0071e3;
  }

  .create-button:hover {
    background-color: #0077ed;
  }

  .status-message {
    background-color: #1d1d1f;
    color: #f5f5f7;
  }

  .no-deposits {
    background-color: #1d1d1f;
    color: #98989d;
  }

  .deposit-card {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .deposit-card:hover {
    border-color: rgba(0, 113, 227, 0.4);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .deposit-card-header {
    border-bottom-color: #2c2c2e;
  }

  .deposit-name {
    color: #f5f5f7;
  }

  .deposit-amount {
    color: #30d158;
    background-color: rgba(48, 209, 88, 0.2);
  }

  .deposit-card-details {
    border-bottom-color: #2c2c2e;
  }

  .detail-label {
    color: #98989d;
  }

  .detail-value {
    color: #f5f5f7;
  }

  .edit-button {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .edit-button:hover {
    background-color: #3a3a3c;
  }

  .delete-button {
    background-color: rgba(255, 69, 58, 0.2);
    color: #ff453a;
    border-color: rgba(255, 69, 58, 0.3);
  }

  .delete-button:hover {
    background-color: rgba(255, 69, 58, 0.25);
  }

  .loading {
    color: #98989d;
    background-color: #2c2c2e;
  }

  .error {
    color: #ff453a;
    background-color: rgba(255, 69, 58, 0.1);
  }
}
</style>
