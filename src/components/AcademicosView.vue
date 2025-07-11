<template>
    <div>
        <h1>Académicos</h1>
        <p>Aquí se mostrará la información de las inscripciones de académicos.</p>
        <!-- Aquí integrarás la lógica para cargar datos de MongoDB -->
        <div v-if="loading">Cargando datos de académicos...</div>
        <ul v-else-if="academicos.length">
            <li v-for="academico in academicos" :key="academico._id">
                {{ academico.nombre }} - {{ academico.universidad }}
            </li>
        </ul>
        <p v-else>No hay académicos registrados.</p>
        <p v-if="error" style="color: red">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const academicos = ref([]);
const loading = ref(true);
const error = ref(null);

// Acceder a la variable de entorno definida en tu .env del frontend
// Vite expone las variables que empiezan con VITE_ a través de import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
    try {
        // Construye la URL completa usando la variable de entorno
        // Asegúrate de que API_BASE_URL no termine en "/" y el path no empiece con "/" extra,
        // o maneja las barras en la concatenación.
        // En tu caso: VITE_API_BASE_URL = "https://bun-mongo-production.up.railway.app/api"
        // Y el path de tu ruta es "/academicos/inscripciones"
        const response = await axios.get(`${API_BASE_URL}/academicos/inscripciones`);
        academicos.value = response.data;
    } catch (err) {
        console.error("Error al cargar académicos:", err);
        error.value = `Error al cargar los datos de académicos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_BASE_URL}/academicos/inscripciones) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>
