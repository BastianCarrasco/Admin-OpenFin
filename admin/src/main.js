import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

// --- START: Configuración de Font Awesome ---
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faGraduationCap, // Icono para Estudiantes
  faBuilding, // Icono para Empresas
  faBookOpen, // Icono para Académicos/as
  faChevronDown, // Icono de flecha para dropdown
  faTrophy, // Opcional: Icono de trofeo para "Concurso", si lo vas a usar
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faGraduationCap, faBuilding, faBookOpen, faChevronDown, faTrophy);
// --- END: Configuración de Font Awesome ---

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

// Registra el componente de Font Awesome globalmente
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
