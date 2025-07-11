<template>
    <div>
        <h1>Empresas</h1>
        <p>Aquí se mostrará la información de las inscripciones de empresas.</p>
        <!-- Aquí integrarás la lógica para cargar datos de MongoDB -->
        <div v-if="loading">Cargando datos de empresas...</div>
        <ul v-else-if="empresas.length">
            <li v-for="empresa in empresas" :key="empresa._id">
                {{ empresa.nombre }} - {{ empresa.ruc }}
            </li>
        </ul>
        <p v-else>No hay empresas registradas.</p>
        <p v-if="error" style="color: red">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios"; // Asegúrate de instalar axios: bun add axios

const empresas = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        // Aquí es donde necesitarías un backend para conectar con MongoDB
        // Por ejemplo, una API en Node.js/Express que exponga tus datos
        const response = await axios.get(
            "http://localhost:3000/api/empresasinscripciones"
        ); // Ejemplo de endpoint
        empresas.value = response.data;
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = "Error al cargar los datos de empresas.";
    } finally {
        loading.value = false;
    }
});
</script>