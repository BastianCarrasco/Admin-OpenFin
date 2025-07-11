<template>
    <div>
        <h1>Empresas</h1>
        <p>Aquí se mostrará la información de las inscripciones de empresas.</p>
        <!-- Aquí integrarás la lógica para cargar datos de MongoDB -->
        <div v-if="loading">Cargando datos de empresas...</div>
        <ul v-else-if="empresas.length">
            <li v-for="empresa in empresas" :key="empresa._id">
                <!-- Ajusta estos campos según la estructura real de tus datos -->
                <!-- Si los datos tienen 'nombre' y 'ruc' directamente, esto funcionará. -->
                <!-- Si están anidados en un objeto 'data' (como antes), necesitarás ajustar empresa.data.nombre etc. -->
                {{ empresa.nombre }} - {{ empresa.ruc }}
            </li>
        </ul>
        <p v-else>No hay empresas registradas.</p>
        <p v-if="error" style="color: red">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const empresas = ref([]);
const loading = ref(true);
const error = ref(null);

// Acceder a la variable de entorno específica para empresas
// Asegúrate de que esta variable esté definida en tu archivo .env del frontend
const API_URL_EMPRESAS = import.meta.env.VITE_API_URL_EMPRESAS;
onMounted(async () => {
    try {
        // Usar directamente la URL completa de la variable de entorno
        const response = await axios.get(API_URL_EMPRESAS);

        // IMPORTANTE: Recuerda cómo es la estructura de tu respuesta API.
        // Si la respuesta es { message: "...", data: [...] }, entonces usa response.data.data
        // Si la respuesta es directamente un arreglo [...], entonces usa response.data
        // Basado en tu JSON anterior, debería ser response.data.data
        empresas.value = response.data.data;

    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>