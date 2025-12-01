<template>
  <Menubar :model="items" class="bg-gray-900 border-0">
    <template #start>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-book text-2xl text-blue-400"></i>
        <span class="font-bold text-white text-xl">Journal System</span>
      </div>
    </template>

    <template #item="{ item }">
      <router-link :to="item.route" class="p-menuitem-link flex align-items-center gap-2 p-3 text-400 no-underline">
        <span :class="item.icon"></span>
        <span>{{ item.label }}</span>
      </router-link>
    </template>

    <template #end>
      <div class="flex align-items-center gap-3">
        <div v-if="isAuthenticated && user" class="flex align-items-center gap-2">
          <i class="pi pi-user text-white"></i>
          <span class="text-white">{{ user.name }}</span>
          <Button @click="logout" label="Выйти" severity="danger" />
        </div>
        <div v-else class="flex align-items-center gap-2">
          <InputText 
            v-model="email" 
            type="email" 
            placeholder="Логин" 
            :class="{ 'p-invalid': errorMessage }"
          />
          <InputText 
            v-model="password" 
            type="password" 
            placeholder="Пароль"
            :class="{ 'p-invalid': errorMessage }"
          />
          <Button @click="login" label="Войти" severity="success" />
          <small v-if="errorMessage" class="text-red-400">{{ errorMessage }}</small>
        </div>
      </div>
    </template>
  </Menubar>

  <router-view></router-view>
</template>

<script>
import { useAuthStore } from './stores/authStore'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  components: { Menubar, InputText, Button },
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore(),
      items: [
        { label: 'Главная', icon: 'pi pi-home', route: '/' },
        { label: 'Публикации', icon: 'pi pi-file', route: '/publications' },
        { label: 'Журналы', icon: 'pi pi-book', route: '/journals' },
        { label: 'Персоны', icon: 'pi pi-users', route: '/persons' }
      ]
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
      this.$router.push('/');
      this.email = ''
      this.password = ''
    },
    login() { 
      this.authStore.login({ email: this.email, password: this.password })
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

<style>
body {
  background-color: #1a1a1a;
  color: white;
  margin: 0;
  padding: 0;
}

/* Убираем подчеркивание и синий цвет у ссылок меню */
.p-menubar .p-menuitem-link {
  text-decoration: none !important;
  color: #cbd5e0 !important;
}

.p-menubar .p-menuitem-link:hover {
  text-decoration: none !important;
  color: #ffffff !important;
}

/* Активная ссылка */
.p-menubar .p-menuitem-link.router-link-active {
  color: #63b3ed !important;
}
</style>