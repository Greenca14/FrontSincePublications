<template>
  <div>
    <h1>Персоны</h1>
    
    <DataTable
      :value="persons"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[5, 10, 20]"
      :totalRecords="persons_total"
      @page="onPageChange"
      :first="offset"
    >
      <Column header="Аватар" style="width: 80px">
        <template #body="slotProps">
          <div class="flex justify-center">
            <img 
              v-if="slotProps.data.avatar" 
              :src="slotProps.data.avatar" 
              :alt="slotProps.data.full_name"
              class="w-10 h-10 rounded-full object-cover border"
            />
            <div 
              v-else
              class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <i class="pi pi-user" style="font-size: 1rem"></i>
            </div>
          </div>
        </template>
      </Column>
      
      <Column field="id" header="ID" />
      <Column field="full_name" header="ФИО" />
      <Column field="birth_date" header="Дата рождения">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.birth_date) }}
        </template>
      </Column>
      <Column field="publications_count" header="Публикации" />
    </DataTable>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'Persons',
  components: { DataTable, Column },
  
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0
    }
  },
  
  computed: {
    persons() {
      return this.dataStore.persons || []
    },
    persons_total() {
      return this.dataStore.persons_total || 0
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    async loadData() {
      await this.dataStore.get_persons()
      await this.dataStore.get_persons_total()
    },
    
    onPageChange(event) {
      this.offset = event.first
      this.perpage = event.rows
      const page = Math.floor(this.offset / this.perpage)
      this.dataStore.get_persons(page, this.perpage)
    },
    
    formatDate(dateString) {
      if (!dateString) return '-'
      try {
        return new Date(dateString).toLocaleDateString('ru-RU')
      } catch {
        return dateString
      }
    }
  }
}
</script>
