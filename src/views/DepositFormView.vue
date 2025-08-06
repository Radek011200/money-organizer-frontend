<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { useCategoryStore } from '@/stores/category';

const route = useRoute();
const router = useRouter();
const depositStore = useDepositStore();
const categoryStore = useCategoryStore();

// Determine if we're editing an existing deposit or creating a new one
const isEditMode = computed(() => route.name === 'deposit-edit');
const depositId = computed(() => route.params.id);

// Form data
const deposit = ref({
  name: '',
  amount: '',
  category_id: null,
  date: new Date().toISOString().substr(0, 10) // Default to today's date in YYYY-MM-DD format
});

// Form validation
const errors = ref({});
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!deposit.value.name) {
    errors.value.name = 'Nazwa jest wymagana';
    isValid = false;
  }

  if (!deposit.value.amount) {
    errors.value.amount = 'Kwota jest wymagana';
    isValid = false;
  } else if (isNaN(deposit.value.amount) || parseFloat(deposit.value.amount) < 0) {
    errors.value.amount = 'Kwota musi być liczbą dodatnią';
    isValid = false;
  }

  if (!deposit.value.date) {
    errors.value.date = 'Data jest wymagana';
    isValid = false;
  }

  return isValid;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    // Convert amount to number
    const formData = {
      ...deposit.value,
      amount: parseFloat(deposit.value.amount)
    };

    if (isEditMode.value) {
      await depositStore.updateDeposit(depositId.value, formData);
      alert('Wpłata zaktualizowana pomyślnie');
    } else {
      await depositStore.createDeposit(formData);
      alert('Wpłata utworzona pomyślnie');
    }

    // Navigate back to deposit list
    router.push({ name: 'deposits' });
  } catch (error) {
    alert(`Błąd ${isEditMode.value ? 'aktualizacji' : 'tworzenia'} wpłaty: ${error.message || 'Nieznany błąd'}`);
  }
};

// Cancel and go back to previous page
const cancel = () => {
  if (isEditMode.value) {
    router.push({ name: 'deposit-details', params: { id: depositId.value } });
  } else {
    router.push({ name: 'deposits' });
  }
};

// Load deposit data if in edit mode
onMounted(async () => {
  // Fetch categories for dropdown
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  if (isEditMode.value) {
    try {
      await depositStore.fetchDeposit(depositId.value);
      if (depositStore.deposit) {
        // Copy deposit data to form
        deposit.value = {
          name: depositStore.deposit.name,
          amount: depositStore.deposit.amount,
          category_id: depositStore.deposit.category_id || null,
          date: depositStore.deposit.date
        };
      }
    } catch (error) {
      console.error('Failed to fetch deposit details:', error);
    }
  }
});
</script>

<template>
  <div class="deposit-form">
    <h1>{{ isEditMode ? 'Edytuj wpłatę' : 'Utwórz nową wpłatę' }}</h1>

    <div v-if="isEditMode && depositStore.loading" class="loading">
      Ładowanie danych wpłaty...
    </div>

    <div v-else-if="isEditMode && depositStore.error" class="error">
      {{ depositStore.error }}
    </div>

    <form v-else @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="name">Nazwa</label>
        <input
          id="name"
          v-model="deposit.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label for="amount">Kwota</label>
        <input
          id="amount"
          v-model="deposit.amount"
          type="number"
          step="0.01"
          min="0"
          class="form-control"
          :class="{ 'is-invalid': errors.amount }"
        />
        <div v-if="errors.amount" class="error-message">{{ errors.amount }}</div>
      </div>

      <div class="form-group">
        <label for="category_id">Kategoria</label>
        <select
          id="category_id"
          v-model="deposit.category_id"
          class="form-control"
        >
          <option value="">Wybierz kategorię</option>
          <option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Data</label>
        <input
          id="date"
          v-model="deposit.date"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.date }"
        />
        <div v-if="errors.date" class="error-message">{{ errors.date }}</div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-button">Anuluj</button>
        <button type="submit" class="submit-button">{{ isEditMode ? 'Aktualizuj' : 'Utwórz' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Modern minimalist styling inspired by Apple/Google */
.deposit-form {
  max-width: 600px;
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

.form {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  border: 1px solid #f5f5f7;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #1d1d1f;
  font-size: 0.95rem;
  letter-spacing: -0.2px;
}

.form-control {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f5f5f7;
}

.form-control:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
  background-color: white;
}

.form-control.is-invalid {
  border-color: #ff3b30;
  background-color: rgba(255, 59, 48, 0.05);
}

.error-message {
  color: #ff3b30;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button, .submit-button {
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.submit-button {
  background-color: #0071e3;
  color: white;
  order: -1; /* Place submit button first on mobile */
}

.cancel-button:hover {
  background-color: #e8e8ed;
}

.submit-button:hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 113, 227, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.loading, .error {
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

/* Tablet and larger */
@media (min-width: 768px) {
  .deposit-form {
    padding: 3rem;
  }

  h1 {
    font-size: 2.25rem;
    text-align: center;
  }

  .form {
    padding: 2.5rem;
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .form-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
  }

  .cancel-button, .submit-button {
    width: auto;
    padding: 0.9rem 1.75rem;
  }

  .submit-button {
    order: 0; /* Reset order for larger screens */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .deposit-form {
    padding: 4rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .form {
    padding: 3rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .deposit-form {
    color: #f5f5f7;
    background-color: #000000;
  }

  h1 {
    color: #f5f5f7;
  }

  .form {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  label {
    color: #f5f5f7;
  }

  .form-control {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .form-control:focus {
    border-color: #0071e3;
    background-color: #3a3a3c;
  }

  .error-message {
    color: #ff453a;
  }

  .cancel-button {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .cancel-button:hover {
    background-color: #3a3a3c;
  }

  .submit-button {
    background-color: #0071e3;
  }

  .submit-button:hover {
    background-color: #0077ed;
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
