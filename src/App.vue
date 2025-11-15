<template>
  <div class="dark-theme">
    <!-- Верхняя панель в темной теме -->
    <div class="header">
      <div class="header-content">
        <!-- Лого и название -->
        <div class="logo-section">
          <i class="pi pi-book logo-icon"></i>
          <span class="logo-text">Journal Management System</span>
        </div>

        <!-- Навигация -->
        <div class="navigation">
          <router-link to="/" class="nav-link">Главная</router-link>
          <router-link to="/journals" class="nav-link">Журналы</router-link>
          <router-link to="/persons" class="nav-link">Персоны</router-link>
        </div>

        <!-- Аутентификация -->
        <div class="auth-section">
          <div v-if="isAuthenticated && user" class="user-info">
            <i class="pi pi-user user-icon"></i>
            <span class="user-name">{{ user.name }}</span>
            <Button 
              @click="logout" 
              label="Выйти" 
              class="logout-btn"
            />
          </div>
          
          <div v-else class="login-form">
            <div class="input-group">
              <InputText 
                v-model="email" 
                placeholder="Email" 
                class="dark-input"
              />
              <InputText 
                v-model="password" 
                type="password" 
                placeholder="Пароль" 
                class="dark-input"
              />
            </div>
            <Button 
              @click="login" 
              label="Войти" 
              class="login-btn"
            />
            <span v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="main-content">
      <router-view class="page-content"></router-view>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from './stores/authStore'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  components: { InputText, Button },
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore()
    }
  },
  computed: {
    isAuthenticated() { return this.authStore.isAuthenticated },
    user() { return this.authStore.user },
    errorMessage() { return this.authStore.errorMessage }
  },
  methods: {
    logout() { 
      this.authStore.logout()
      this.email = ''
      this.password = ''
    },
    login() { 
      this.authStore.login({
        email: this.email, 
        password: this.password
      })
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.authStore.isAuthenticated = true
      this.authStore.getUser()
    }
  }
}
</script>

<style scoped>
.dark-theme {
  background: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

/* Шапка */
.header {
  background: #2d3748;
  border-bottom: 1px solid #4a5568;
  padding: 0.75rem 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
}

/* Логотип */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 1.8rem;
  color: #63b3ed;
}

.logo-text {
  font-weight: bold;
  font-size: 1.3rem;
  color: #ffffff;
}

/* Навигация */
.navigation {
  display: flex;
  gap: 25px;
  align-items: center;
}

.nav-link {
  color: #cbd5e0;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  color: #ffffff;
  background: #4a5568;
}

.nav-link.router-link-active {
  color: #63b3ed;
  background: #2d3748;
}

/* Аутентификация */
.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-icon {
  color: #a0aec0;
  font-size: 1.1rem;
}

.user-name {
  color: #e2e8f0;
  font-weight: 500;
}

.logout-btn {
  background: #e53e3e !important;
  border: none !important;
  color: white !important;
}

.login-form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-group {
  display: flex;
  gap: 8px;
}

/* Темные инпуты */
.dark-input {
  background: #4a5568 !important;
  border: 1px solid #718096 !important;
  color: #ffffff !important;
  width: 180px;
}

.dark-input::placeholder {
  color: #a0aec0 !important;
}

.dark-input:focus {
  border-color: #63b3ed !important;
  box-shadow: 0 0 0 1px #63b3ed !important;
}

.login-btn {
  background: #38a169 !important;
  border: none !important;
  color: white !important;
}

.error-message {
  color: #fc8181;
  font-size: 0.8rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: center;
  margin-top: 5px;
}

/* Основной контент */
.main-content {
  min-height: calc(100vh - 70px);
  background: #1a1a1a;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #e2e8f0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .navigation {
    gap: 15px;
  }
  
  .login-form {
    flex-direction: column;
    gap: 10px;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .dark-input {
    width: 200px;
  }
}
</style>