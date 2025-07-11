import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

// Importa tus nuevas vistas
import EmpresasView from "./components/EmpresasView.vue";
import AcademicosView from "./components/AcademicosView.vue";
import ConcursoView from "./components/ConcursoView.vue";

import "./assets/main.css"; // O tu archivo CSS principal

const routes = [
  { path: "/empresas", component: EmpresasView },
  { path: "/academicos", component: AcademicosView },
  { path: "/concurso", component: ConcursoView },
  { path: "/", redirect: "/empresas" }, // Redirige a empresas por defecto
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
