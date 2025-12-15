import { defineStore } from 'pinia'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useDataStore = defineStore('data', {
    state: () => ({
        journals: [],
        journals_total: null,
        
        publications: [],
        publications_total: null,
        
        persons: [],
        persons_total: null,
        
        categories: [],
        categories_total: null,
        items: [],
        errorCode: "",
        errorMessage: "",

        loading: false,
        errorMessage: ""
    }),
    
    actions: {
        async create_person(formData) {
            this.errorMessage = ""
            this.errorCode = ""
            try {
                const response = await axios.post(
                    backendUrl + '/persons',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                )
                this.errorCode = response.data.code
                this.errorMessage = response.data.message
            } catch (error) {
                if (error.response) {
                    this.errorCode = "11"
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorCode = "12"
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    this.errorCode = "13"
                    console.log(error)
                }
            }
        },

        async get_persons(page = 1, limit = 10){
            try {
                const response = await axios.get(
                    backendUrl + '/persons',
                    {
                        params: { page, limit },
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                );
                this.persons = response.data.data;
                this.persons_total = response.data.total;
            } catch (error) {
                console.error('Error fetching persons:', error);
            }
        },
    

        async get_journals(page = 0, perpage = 5) {
            this.loading = true
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/journals', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                })
                this.journals = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            } finally {
                this.loading = false
            }
        },

        async get_journals_total() {
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/journals_total')
                this.journals_total = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        },

        async get_publications(page = 0, perpage = 5) {
            this.loading = true
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/publications', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                })
                this.publications = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            } finally {
                this.loading = false
            }
        },

        async get_publications_total() {
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/publications_total')
                this.publications_total = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        },

        async get_persons(page = 0, perpage = 5) {
            this.loading = true
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/persons', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                })
                this.persons = response.data
                
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            } finally {
                this.loading = false
                
            }
        },

        async get_persons_total() {
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/persons_total')
                this.persons_total = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        },

        async get_categories(page = 0, perpage = 5) {
            this.loading = true
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/category', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                })
                this.categories = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            } finally {
                this.loading = false
            }
        },

        async get_categories_total() {
            this.errorMessage = ""
            try {
                const response = await axios.get(backendUrl + '/categories_total')
                this.categories_total = response.data
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.errorMessage = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        }
    }
})