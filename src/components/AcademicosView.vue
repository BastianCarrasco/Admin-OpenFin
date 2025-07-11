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
import axios from "axios"; // Asegúrate de instalar axios: bun add axios

const academicos = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        // Aquí es donde necesitarías un backend para conectar con MongoDB
        // Por ejemplo, una API en Node.js/Express que exponga tus datos
        const response = await axios.get(
            "http://localhost:3000/api/academicosinscripciones"
        ); // Ejemplo de endpoint
        academicos.value = response.data;
    } catch (err) {
        console.error("Error al cargar académicos:", err);
        error.value = "Error al cargar los datos de académicos.";
    } finally {
        loading.value = false;
    }
});
</script>