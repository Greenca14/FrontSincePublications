<template>
  <div>
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Главная</router-link></li>
          <li><router-link to="/journals">Журналы</router-link></li>
          <li><router-link to="/persons">Персоны</router-link></li>
        </ul>
        
        <div v-if="isAuthenticated && user">
          Welcome, {{ user.name }}
          <button @click="logout">Logout</button>
        </div>
        <div v-else>
          <form @submit.prevent="login">
            <div>
              <label>Login:</label>
              <input v-model="text" type="text" required />
            </div>
            <div>
              <label>Email:</label>
              <input v-model="email" type="email" required />
            </div>
            <div>
              <label>Password:</label>
              <input v-model="password" type="password" required />
            </div>
            <button type="submit">Login</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </form>
        </div>
      </nav>
    </header>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { useAuthStore } from './stores/authStore';

export default {
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore()
    };
  },
  computed: {
    isAuthenticated() { return this.authStore.isAuthenticated; },
    user() { return this.authStore.user; },
    errorMessage() { return this.authStore.errorMessage; }
  },
  methods: {
    logout() { this.authStore.logout(); },
    login() { 
      this.authStore.login({
        email: this.email, 
        password: this.password
      });
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  }
};
</script>

<style>
.error { color: red; }
ul { display: flex; gap: 20px; list-style: none; }
</style>