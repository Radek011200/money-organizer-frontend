<script setup>
import { ref, onMounted, computed } from 'vue';
import StatisticsService from '@/services/StatisticsService';
import IncomeExpensesChart from '@/components/charts/IncomeExpensesChart.vue';
import ExpensesByCategoryChart from '@/components/charts/ExpensesByCategoryChart.vue';
import IncomesByCategoryChart from '@/components/charts/IncomesByCategoryChart.vue';
import DailyBreakdownChart from '@/components/charts/DailyBreakdownChart.vue';

// State variables
const loading = ref(true);
const error = ref(null);
const statistics = ref(null);
const selectedPeriod = ref('month'); // Default to month
const customStartDate = ref('');
const customEndDate = ref('');
const showCustomDatePicker = ref(false);

// Computed properties for summary data
const totalExpenses = computed(() => statistics.value?.summary?.total_expenses || 0);
const totalDeposits = computed(() => statistics.value?.summary?.total_deposits || 0);
const balance = computed(() => statistics.value?.summary?.balance || 0);

// Period options for the selector
const periodOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
  { value: 'custom', label: 'Custom Range' }
];

// Fetch statistics based on selected period
const fetchStatistics = async () => {
  loading.value = true;
  error.value = null;

  try {
    let response;

    if (selectedPeriod.value === 'custom' && customStartDate.value && customEndDate.value) {
      response = await StatisticsService.getCustomStatistics(
        customStartDate.value,
        customEndDate.value
      );
    } else {
      response = await StatisticsService.getStatistics({ period: selectedPeriod.value });
    }

    statistics.value = response.data;

    // Here we would initialize or update charts with the new data
    // This will be implemented when we add Chart.js
  } catch (err) {
    console.error('Error fetching statistics:', err);
    error.value = 'Failed to load statistics. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle period change
const handlePeriodChange = () => {
  showCustomDatePicker.value = selectedPeriod.value === 'custom';

  if (selectedPeriod.value !== 'custom') {
    fetchStatistics();
  }
};

// Handle custom date range submission
const handleCustomDateSubmit = () => {
  if (customStartDate.value && customEndDate.value) {
    fetchStatistics();
  }
};

// Initialize component
onMounted(() => {
  fetchStatistics();
});
</script>

<template>
  <div class="statistics-container">
    <h1>Financial Statistics</h1>

    <!-- Period selector -->
    <div class="period-selector">
      <label for="period-select">Select Time Period:</label>
      <select
        id="period-select"
        v-model="selectedPeriod"
        @change="handlePeriodChange"
        class="period-select"
      >
        <option v-for="option in periodOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Custom date range picker -->
      <div v-if="showCustomDatePicker" class="custom-date-range">
        <div class="date-inputs">
          <div class="date-field">
            <label for="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              v-model="customStartDate"
            >
          </div>

          <div class="date-field">
            <label for="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              v-model="customEndDate"
            >
          </div>
        </div>

        <button @click="handleCustomDateSubmit" class="apply-button">Apply</button>
      </div>
    </div>

    <!-- Loading and error states -->
    <div v-if="loading" class="loading">Loading statistics...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Statistics summary -->
    <div v-if="statistics && !loading" class="statistics-summary">
      <div class="summary-card income">
        <h3>Total Income</h3>
        <div class="amount">{{ totalDeposits.toFixed(2) }} PLN</div>
      </div>

      <div class="summary-card expenses">
        <h3>Total Expenses</h3>
        <div class="amount">{{ totalExpenses.toFixed(2) }} PLN</div>
      </div>

      <div class="summary-card balance" :class="{ 'negative': balance < 0 }">
        <h3>Balance</h3>
        <div class="amount">{{ balance.toFixed(2) }} PLN</div>
      </div>
    </div>

    <!-- Charts section -->
    <div v-if="statistics && !loading" class="charts-container">
      <div class="chart-section">
        <h2>Income vs Expenses</h2>
        <IncomeExpensesChart :statistics="statistics" />
      </div>

      <div class="chart-section">
        <h2>Expenses by Category</h2>
        <ExpensesByCategoryChart :statistics="statistics" />
      </div>

      <div class="chart-section">
        <h2>Income by Category</h2>
        <IncomesByCategoryChart :statistics="statistics" />
      </div>

      <div class="chart-section">
        <h2>Daily Breakdown</h2>
        <DailyBreakdownChart :statistics="statistics" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.period-selector {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.period-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-left: 0.5rem;
  font-size: 1rem;
}

.custom-date-range {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.date-inputs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-field {
  flex: 1;
}

.date-field label {
  display: block;
  margin-bottom: 0.5rem;
}

.date-field input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.apply-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #2980b9;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.statistics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.summary-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #2c3e50;
}

.summary-card .amount {
  font-size: 1.8rem;
  font-weight: bold;
}

.income {
  background-color: #e8f4fd;
  border-left: 4px solid #3498db;
}

.expenses {
  background-color: #fdeaea;
  border-left: 4px solid #e74c3c;
}

.balance {
  background-color: #eafaf1;
  border-left: 4px solid #2ecc71;
}

.balance.negative {
  background-color: #fdeaea;
  border-left: 4px solid #e74c3c;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.chart-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-placeholder {
  height: 300px;
  background-color: #f8f9fa;
  border: 1px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .date-inputs {
    flex-direction: column;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>
