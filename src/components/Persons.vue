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
      console.log('Персоны из хранилища:', this.dataStore.persons)
      if (this.dataStore.persons && this.dataStore.persons.length > 0) {
        console.log('Первая персона:', this.dataStore.persons[0])
        console.log('Поле full_name:', this.dataStore.persons[0]?.full_name)
      }
      return this.dataStore.persons || []
    },
    persons_total() {
      return this.dataStore.persons_total || 0
    }
  },
  
  mounted() {
    console.log('Persons component mounted')
    this.loadData()
  },
  
  methods: {
    async loadData() {
      console.log('Загрузка персон...')
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