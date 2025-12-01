<template>
  <div>
    <h1>Научные публикации</h1>
    
    <DataTable
      :value="publications"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[5, 10, 20]"
      :totalRecords="publications_total"
      @page="onPageChange"
      :first="offset"
    >
      <Column field="id" header="ID" />
      <Column field="title" header="Название" />
      <Column header="Год">
        <template #body="slotProps">
          {{ getYearFromDate(slotProps.data.publication_date) }}
        </template>
      </Column>
      <Column header="Журнал">
        <template #body="slotProps">
          {{ slotProps.data.journal?.name || '-' }}
        </template>
      </Column>
      <Column header="Авторы">
        <template #body="slotProps">
          {{ getAuthorsNames(slotProps.data.authors) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'Publications',
  components: { DataTable, Column },
  
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
      personsMap: {} // Кэш для персон: person_id -> full_name
    }
  },
  
  computed: {
    publications() {
      return this.dataStore.publications || []
    },
    publications_total() {
      return this.dataStore.publications_total || 0
    },
    persons() {
      return this.dataStore.persons || []
    }
  },
  
  mounted() {
    this.loadPersons().then(() => {
      this.loadData()
    })
  },
  
  methods: {
    async loadPersons() {
      try {
        await this.dataStore.get_persons(0, 100)
        
        this.personsMap = {}
        this.persons.forEach(person => {
          this.personsMap[person.id] = person.full_name
        })
        
        console.log('Карта персон создана. Записей:', Object.keys(this.personsMap).length)
        console.log('Пример:', this.personsMap[1])
      } catch (error) {
        console.error('Ошибка загрузки персон:', error)
      }
    },
    
    async loadData() {
      await this.dataStore.get_publications()
      await this.dataStore.get_publications_total()
    
    },
    
    onPageChange(event) {
      this.offset = event.first
      this.perpage = event.rows
      const page = Math.floor(this.offset / this.perpage)
      this.dataStore.get_publications(page, this.perpage)
    },
    
    getYearFromDate(dateString) {
      if (!dateString) {
        return this.publications.find(p => p.id === this.publications[0]?.id)?.year || '-'
      }
      
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString.split('-')[0] // Берем год
          }
          return '-'
        }
        return date.getFullYear()
      } catch (error) {
        console.error('Ошибка парсинга даты:', error)
        return '-'
      }
    },
    
    getAuthorsNames(authors) {
      if (!authors || !Array.isArray(authors) || authors.length === 0) {
        return '-'
      }
      
      console.log('Обрабатываю авторов:', authors)
      console.log('Карта персон:', this.personsMap)
      
      const authorNames = authors
        .map(author => {
          const personId = author.person_id
          const personName = this.personsMap[personId]
          
          return personName || `Автор #${personId}`
        })
        .filter(name => name) // Убираем пустые
        .join(', ')
      
      console.log('Результат:', authorNames)
      return authorNames || '-'
    }
  }
}
</script>