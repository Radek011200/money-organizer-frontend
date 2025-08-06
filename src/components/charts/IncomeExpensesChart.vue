<script setup>
import { ref, watch, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  }
});

const chartData = ref({
  labels: ['Przychody vs Wydatki'],
  datasets: [
    {
      label: 'Przychody',
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      data: [0]
    },
    {
      label: 'Wydatki',
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      data: [0]
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
        pointStyle: 'rectRounded'
      }
    },
    title: {
      display: true,
      text: 'Przychody vs Wydatki',
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
      displayColors: true
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
        padding: 10
      }
    },
    x: {
      grid: {
        display: false
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
  }
};

// Update chart data when statistics change
watch(() => props.statistics, (newStats) => {
  if (newStats && newStats.summary) {
    updateChartData(newStats);
  }
}, { deep: true });

// Initialize chart with data if available
onMounted(() => {
  if (props.statistics && props.statistics.summary) {
    updateChartData(props.statistics);
  }
});

// Update chart data with new statistics
const updateChartData = (stats) => {
  chartData.value = {
    labels: ['Przychody vs Wydatki'],
    datasets: [
      {
        label: 'Przychody',
        backgroundColor: '#3498db',
        data: [stats.summary.total_deposits]
      },
      {
        label: 'Wydatki',
        backgroundColor: '#e74c3c',
        data: [stats.summary.total_expenses]
      }
    ]
  };
};
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 350px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }

  :deep(.chartjs-render-monitor) {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 280px;
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
}
</style>
