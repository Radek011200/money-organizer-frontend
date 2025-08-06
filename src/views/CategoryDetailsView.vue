<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();

const categoryId = computed(() => route.params.id);

// Navigate to edit category
const editCategory = () => {
  router.push({ name: 'category-edit', params: { id: categoryId.value } });
};

// Delete category and navigate back to list
const deleteCategory = async () => {
  if (confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
    try {
      await categoryStore.deleteCategory(categoryId.value);
      alert('Kategoria usunięta pomyślnie');
      router.push({ name: 'categories' });
    } catch (error) {
      alert('Błąd podczas usuwania kategorii');
    }
  }
};

// Navigate back to category list
const goBack = () => {
  router.push({ name: 'categories' });
};

// Fetch category details on component mount
onMounted(async () => {
  try {
    await categoryStore.fetchCategories(); // Fetch all categories to get parent info
    await categoryStore.fetchCategory(categoryId.value);
  } catch (error) {
    console.error('Failed to fetch category details:', error);
  }
});
</script>

<template>
  <div class="category-details">
    <h1>Szczegóły kategorii</h1>

    <div v-if="categoryStore.loading" class="loading">
      Ładowanie szczegółów kategorii...
    </div>

    <div v-else-if="categoryStore.error" class="error">
      {{ categoryStore.error }}
    </div>

    <div v-else-if="!categoryStore.category" class="not-found">
      Kategoria nie znaleziona.
    </div>

    <div v-else class="category-card">
      <div class="category-header">
        <h2>{{ categoryStore.category.name }}</h2>
        <div class="category-badge" :class="categoryStore.category.isMain ? 'main' : 'sub'">
          {{ categoryStore.category.isMain ? 'Główna' : 'Podrzędna' }}
        </div>
      </div>

      <div class="category-info">
        <div v-if="!categoryStore.category.isMain && categoryStore.category.parent_id" class="info-row">
          <div class="label">Kategoria nadrzędna:</div>
          <div class="value">
            {{ categoryStore.getCategoryById(categoryStore.category.parent_id)?.name || 'N/A' }}
          </div>
        </div>

        <div class="info-row">
          <div class="label">Utworzono:</div>
          <div class="value">{{ new Date(categoryStore.category.created_at).toLocaleDateString() }}</div>
        </div>

        <div class="info-row">
          <div class="label">Ostatnia aktualizacja:</div>
          <div class="value">{{ new Date(categoryStore.category.updated_at).toLocaleDateString() }}</div>
        </div>
      </div>

      <div class="subcategories" v-if="categoryStore.category.isMain">
        <h3>Podkategorie</h3>
        <div v-if="categoryStore.getSubCategories(categoryStore.category.id).length === 0" class="no-subcategories">
          Brak podkategorii
        </div>
        <ul v-else class="subcategory-list">
          <li v-for="subCategory in categoryStore.getSubCategories(categoryStore.category.id)" :key="subCategory.id">
            <router-link :to="{ name: 'category-details', params: { id: subCategory.id } }">
              {{ subCategory.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="actions">
        <button @click="goBack" class="back-button">Powrót do listy</button>
        <button @click="editCategory" class="edit-button">Edytuj</button>
        <button @click="deleteCategory" class="delete-button">Usuń</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modern minimalist styling inspired by Apple/Google */
.category-details {
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

.category-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  border: 1px solid #f5f5f7;
  overflow: hidden;
}

.category-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f7;
}

.category-header h2 {
  margin: 0;
  color: #1d1d1f;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.category-badge {
  align-self: flex-start;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
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

.category-info {
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

.subcategories {
  margin-bottom: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f5f5f7;
}

.subcategories h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  color: #1d1d1f;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.no-subcategories {
  color: #86868b;
  font-style: italic;
  padding: 1rem;
  background-color: #f5f5f7;
  border-radius: 10px;
  text-align: center;
}

.subcategory-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.subcategory-list li {
  margin-bottom: 0;
}

.subcategory-list a {
  color: #0071e3;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  display: block;
  background-color: #f5f5f7;
  font-weight: 500;
}

.subcategory-list a:hover {
  color: #0071e3;
  background-color: rgba(0, 113, 227, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
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
  .category-details {
    padding: 3rem;
  }

  h1 {
    font-size: 2.25rem;
    text-align: center;
  }

  .category-card {
    padding: 2.5rem;
  }

  .category-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .category-header h2 {
    font-size: 2rem;
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

  .subcategory-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
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
  .category-details {
    padding: 4rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .category-card {
    padding: 3rem;
  }

  .subcategory-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .category-details {
    color: #f5f5f7;
    background-color: #000000;
  }

  h1, h2, h3 {
    color: #f5f5f7;
  }

  .category-card {
    background-color: #1d1d1f;
    border-color: #2c2c2e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .category-header {
    border-bottom-color: #2c2c2e;
  }

  .label {
    color: #98989d;
  }

  .value {
    color: #f5f5f7;
  }

  .subcategories {
    border-top-color: #2c2c2e;
  }

  .no-subcategories {
    background-color: #2c2c2e;
    color: #98989d;
  }

  .subcategory-list a {
    background-color: #2c2c2e;
    color: #0071e3;
  }

  .subcategory-list a:hover {
    background-color: rgba(0, 113, 227, 0.2);
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
