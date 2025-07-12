<template>
    <div>
        <div class="filters-section">
            <div class="filter-controls">
                <div class="filter-group">
                    <label for="search">Buscar por Nombre/Apellido:</label>
                    <input type="text" id="search" v-model="searchTerm" placeholder="Escribe para buscar..."
                        @input="applyFilters" />
                </div>

                <div class="filter-group">
                    <label for="unidadAcademica">Unidad Académica:</label>
                    <select id="unidadAcademica" v-model="filterUnidadAcademica" @change="applyFilters">
                        <option value="">Todas</option>
                        <option v-for="unidad in uniqueUnidadesAcademicas" :key="unidad" :value="unidad">
                            {{ unidad }}
                        </option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="desafioInteres">Desafío de Interés:</label>
                    <select id="desafioInteres" v-model="filterDesafioInteres" @change="applyFilters">
                        <option value="">Todos</option>
                        <option v-for="desafio in uniqueDesafiosInteres" :key="desafio" :value="desafio">
                            {{ desafio }}
                        </option>
                    </select>
                </div>

                <button @click="resetFilters" class="reset-button">
                    Limpiar Filtros
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de inscripciones a desafíos...</p>
        </div>

        <div v-else-if="filteredDesafios.length" class="desafios-grid">
            <div v-for="desafio in filteredDesafios" :key="desafio._id" class="desafio-card">
                <h3>{{ desafio.nombre }} {{ desafio.apellido }}</h3>
                <p>
                    <strong>Correo Electrónico:</strong>
                    <a :href="'mailto:' + desafio.correoElectronico">{{
                        desafio.correoElectronico
                        }}</a>
                </p>
                <p>
                    <strong>Unidad Académica:</strong>
                    {{ desafio.unidadAcademica }}
                    <span v-if="desafio.otraUnidad && desafio.unidadAcademica === 'Otra...'">({{ desafio.otraUnidad
                        }})</span>
                </p>
                <p>
                    <strong>Desafío de Interés:</strong> {{ desafio.desafioInteres }}
                </p>
                <p>
                    <strong>Capacidades para el Desafío:</strong>
                    {{ desafio.capacidadesDesafio }}
                </p>

                <div class="timestamp-section">
                    <p>
                        <small>
                            <strong>Fecha de Inscripción:</strong>
                            {{ new Date(desafio.createdAt).toLocaleDateString() }}
                        </small>
                    </p>
                    <p v-if="desafio.updatedAt">
                        <small>
                            <strong>Última Actualización:</strong>
                            {{ new Date(desafio.updatedAt).toLocaleDateString() }}
                        </small>
                    </p>
                </div>
            </div>
        </div>

        <p v-else class="no-data-message">
            No hay inscripciones a desafíos registradas que coincidan con los filtros
            aplicados.
        </p>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const desafios = ref([]); // Todos los datos cargados desde la API
const filteredDesafios = ref([]); // La lista que se muestra, basada en los filtros
const loading = ref(true);
const error = ref(null);

// Estados para los filtros
const searchTerm = ref("");
const filterUnidadAcademica = ref("");
const filterDesafioInteres = ref(""); // Nuevo filtro para desafío de interés

const API_URL_DESAFIO = import.meta.env.VITE_API_URL_DESAFIOS;

// Propiedades computadas para obtener opciones únicas para los selects
const uniqueUnidadesAcademicas = computed(() => {
    const unidades = new Set(
        desafios.value.map((desafio) => desafio.unidadAcademica).filter(Boolean),
    );
    // También agregar la "Otra..." si existe en los datos originales y es una opción válida
    desafios.value.forEach((desafio) => {
        if (desafio.unidadAcademica === "Otra..." && desafio.otraUnidad) {
            unidades.add("Otra..."); // Asegurarse de que "Otra..." esté como una opción seleccionable
        }
    });
    return Array.from(unidades).sort();
});

const uniqueDesafiosInteres = computed(() => {
    const intereses = new Set(
        desafios.value.map((desafio) => desafio.desafioInteres).filter(Boolean),
    );
    return Array.from(intereses).sort();
});

// Función para aplicar filtros
const applyFilters = () => {
    let tempDesafios = desafios.value;

    // 1. Filtro por búsqueda (nombre y apellido)
    if (searchTerm.value) {
        const searchLower = searchTerm.value.toLowerCase();
        tempDesafios = tempDesafios.filter(
            (desafio) =>
                desafio.nombre.toLowerCase().includes(searchLower) ||
                desafio.apellido.toLowerCase().includes(searchLower),
        );
    }

    // 2. Filtro por Unidad Académica
    if (filterUnidadAcademica.value) {
        tempDesafios = tempDesafios.filter(
            (desafio) => desafio.unidadAcademica === filterUnidadAcademica.value,
        );
    }

    // 3. Filtro por Desafío de Interés
    if (filterDesafioInteres.value) {
        tempDesafios = tempDesafios.filter(
            (desafio) => desafio.desafioInteres === filterDesafioInteres.value,
        );
    }

    filteredDesafios.value = tempDesafios;
};

// Función para limpiar filtros
const resetFilters = () => {
    searchTerm.value = "";
    filterUnidadAcademica.value = "";
    filterDesafioInteres.value = "";
    applyFilters(); // Vuelve a aplicar los filtros para mostrar todo
};

onMounted(async () => {
    try {
        // Asegúrate de que API_URL_DESAFIO esté correctamente definida en tus variables de entorno
        // Por ejemplo, en un archivo .env: VITE_API_URL_DESAFIOS=http://localhost:3000/api/desafios
        const response = await axios.get(API_URL_DESAFIO);
        desafios.value = response.data.data; // Carga todos los datos
        applyFilters(); // Aplica los filtros iniciales (mostrará todo al principio)
    } catch (err) {
        console.error("Error al cargar inscripciones a desafíos:", err);
        error.value = `Error al cargar los datos de inscripciones a desafíos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_DESAFIO}) sea accesible. Detalles: ${err.message}`;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Estilos generales (Mantienen la mayoría de los estilos existentes) */
h1 {
    text-align: center;
    color: #34495e;
    margin-bottom: 20px;
}

p {
    text-align: center;
    color: #555;
    margin-bottom: 20px;
}

/* Mensajes de estado */
.loading-message,
.no-data-message,
.error-message {
    padding: 20px;
    font-size: 1.1em;
    color: #555;
    text-align: center;
}

.error-message {
    color: red;
    font-weight: bold;
}

/* Sección de Filtros */
.filters-section {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 25px;
    margin: 20px auto;
    max-width: 1200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filters-section h2 {
    text-align: center;
    color: #34495e;
    margin-top: 0;
    margin-bottom: 20px;
    border-bottom: 2px solid #42b983;
    padding-bottom: 10px;
}

.filter-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    align-items: flex-end;
}

.filter-group {
    display: flex;
    flex-direction: column;
}

.filter-group label {
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

.filter-group input[type="text"],
.filter-group select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;
}

.filter-group select[multiple] {
    min-height: 80px;
    resize: vertical;
}

.reset-button {
    padding: 10px 20px;
    background-color: #384693;
    /* Azul */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    transition: background-color 0.3s ease;
    align-self: flex-end;
}

.reset-button:hover {
    background-color: #2c3e50;
    /* Un tono más oscuro de azul o similar */
}

/* Grid para tarjetas */
.desafios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    padding: 20px;
}

/* Estilo de la tarjeta individual */
.desafio-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: left;
    background-color: #ffffff;
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.desafio-card:hover {
    transform: translateY(-5px);
}

.desafio-card h3 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.6em;
    border-bottom: 2px solid #42b983;
    padding-bottom: 5px;
}

.desafio-card p {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #555;
    font-size: 0.95em;
    text-align: left;
}

.desafio-card p strong {
    color: #2c3e50;
    margin-right: 5px;
}

.desafio-card a {
    color: #42b983;
    text-decoration: none;
}

.desafio-card a:hover {
    text-decoration: underline;
}

.timestamp-section {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px dashed #e0e0e0;
    font-size: 0.85em;
    color: #888;
}

.timestamp-section p {
    margin-bottom: 0;
    text-align: left;
}
</style>