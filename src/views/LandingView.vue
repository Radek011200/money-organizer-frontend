<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="landing-container">
    <div class="landing-content">
      <h1>Welcome to Money Organiser</h1>
      <p class="tagline">Your personal finance management solution</p>

      <div class="features">
        <div class="feature">
          <h3>Track Expenses</h3>
          <p>Keep track of all your expenses in one place, categorized for easy analysis.</p>
        </div>

        <div class="feature">
          <h3>Monitor Income</h3>
          <p>Record all your income sources and see your financial growth over time.</p>
        </div>

        <div class="feature">
          <h3>Visualize Statistics</h3>
          <p>Get insights into your spending habits with detailed statistics and reports.</p>
        </div>
      </div>

      <div class="cta-buttons">
        <button @click="navigateToLogin" class="btn btn-primary">Login</button>
        <button @click="navigateToRegister" class="btn btn-secondary">Register</button>
      </div>

      <div class="google-auth">
        <p>Or sign in with:</p>
        <a :href="'/auth/google'" class="btn btn-google">Google</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.landing-content {
  max-width: 800px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 10px;
}

.tagline {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.feature {
  flex: 1;
  min-width: 200px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  color: #3498db;
  margin-bottom: 10px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background-color: #bdc3c7;
}

.google-auth {
  margin-top: 20px;
}

.btn-google {
  display: inline-block;
  background-color: #db4437;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
}

.btn-google:hover {
  background-color: #c53929;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }

  .feature {
    min-width: 100%;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }
}
</style>
