<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const router = useRouter();
const searchQuery = ref('');

// Computed property for filtered expenses
const filteredExpenses = computed(() => {
  if (!searchQuery.value) {
    return expenseStore.expenses;
  }
  const query = searchQuery.value.toLowerCase();
  return expenseStore.expenses.filter(expense => {
    const categoryName = getCategoryName(expense.category_id).toLowerCase();
    return expense.name.toLowerCase().includes(query) ||
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

// Navigate to expense details
const viewExpense = (id) => {
  router.push({ name: 'expense-details', params: { id } });
};

// Navigate to edit expense
const editExpense = (id) => {
  router.push({ name: 'expense-edit', params: { id } });
};

// Delete expense
const deleteExpense = async (id) => {
  if (confirm('Are you sure you want to delete this expense?')) {
    try {
      await expenseStore.deleteExpense(id);
      alert('Expense deleted successfully');
    } catch (error) {
      alert('Error deleting expense');
    }
  }
};

// Navigate to create expense
const createExpense = () => {
  router.push({ name: 'expense-create' });
};

// Fetch expenses on component mount
onMounted(async () => {
  try {
    // Fetch categories first
    await categoryStore.fetchCategories();

    // Then fetch expenses
    await expenseStore.fetchExpenses();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <div class="expense-list">
    <h1>Expenses</h1>

    <div class="controls">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search expenses..."
          class="search-input"
        />
      </div>
      <button @click="createExpense" class="create-button">
        <span class="button-icon">+</span>
        <span class="button-text">Add Expense</span>
      </button>
    </div>

    <div v-if="expenseStore.loading" class="status-message loading">
      <div class="loading-spinner"></div>
      Loading expenses...
    </div>

    <div v-else-if="expenseStore.error" class="status-message error">
      <span class="error-icon">⚠️</span>
      {{ expenseStore.error }}
    </div>

    <div v-else-if="filteredExpenses.length === 0" class="status-message no-expenses">
      <span class="empty-icon">📋</span>
      <p>No expenses found.</p>
      <button @click="createExpense" class="create-button-inline">Add your first expense</button>
    </div>

    <div v-else class="expense-cards">
      <div
        v-for="expense in filteredExpenses"
        :key="expense.id"
        class="expense-card"
        @click="viewExpense(expense.id)"
      >
        <div class="expense-card-header">
          <h3 class="expense-name">{{ expense.name }}</h3>
          <div class="expense-amount">{{ formatAmount(expense.amount) }}</div>
        </div>

        <div class="expense-card-details">
          <div class="expense-category">
            <span class="detail-label">Category:</span>
            <span class="detail-value">{{ getCategoryName(expense.category_id) }}</span>
          </div>
          <div class="expense-date">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{ formatDate(expense.date) }}</span>
          </div>
        </div>

        <div class="expense-card-actions">
          <button @click.stop="editExpense(expense.id)" class="action-button edit-button">
            <span class="action-icon">✏️</span>
            <span class="action-text">Edit</span>
          </button>
          <button @click.stop="deleteExpense(expense.id)" class="action-button delete-button">
            <span class="action-icon">🗑️</span>
            <span class="action-text">Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling consistent with StatisticsView */
.expense-list {
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

.expense-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.expense-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.expense-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.expense-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.expense-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.expense-amount {
  font-weight: 600;
  color: #ff3b30;
  font-size: 1.2rem;
  background-color: rgba(255, 59, 48, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  letter-spacing: -0.2px;
}

.expense-card-details {
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.expense-category, .expense-date {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expense-date {
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

.expense-card-actions {
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

  .expense-cards {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .expense-list {
    color: #ffffff;
    background-color: #f8f9fa;
  }

  h1 {
    color: #222222;
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

  .no-expenses {
    background-color: #1d1d1f;
    color: #98989d;
  }

  .expense-card {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .expense-card:hover {
    border-color: rgba(0, 113, 227, 0.4);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .expense-card-header {
    border-bottom-color: #2c2c2e;
  }

  .expense-name {
    color: #f5f5f7;
  }

  .expense-amount {
    color: #ff453a;
    background-color: rgba(255, 69, 58, 0.2);
  }

  .expense-card-details {
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
