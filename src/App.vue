<template>
  <div>
    <header>
      <nav>
        <div v-if="isAuthenticated && user">
          Добро пожаловать, {{ user.name }}
          <button @click="logout">Выйти</button>
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
              <label>Пароль:</label>
              <input v-model="password" type="password" required />
            </div>
            <button type="submit">Войти</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </form>
        </div>
      </nav>
    </header>

    <main>
      <div v-if="isAuthenticated && user">
        <h1>Система учета научных публикаций</h1>
        <p>Email: {{ user.email }}</p>
      </div>
      <div v-else>
        <h1>Система учета научных публикаций</h1>
        <p>Требуется авторизация</p>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from './stores/authStore'

export default {
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore(),
    }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    user() {
      return this.authStore.user
    },
    errorMessage() {
      return this.authStore.errorMessage
    },
  },
  methods: {
    logout() {
      this.authStore.logout()
    },
    login() {
      this.authStore.login({
        email: this.email,
        password: this.password,
      })
    },
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.authStore.isAuthenticated = true
      this.authStore.getUser()
    }
  },
}
</script>

<style>
.error {
  color: blue;
}
</style>
