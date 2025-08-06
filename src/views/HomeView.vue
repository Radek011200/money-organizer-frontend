<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToExpenses = () => {
  router.push({ name: 'expenses' });
};
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to Money Organiser</h1>
      <p class="subtitle">Track, manage, and optimize your expenses with ease</p>
      <button @click="navigateToExpenses" class="cta-button">Get Started</button>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h2>Track Expenses</h2>
        <p>Easily record and categorize all your expenses in one place</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h2>Analyze Spending</h2>
        <p>Gain insights into your spending habits and identify areas for improvement</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">💰</div>
        <h2>Save Money</h2>
        <p>Make informed decisions to optimize your budget and save more</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.subtitle {
  font-size: 1.3rem;
  color: #5a6a7e;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.cta-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.feature-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
