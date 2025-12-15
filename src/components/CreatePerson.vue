<template>
  <div class="flex justify-center">
    <form v-on:submit.prevent="createPerson" class="w-1/2 p-6">
      <h2 class="text-2xl mb-6 text-center" style="color: #4b5563">Добавление персоны</h2>
      
      <div class="flex flex-col mb-4">
        <label class="mb-2 font-medium">Фамилия *</label>
        <InputText type="text" placeholder="Введите фамилию" v-model="lastName" required />
      </div>
      
      <div class="flex flex-col mb-4">
        <label class="mb-2 font-medium">Имя *</label>
        <InputText type="text" placeholder="Введите имя" v-model="firstName" required />
      </div>
      
      <div class="flex flex-col mb-4">
        <label class="mb-2 font-medium">Отчество</label>
        <InputText type="text" placeholder="Введите отчество" v-model="middleName" />
      </div>
      
      <div class="flex flex-col mb-4">
        <label class="mb-2 font-medium">Дата рождения</label>
        <Calendar 
          v-model="birthDate" 
          :showIcon="true" 
          placeholder="Выберите дату" 
          dateFormat="dd.mm.yy"
          :maxDate="maxDate"
          :manualInput="true"
          showButtonBar
        />
        <small class="text-gray-500 mt-1">Формат: ДД.ММ.ГГГГ</small>
      </div>
      
      <div class="mb-4 mt-4">
        <label for="avatar" id="avatar-label" 
               class="block text-md font-medium text-gray-500 border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <span class="pi pi-upload mx-3"></span>Выбрать аватар
        </label>
        <input type="file" hidden id="avatar" name="avatar" 
               v-on:change="changeAvatar" accept="image/*" />
      </div>
      
      <div class="flex flex-col gap-3 mt-8">
        <Button type="submit" label="Создать" class="p-button-primary" :disabled="!isFormValid" />
        <Button type="button" label="Очистить форму" class="p-button-secondary" @click="resetForm" />
        <Button type="button" label="Назад к списку" class="p-button-text" @click="goBack" />
      </div>
    </form>
  </div>
  <Toast position="bottom-right" />
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Toast from "primevue/toast";
import Calendar from 'primevue/calendar';
import { useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore.js';

export default {
  name: "CreatePerson",
  components: { InputText, Button, Toast, Calendar },
  data() {
    return {
      dataStore: useDataStore(),
      router: useRouter(),
      lastName: '',
      firstName: '',
      middleName: '',
      birthDate: null,
      avatar: null,
      maxDate: new Date()
    }
  },
  computed: {
    errorMessage() {
      return this.dataStore.errorMessage;
    },
    errorCode() {
      return this.dataStore.errorCode;
    },
    isFormValid() {
      return this.lastName.trim() !== '' && this.firstName.trim() !== '';
    },
    formattedBirthDate() {
      if (!this.birthDate) return null;
      const date = new Date(this.birthDate);
      return date.toISOString().split('T')[0];
    },
    fullNameForApi() {
      const parts = [];
      if (this.lastName.trim()) parts.push(this.lastName.trim());
      if (this.firstName.trim()) parts.push(this.firstName.trim());
      if (this.middleName.trim()) parts.push(this.middleName.trim());
      
      return parts.join(' ');
    }
  },
  methods: {
    showToast(severity, summary, detail, life = 3000) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: life
        });
      } else {
        console.log(`${severity}: ${summary} - ${detail}`);
      }
    },
    
    changeAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.showToast('error', 'Ошибка', 'Пожалуйста, выберите файл изображения', 3000);
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          this.showToast('error', 'Ошибка', 'Размер файла не должен превышать 5MB', 3000);
          return;
        }
        
        const label = document.getElementById('avatar-label');
        if (label) {
          label.innerHTML = '<span class="pi pi-file mx-3"></span>' + file.name;
        }
        
        this.avatar = file;
      } else {
        const label = document.getElementById('avatar-label');
        if (label) {
          label.innerHTML = '<span class="pi pi-upload mx-3"></span>Выбрать аватар';
        }
        this.avatar = null;
      }
    },
    
    async createPerson() {
      if (!this.isFormValid) {
        this.showToast('warn', 'Заполните обязательные поля', 'Поля "Фамилия" и "Имя" являются обязательными', 3000);
        return;
      }
      
      if (!this.fullNameForApi) {
        this.showToast('error', 'Ошибка', 'Не удалось сформировать ФИО', 3000);
        return;
      }
      
      const formData = new FormData();

      formData.append('full_name', this.fullNameForApi);
      
      if (this.formattedBirthDate) {
        formData.append('birth_date', this.formattedBirthDate);
      }
      
      if (this.avatar) {
        formData.append('avatar', this.avatar);
      }
      
      let loadingToast;
      if (this.$toast) {
        loadingToast = this.$toast.add({
          severity: 'info',
          summary: 'Создание персоны',
          detail: 'Пожалуйста, подождите...',
          life: 30000
        });
      }
      
      try {
        await this.dataStore.create_person(formData);
        
        if (loadingToast && this.$toast) {
          this.$toast.remove(loadingToast);
        }
        
        if (this.dataStore.errorCode && this.dataStore.errorCode !== "") {
          let errorDetail = this.dataStore.errorMessage || 'Произошла ошибка';
          
          if (this.dataStore.validationErrors) {
            const errors = Object.values(this.dataStore.validationErrors).flat();
            errorDetail = errors.join(', ');
          }
          
          this.showToast('error', "Ошибка добавления данных", errorDetail, 5000);
        } else {
          this.showToast('success', 'Успешно!', 'Персона успешно добавлена', 4000);
          
          this.resetForm();
          
          setTimeout(() => {
            this.router.push('/persons');
          }, 1500);
        }
      } catch (error) {
        if (loadingToast && this.$toast) {
          this.$toast.remove(loadingToast);
        }
        this.showToast('error', 'Ошибка', 'Произошла ошибка при создании персоны', 4000);
        console.error('Error creating person:', error);
      }
    },
    
    resetForm() {
      this.lastName = '';
      this.firstName = '';
      this.middleName = '';
      this.birthDate = null;
      this.avatar = null;
      const label = document.getElementById('avatar-label');
      if (label) {
        label.innerHTML = '<span class="pi pi-upload mx-3"></span>Выбрать аватар';
      }
      
      const fileInput = document.getElementById('avatar');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    
    goBack() {
      this.router.push('/persons');
    }
  }
}
</script>

