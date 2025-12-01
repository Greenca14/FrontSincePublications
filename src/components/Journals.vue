<template>
  <div>
    <h1>Журналы</h1>
    
    <DataTable
      :value="journals"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[5, 10, 20]"
      :totalRecords="journals_total"
      @page="onPageChange"
      :first="offset"
    >
      <Column field="id" header="ID" />
      <Column field="name" header="Название журнала" />
      <Column field="publications_count" header="Кол-во публикаций" />
    </DataTable>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'Journals',
  components: { DataTable, Column },
  
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0
    }
  },
  
  computed: {
    journals() {
      return this.dataStore.journals || []
    },
    journals_total() {
      return this.dataStore.journals_total || 0
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    async loadData() {
      await this.dataStore.get_journals()
      await this.dataStore.get_journals_total()
    },
    
    onPageChange(event) {
      this.offset = event.first
      this.perpage = event.rows
      const page = Math.floor(this.offset / this.perpage)
      this.dataStore.get_journals(page, this.perpage)
    }
  }
}
</script>
