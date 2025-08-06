<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';

const categoryStore = useCategoryStore();
const router = useRouter();
const searchQuery = ref('');
const typeFilter = ref('all'); // 'all', 'income', 'expense'

// Computed property for filtered categories
const filteredCategories = computed(() => {
  let result = categoryStore.categories;

  // Filter by type
  if (typeFilter.value === 'income') {
    result = result.filter(category => category.is_income);
  } else if (typeFilter.value === 'expense') {
    result = result.filter(category => !category.is_income);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(category =>
      category.name.toLowerCase().includes(query)
    );
  }

  return result;
});

// Computed property for main categories
const mainCategories = computed(() => {
  return filteredCategories.value.filter(category => category.isMain);
});

// Computed property for sub categories
const subCategories = computed(() => {
  return filteredCategories.value.filter(category => !category.isMain);
});

// Navigate to category details
const viewCategory = (id) => {
  router.push({ name: 'category-details', params: { id } });
};

// Navigate to edit category
const editCategory = (id) => {
  router.push({ name: 'category-edit', params: { id } });
};

// Delete category
const deleteCategory = async (id) => {
  if (confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
    try {
      await categoryStore.deleteCategory(id);
      alert('Kategoria usunięta pomyślnie');
    } catch (error) {
      alert('Błąd podczas usuwania kategorii');
    }
  }
};

// Navigate to create category
const createCategory = () => {
  router.push({ name: 'category-create' });
};

// Fetch categories on component mount
onMounted(async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});
</script>

<template>
  <div class="category-list">
    <h1>Kategorie</h1>

    <div class="controls">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Szukaj kategorii..."
          class="search-input"
        />
      </div>
      <div class="filter-container">
        <div class="filter-label">Filtruj:</div>
        <div class="filter-options">
          <button
            @click="typeFilter = 'all'"
            class="filter-button"
            :class="{ active: typeFilter === 'all' }"
          >
            Wszystkie
          </button>
          <button
            @click="typeFilter = 'income'"
            class="filter-button"
            :class="{ active: typeFilter === 'income' }"
          >
            Przychody
          </button>
          <button
            @click="typeFilter = 'expense'"
            class="filter-button"
            :class="{ active: typeFilter === 'expense' }"
          >
            Wydatki
          </button>
        </div>
      </div>
      <button @click="createCategory" class="create-button">
        <span class="button-icon">+</span>
        <span class="button-text">Dodaj Kategorię</span>
      </button>
    </div>

    <div v-if="categoryStore.loading" class="status-message loading">
      <div class="loading-spinner"></div>
      Ładowanie kategorii...
    </div>

    <div v-else-if="categoryStore.error" class="status-message error">
      <span class="error-icon">⚠️</span>
      {{ categoryStore.error }}
    </div>

    <div v-else-if="filteredCategories.length === 0" class="status-message no-categories">
      <span class="empty-icon">📋</span>
      <p>Nie znaleziono kategorii.</p>
      <button @click="createCategory" class="create-button-inline">Dodaj pierwszą kategorię</button>
    </div>

    <div v-else>
      <!-- Main Categories -->
      <div class="category-section">
        <h2>Kategorie główne</h2>
        <div v-if="mainCategories.length === 0" class="no-categories-message">
          Brak kategorii głównych
        </div>
        <div v-else class="category-cards">
          <div
            v-for="category in mainCategories"
            :key="category.id"
            class="category-card"
            @click="viewCategory(category.id)"
          >
            <div class="category-card-header">
              <h3 class="category-name">{{ category.name }}</h3>
              <div class="category-badges">
                <div class="category-badge main">Główna</div>
                <div class="category-badge" :class="category.is_income ? 'income' : 'expense'">
                  {{ category.is_income ? 'Przychód' : 'Wydatek' }}
                </div>
              </div>
            </div>

            <div class="category-card-actions">
              <button @click.stop="editCategory(category.id)" class="action-button edit-button">
                <span class="action-icon">✏️</span>
                <span class="action-text">Edytuj</span>
              </button>
              <button @click.stop="deleteCategory(category.id)" class="action-button delete-button">
                <span class="action-icon">🗑️</span>
                <span class="action-text">Usuń</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub Categories -->
      <div class="category-section">
        <h2>Podkategorie</h2>
        <div v-if="subCategories.length === 0" class="no-categories-message">
          Brak podkategorii
        </div>
        <div v-else class="category-cards">
          <div
            v-for="category in subCategories"
            :key="category.id"
            class="category-card"
            @click="viewCategory(category.id)"
          >
            <div class="category-card-header">
              <h3 class="category-name">{{ category.name }}</h3>
              <div class="category-badges">
                <div class="category-badge sub">Podrzędna</div>
                <div class="category-badge" :class="category.is_income ? 'income' : 'expense'">
                  {{ category.is_income ? 'Przychód' : 'Wydatek' }}
                </div>
              </div>
            </div>

            <div class="category-card-details" v-if="category.parent_id">
              <div class="parent-category">
                <span class="detail-label">Kategoria nadrzędna:</span>
                <span class="detail-value">
                  {{ categoryStore.getCategoryById(category.parent_id)?.name || 'N/A' }}
                </span>
              </div>
            </div>

            <div class="category-card-actions">
              <button @click.stop="editCategory(category.id)" class="action-button edit-button">
                <span class="action-icon">✏️</span>
                <span class="action-text">Edytuj</span>
              </button>
              <button @click.stop="deleteCategory(category.id)" class="action-button delete-button">
                <span class="action-icon">🗑️</span>
                <span class="action-text">Usuń</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling consistent with StatisticsView */
.category-list {
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

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* Controls section */
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

.filter-container {
  margin-top: 0.5rem;
}

.filter-label {
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #1d1d1f;
  font-size: 0.95rem;
}

.filter-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.75rem 1.25rem;
  border: 1px solid #d2d2d7;
  background-color: white;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background-color: #f5f5f7;
}

.filter-button.active {
  background-color: #0071e3;
  color: white;
  border-color: #0071e3;
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

/* Status messages */
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

.no-categories-message {
  text-align: center;
  color: #86868b;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.no-categories-message:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Category cards */
.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.category-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.category-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.category-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.category-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.category-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.category-badge.main {
  background-color: #0071e3;
  color: white;
}

.category-badge.sub {
  background-color: #9f7aea;
  color: white;
}

.category-badge.income {
  background-color: #34c759;
  color: white;
}

.category-badge.expense {
  background-color: #ff3b30;
  color: white;
}

.category-card-details {
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.parent-category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  color: #86868b;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
  color: #1d1d1f;
  font-size: 1.05rem;
}

.category-card-actions {
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
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
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

  .category-cards {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .category-list {
    color: #f5f5f7;
    background-color: #000000;
  }

  h1, h2 {
    color: #f5f5f7;
  }

  h2 {
    border-bottom-color: #2c2c2e;
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

  .filter-label {
    color: #f5f5f7;
  }

  .filter-button {
    background-color: #2c2c2e;
    color: #f5f5f7;
    border-color: #3a3a3c;
  }

  .filter-button:hover {
    background-color: #3a3a3c;
  }

  .filter-button.active {
    background-color: #0071e3;
    color: white;
    border-color: #0071e3;
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

  .no-categories-message {
    background-color: #1d1d1f;
    color: #98989d;
  }

  .category-card {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .category-card:hover {
    border-color: rgba(0, 113, 227, 0.4);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .category-card-header {
    border-bottom-color: #2c2c2e;
  }

  .category-name {
    color: #f5f5f7;
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

  .category-card-details {
    border-bottom-color: #2c2c2e;
  }
}
</style>
