<script setup>
import { ref, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  }
});

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Przychody',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: 'rgba(54, 162, 235, 1)',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointHoverBorderColor: '#ffffff',
      tension: 0.4,
      fill: true,
      data: []
    },
    {
      label: 'Wydatki',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointHoverBorderColor: '#ffffff',
      tension: 0.4,
      fill: true,
      data: []
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'center',
      labels: {
        font: {
          family: 'Poppins, sans-serif',
          size: 14,
          weight: '600'
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    title: {
      display: true,
      text: 'Dzienne przychody i wydatki',
      font: {
        family: 'Poppins, sans-serif',
        size: 20,
        weight: '700'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: 'Poppins, sans-serif',
        size: 16,
        weight: '600'
      },
      bodyFont: {
        family: 'Poppins, sans-serif',
        size: 14
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + context.raw + ' zł';
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.2)',
        drawBorder: false
      },
      ticks: {
        font: {
          family: 'Poppins, sans-serif',
          size: 12,
          weight: '500'
        },
        padding: 10,
        callback: function(value) {
          return value + ' zł';
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(200, 200, 200, 0.1)',
        drawBorder: false
      },
      ticks: {
        font: {
          family: 'Poppins, sans-serif',
          size: 12,
          weight: '500'
        },
        padding: 10
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  layout: {
    padding: 20
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
};

// Update chart data when statistics change
watch(() => props.statistics, (newStats) => {
  if (newStats && newStats.expenses_by_day && newStats.deposits_by_day) {
    updateChartData(newStats);
  }
}, { deep: true });

// Initialize chart with data if available
onMounted(() => {
  if (props.statistics && props.statistics.expenses_by_day && props.statistics.deposits_by_day) {
    updateChartData(props.statistics);
  }
});

// Update chart data with new statistics
const updateChartData = (stats) => {
  const expensesByDay = stats.expenses_by_day || [];
  const depositsByDay = stats.deposits_by_day || [];

  // Combine all dates from both arrays
  const allDates = [...new Set([
    ...expensesByDay.map(item => item.day),
    ...depositsByDay.map(item => item.day)
  ])].sort();

  // Create a map for quick lookup
  const expensesMap = new Map(expensesByDay.map(item => [item.day, item.total]));
  const depositsMap = new Map(depositsByDay.map(item => [item.day, item.total]));

  // Format dates for display
  const formattedDates = allDates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
  });

  // Prepare data for chart
  const expensesData = allDates.map(date => expensesMap.get(date) || 0);
  const depositsData = allDates.map(date => depositsMap.get(date) || 0);

  chartData.value = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Przychody',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: '#3498db',
        borderWidth: 2,
        pointBackgroundColor: '#3498db',
        tension: 0.4,
        fill: true,
        data: depositsData
      },
      {
        label: 'Wydatki',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: '#e74c3c',
        borderWidth: 2,
        pointBackgroundColor: '#e74c3c',
        tension: 0.4,
        fill: true,
        data: expensesData
      }
    ]
  };
};
</script>

<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chart-container {
    height: 350px;
  }

  :deep(.chartjs-render-monitor) {
    margin-top: 1rem;
  }

  :deep(.chartjs-legend-item) {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 300px;
  }

  :deep(.chartjs-legend) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  :deep(.chartjs-legend-item) {
    margin: 0 0.5rem;
  }

  :deep(.chartjs-tooltip) {
    max-width: 90%;
  }
}
</style>
