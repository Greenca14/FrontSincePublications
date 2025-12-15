import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Journals from '../components/Journals.vue';
import Persons from '../components/Persons.vue';
import Publications from '../components/Publications.vue'
import CreatePerson from "../components/CreatePerson.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/journals', component: Journals },
  { path: '/publications', component: Publications },
  { path: '/persons', component: Persons },
  { path: '/createPerson', component: CreatePerson },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;