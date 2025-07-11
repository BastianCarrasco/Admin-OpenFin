<template>
    <div>
        <h1>Empresas</h1>
        <p>Aquí se mostrará la información detallada de las inscripciones de empresas.</p>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de empresas...</p>
        </div>

        <div v-else-if="empresas.length" class="empresas-grid">
            <div v-for="empresa in empresas" :key="empresa._id" class="empresa-card">
                <h3>{{ empresa.nombre }} {{ empresa.apellido }}</h3>
                <p><strong>ID:</strong> {{ empresa._id }}</p>
                <p><strong>Empresa/Organización:</strong> {{ empresa.empresaOrganizacion }}</p>
                <p><strong>Área de Trabajo:</strong> {{ empresa.areaTrabajo }}</p>
                <p><strong>Correo Electrónico:</strong> <a :href="'mailto:' + empresa.correoElectronico">{{
                    empresa.correoElectronico }}</a></p>
                <p><strong>Número de Teléfono:</strong> {{ empresa.numeroTelefono }}</p>
                <p><strong>Contacto Web:</strong> <a :href="empresa.contactoWeb" target="_blank"
                        rel="noopener noreferrer">{{ empresa.contactoWeb }}</a></p>

                <div v-if="empresa.vinculoPUCV && empresa.vinculoPUCV.length">
                    <p><strong>Vínculo con PUCV:</strong> {{ empresa.vinculoPUCV.join(', ') }}</p>
                </div>

                <p v-if="empresa.actividadesServicios">
                    <strong>Actividades/Servicios:</strong> {{ empresa.actividadesServicios }}
                </p>

                <div v-if="empresa.desafio1 || empresa.desafio2 || empresa.desafio3" class="desafios-section">
                    <h4>Desafíos Principales:</h4>
                    <ul>
                        <li v-if="empresa.desafio1">{{ empresa.desafio1 }}</li>
                        <li v-if="empresa.desafio2">{{ empresa.desafio2 }}</li>
                        <li v-if="empresa.desafio3">{{ empresa.desafio3 }}</li>
                    </ul>
                </div>

                <p v-if="empresa.interesInformacion">
                    <strong>Interesado en más información:</strong> {{ empresa.interesInformacion === 'si' ? 'Sí' : 'No'
                    }}
                </p>
            </div>
        </div>

        <p v-else class="no-data-message">No hay empresas registradas.</p>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const empresas = ref([]);
const loading = ref(true);
const error = ref(null);

const API_URL_EMPRESAS = import.meta.env.VITE_API_URL_EMPRESAS;

onMounted(async () => {
    try {
        const response = await axios.get(API_URL_EMPRESAS);
        empresas.value = response.data.data; // Acceder a la propiedad 'data' de la respuesta
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Estilos para el componente */
.loading-message,
.no-data-message,
.error-message {
    padding: 20px;
    font-size: 1.1em;
    color: #555;
}

.error-message {
    color: red;
    font-weight: bold;
}

.empresas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    padding: 20px;
}

.empresa-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: left;
    background-color: #ffffff;
    transition: transform 0.2s ease-in-out;
}

.empresa-card:hover {
    transform: translateY(-5px);
}

.empresa-card h3 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.6em;
    border-bottom: 2px solid #42b983;
    /* Verde Vue */
    padding-bottom: 5px;
}

.empresa-card p {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #555;
    font-size: 0.95em;
}

.empresa-card p strong {
    color: #2c3e50;
    margin-right: 5px;
}

.empresa-card a {
    color: #42b983;
    text-decoration: none;
}

.empresa-card a:hover {
    text-decoration: underline;
}

.desafios-section {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #e0e0e0;
}

.desafios-section h4 {
    color: #34495e;
    margin-bottom: 8px;
    font-size: 1.2em;
}

.desafios-section ul {
    list-style-type: disc;
    padding-left: 25px;
    margin-top: 0;
}

.desafios-section li {
    margin-bottom: 5px;
    color: #666;
}
</style>