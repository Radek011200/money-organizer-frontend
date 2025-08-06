<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();

// Determine if we're editing an existing category or creating a new one
const isEditMode = computed(() => route.name === 'category-edit');
const categoryId = computed(() => route.params.id);

// Form data
const category = ref({
  name: '',
  isMain: false,
  parent_id: null,
  is_income: false
});

// Form validation
const errors = ref({});
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!category.value.name) {
    errors.value.name = 'Nazwa jest wymagana';
    isValid = false;
  }

  // If it's not a main category, it should have a parent
  if (!category.value.isMain && !category.value.parent_id) {
    errors.value.parent_id = 'Kategoria podrzędna musi mieć kategorię nadrzędną';
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
    if (isEditMode.value) {
      await categoryStore.updateCategory(categoryId.value, category.value);
      alert('Kategoria zaktualizowana pomyślnie');
    } else {
      await categoryStore.createCategory(category.value);
      alert('Kategoria utworzona pomyślnie');
    }

    // Navigate back to category list
    router.push({ name: 'categories' });
  } catch (error) {
    alert(`Błąd ${isEditMode.value ? 'aktualizacji' : 'tworzenia'} kategorii: ${error.message || 'Nieznany błąd'}`);
  }
};

// Cancel and go back to previous page
const cancel = () => {
  if (isEditMode.value) {
    router.push({ name: 'category-details', params: { id: categoryId.value } });
  } else {
    router.push({ name: 'categories' });
  }
};

// Handle isMain toggle
const toggleIsMain = () => {
  category.value.isMain = !category.value.isMain;
  if (category.value.isMain) {
    category.value.parent_id = null;
  }
};

// Load category data if in edit mode
onMounted(async () => {
  // Fetch all categories for parent selection
  await categoryStore.fetchCategories();

  if (isEditMode.value) {
    try {
      await categoryStore.fetchCategory(categoryId.value);
      if (categoryStore.category) {
        // Copy category data to form
        category.value = {
          name: categoryStore.category.name,
          isMain: categoryStore.category.isMain,
          parent_id: categoryStore.category.parent_id,
          is_income: categoryStore.category.is_income
        };
      }
    } catch (error) {
      console.error('Failed to fetch category details:', error);
    }
  }
});
</script>

<template>
  <div class="category-form">
    <h1>{{ isEditMode ? 'Edytuj kategorię' : 'Utwórz nową kategorię' }}</h1>

    <div v-if="isEditMode && categoryStore.loading" class="loading">
      Ładowanie danych kategorii...
    </div>

    <div v-else-if="isEditMode && categoryStore.error" class="error">
      {{ categoryStore.error }}
    </div>

    <form v-else @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="name">Nazwa</label>
        <input
          id="name"
          v-model="category.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <div class="checkbox-container">
          <input
            id="isMain"
            :checked="category.isMain"
            type="checkbox"
            @change="toggleIsMain"
          />
          <label for="isMain" class="checkbox-label">Kategoria główna</label>
        </div>
      </div>

      <div class="form-group">
        <label>Typ kategorii</label>
        <div class="radio-container">
          <div class="radio-option">
            <input
              id="type-expense"
              v-model="category.is_income"
              :value="false"
              type="radio"
              name="category-type"
            />
            <label for="type-expense" class="radio-label">Wydatek</label>
          </div>
          <div class="radio-option">
            <input
              id="type-income"
              v-model="category.is_income"
              :value="true"
              type="radio"
              name="category-type"
            />
            <label for="type-income" class="radio-label">Przychód</label>
          </div>
        </div>
      </div>

      <div class="form-group" v-if="!category.isMain">
        <label for="parent_id">Kategoria nadrzędna</label>
        <select
          id="parent_id"
          v-model="category.parent_id"
          class="form-control"
          :class="{ 'is-invalid': errors.parent_id }"
        >
          <option value="">Wybierz kategorię nadrzędną</option>
          <option
            v-for="parentCategory in categoryStore.categories.filter(c => c.isMain && (!isEditMode || c.id !== parseInt(categoryId)))"
            :key="parentCategory.id"
            :value="parentCategory.id"
          >
            {{ parentCategory.name }}
          </option>
        </select>
        <div v-if="errors.parent_id" class="error-message">{{ errors.parent_id }}</div>
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
.category-form {
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

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
}

.checkbox-label, .radio-label {
  margin-bottom: 0;
  cursor: pointer;
  font-weight: 400;
}

/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid #d2d2d7;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  background-color: #0071e3;
  border-color: #0071e3;
}

input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3);
}

.radio-container {
  display: flex;
  gap: 2rem;
  margin-top: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Custom radio button styling */
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid #d2d2d7;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

input[type="radio"]:checked {
  border-color: #0071e3;
}

input[type="radio"]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #0071e3;
}

input[type="radio"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3);
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
  .category-form {
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
  .category-form {
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
  .category-form {
    color: #f5f5f7;
  }

  h1 {
    color: #f5f5f7;
  }

  .form {
    background-color: #1d1d1f;
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

  input[type="checkbox"], input[type="radio"] {
    border-color: #3a3a3c;
    background-color: #2c2c2e;
  }

  input[type="checkbox"]:checked, input[type="radio"]:checked {
    background-color: #0071e3;
    border-color: #0071e3;
  }

  .checkbox-label, .radio-label {
    color: #f5f5f7;
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
