<template>
    <div>
        <h1>Empresas</h1>
        <p>Aquí se mostrará la información detallada de las inscripciones de empresas.</p>

        <div v-if="loading">
            <p>Cargando datos de empresas...</p>
        </div>

        <div v-else-if="empresas.length" class="empresas-list">
            <div v-for="empresa in empresas" :key="empresa._id" class="empresa-card">
                <h2>{{ empresa.nombre }} {{ empresa.apellido }}</h2>
                <p><strong>Empresa/Organización:</strong> {{ empresa.empresaOrganizacion }}</p>
                <p><strong>Área de Trabajo:</strong> {{ empresa.areaTrabajo }}</p>
                <p><strong>Correo:</strong> {{ empresa.correoElectronico }}</p>
                <p><strong>Teléfono:</strong> {{ empresa.numeroTelefono }}</p>
                <p><strong>Contacto Web:</strong> <a :href="empresa.contactoWeb" target="_blank">{{ empresa.contactoWeb
                        }}</a></p>

                <div v-if="empresa.vinculoPUCV && empresa.vinculoPUCV.length">
                    <p><strong>Vínculo con PUCV:</strong> {{ empresa.vinculoPUCV.join(', ') }}</p>
                </div>
                <p v-if="empresa.actividadesServicios"><strong>Actividades/Servicios:</strong> {{
                    empresa.actividadesServicios }}</p>

                <div v-if="empresa.desafio1 || empresa.desafio2 || empresa.desafio3">
                    <h3>Desafíos Principales:</h3>
                    <ul class="desafios-list">
                        <li v-if="empresa.desafio1">{{ empresa.desafio1 }}</li>
                        <li v-if="empresa.desafio2">{{ empresa.desafio2 }}</li>
                        <li v-if="empresa.desafio3">{{ empresa.desafio3 }}</li>
                    </ul>
                </div>

                <p v-if="empresa.interesInformacion"><strong>Interesado en Información:</strong> {{
                    empresa.interesInformacion === 'si' ? 'Sí' : 'No' }}</p>
            </div>
        </div>

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/empresas/inscripciones`);
        empresas.value = response.data.data; // Acceder a la propiedad 'data' de la respuesta
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_BASE_URL}/empresas/inscripciones) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Algunos estilos básicos para que se vea mejor */
.empresas-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.empresa-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;
    background-color: #f9f9f9;
}

.empresa-card h2 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.5em;
}

.empresa-card p {
    margin-bottom: 5px;
    line-height: 1.4;
}

.empresa-card p strong {
    color: #2c3e50;
}

.empresa-card a {
    color: #42b983;
    /* Color de Vue */
    text-decoration: none;
}

.empresa-card a:hover {
    text-decoration: underline;
}

.desafios-list {
    margin-top: 10px;
    padding-left: 20px;
}

.desafios-list li {
    margin-bottom: 5px;
}
</style>