import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Journals from '../components/Journals.vue';
import Persons from '../components/Persons.vue';
import Publications from '../components/Publications.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/journals', component: Journals },
  { path: '/publications', component: Publications },
  { path: '/persons', component: Persons }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;