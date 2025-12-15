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
          {{ getYear(slotProps.data) }}
        </template>
      </Column>
      <Column header="Журнал">
        <template #body="slotProps">
          {{ slotProps.data.journal?.name || '-' }}
        </template>
      </Column>
      <Column header="Авторы">
        <template #body="slotProps">
          {{ getpersons(slotProps.data.persons) }}
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
      offset: 0
    }
  },
  
  computed: {
    publications() {
      const pubs = this.dataStore.publications || []
      return pubs
    },
    publications_total() {
      return this.dataStore.publications_total || 0
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
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
    
    getYear(pub) {
      if (pub.publication_date) {
        const year = new Date(pub.publication_date).getFullYear()
        return isNaN(year) ? '-' : year
      }
      return '-'
    },
    
    getpersons(persons) {
      if (!persons || !Array.isArray(persons)) {
        return '-'
      }
      
      if (persons[0] && persons[0].full_name) {
        return persons.map(a => a.full_name).join(', ')
      }
      
      if (persons[0] && persons[0].person_id) {
        return persons.map(a => `Автор #${a.person_id}`).join(', ')
      }
      
      return 'Авторы не указаны'
    }
  }
}
</script>