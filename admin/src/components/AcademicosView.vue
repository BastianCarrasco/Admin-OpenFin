<template>
    <div>
        <h1>Académicos</h1>
        <p>Aquí se mostrará la información de las inscripciones de académicos.</p>
        <!-- Aquí integrarás la lógica para cargar datos de MongoDB -->
        <div v-if="loading">Cargando datos de académicos...</div>
        <ul v-else-if="academicos.length">
            <li v-for="academico in academicos" :key="academico._id">
                <!-- Ajusta estos campos según la estructura real de tus datos de académicos -->
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

// Acceder a la variable de entorno específica para académicos
// Asegúrate de que esta variable esté definida en tu archivo .env del frontend
const API_URL_ACADEMICOS = import.meta.env.VITE_API_URL_ACADEMICOS;

onMounted(async () => {
    try {
        // Usar directamente la URL completa de la variable de entorno
        const response = await axios.get(API_URL_ACADEMICOS);

        // IMPORTANTE: Recuerda cómo es la estructura de tu respuesta API para académicos.
        // Si es { message: "...", data: [...] }, entonces usa response.data.data
        // Si es directamente un arreglo [...], entonces usa response.data
        // Lo más probable es que también sea response.data.data si tu API usa el mismo formato
        academicos.value = response.data.data;

    } catch (err) {
        console.error("Error al cargar académicos:", err);
        error.value = `Error al cargar los datos de académicos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_ACADEMICOS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>