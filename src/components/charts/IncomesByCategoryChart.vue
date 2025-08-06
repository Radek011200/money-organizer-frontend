<script setup>
import { ref, watch, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

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
      backgroundColor: [
        'rgba(54, 162, 235, 0.9)',    // niebieski
        'rgba(76, 175, 80, 0.9)',     // zielony
        'rgba(153, 102, 255, 0.9)',   // fioletowy
        'rgba(255, 206, 86, 0.9)',    // żółty
        'rgba(75, 192, 192, 0.9)',    // turkusowy
        'rgba(255, 99, 132, 0.9)',    // różowy
        'rgba(33, 150, 243, 0.9)',    // jasnoniebieski
        'rgba(255, 159, 64, 0.9)',    // pomarańczowy
        'rgba(0, 188, 212, 0.9)',     // cyjan
        'rgba(156, 39, 176, 0.9)',    // purpurowy
        'rgba(233, 30, 99, 0.9)',     // różowy
        'rgba(121, 85, 72, 0.9)',     // brązowy
      ],
      hoverBackgroundColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(0, 188, 212, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(121, 85, 72, 1)',
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      cutout: '65%',
      data: []
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
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
      text: 'Przychody według kategorii',
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
  animation: {
    animateScale: true,
    animateRotate: true,
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  layout: {
    padding: 20
  }
};

// Update chart data when statistics change
watch(() => props.statistics, (newStats) => {
  if (newStats && newStats.deposits_by_category) {
    updateChartData(newStats);
  }
}, { deep: true });

// Initialize chart with data if available
onMounted(() => {
  if (props.statistics && props.statistics.deposits_by_category) {
    updateChartData(props.statistics);
  }
});

// Update chart data with new statistics
const updateChartData = (stats) => {
  const categories = stats.deposits_by_category || [];

  chartData.value = {
    labels: categories.map(item => item.category),
    datasets: [
      {
        backgroundColor: [
          '#3498db', // blue
          '#2ecc71', // green
          '#9b59b6', // purple
          '#f39c12', // yellow
          '#1abc9c', // turquoise
          '#e74c3c', // red
          '#34495e', // dark blue
          '#d35400', // orange
          '#16a085', // dark green
          '#8e44ad', // dark purple
          '#c0392b', // dark red
          '#7f8c8d', // gray
        ],
        data: categories.map(item => item.total)
      }
    ]
  };
};
</script>

<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
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

  :deep(.chartjs-legend-item) {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 280px;
  }

  :deep(.chartjs-legend) {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
