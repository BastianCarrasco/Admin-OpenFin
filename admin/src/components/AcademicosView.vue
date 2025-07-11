<template>
    <div>
        <div class="filters-section">
            <h2>Filtros</h2>
            <div class="filter-controls">
                <div class="filter-group">
                    <label for="search">Buscar por Nombre:</label>
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
                    <label for="capacidadesID">Capacidades ID:</label>
                    <select id="capacidadesID" v-model="filterCapacidadesID" @change="applyFilters">
                        <option value="">Todas</option>
                        <option v-for="capacidad in uniqueCapacidadesID" :key="capacidad" :value="capacidad">
                            {{ capacidad }}
                        </option>
                    </select>
                </div>

                <button @click="resetFilters" class="reset-button">Limpiar Filtros</button>
            </div>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de inscripciones de académicos...</p>
        </div>

        <div v-else-if="filteredAcademicos.length" class="academicos-grid">
            <div v-for="academico in filteredAcademicos" :key="academico._id" class="academico-card">
                <h3>{{ academico.nombreApellido }}</h3>
                <p>
                    <strong>Correo Electrónico:</strong>
                    <a :href="'mailto:' + academico.correoElectronico">{{
                        academico.correoElectronico
                    }}</a>
                </p>
                <p>
                    <strong>Unidad Académica:</strong>
                    {{ academico.unidadAcademica }}
                    <span v-if="academico.otraUnidad && academico.unidadAcademica === 'Otra...'">({{
                        academico.otraUnidad }})</span>
                </p>
                <p><strong>Capacidades ID:</strong> {{ academico.capacidadesID }}</p>

                <p v-if="academico.acompanante">
                    <strong>Acompañante:</strong> {{ academico.acompanante }}
                </p>

                <div class="timestamp-section">
                    <p>
                        <small>
                            <strong>Fecha de Inscripción:</strong>
                            {{ new Date(academico.createdAt).toLocaleDateString() }}
                        </small>
                    </p>
                    <p v-if="academico.updatedAt">
                        <small>
                            <strong>Última Actualización:</strong>
                            {{ new Date(academico.updatedAt).toLocaleDateString() }}
                        </small>
                    </p>
                </div>
            </div>
        </div>

        <p v-else class="no-data-message">
            No hay inscripciones de académicos registradas que coincidan con los filtros
            aplicados.
        </p>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const academicos = ref([]); // Todos los datos cargados desde la API
const filteredAcademicos = ref([]); // La lista que se muestra, basada en los filtros
const loading = ref(true);
const error = ref(null);

// Estados para los filtros
const searchTerm = ref("");
const filterUnidadAcademica = ref("");
const filterCapacidadesID = ref("");

const API_URL_ACADEMICOS = import.meta.env.VITE_API_URL_ACADEMICOS;

// Propiedades computadas para obtener opciones únicas para los selects
const uniqueUnidadesAcademicas = computed(() => {
    const unidades = new Set(
        academicos.value.map((acad) => acad.unidadAcademica).filter(Boolean),
    );
    // También agregar la "Otra..." si existe en los datos originales y es una opción válida
    academicos.value.forEach((acad) => {
        if (acad.unidadAcademica === "Otra..." && acad.otraUnidad) {
            unidades.add("Otra..."); // Asegurarse de que "Otra..." esté como una opción seleccionable
        }
    });
    return Array.from(unidades).sort();
});

const uniqueCapacidadesID = computed(() => {
    const capacidades = new Set(
        academicos.value.map((acad) => acad.capacidadesID).filter(Boolean),
    );
    return Array.from(capacidades).sort();
});

// Función para aplicar filtros
const applyFilters = () => {
    let tempAcademicos = academicos.value;

    // 1. Filtro por búsqueda (nombreApellido)
    if (searchTerm.value) {
        const searchLower = searchTerm.value.toLowerCase();
        tempAcademicos = tempAcademicos.filter((acad) =>
            acad.nombreApellido.toLowerCase().includes(searchLower),
        );
    }

    // 2. Filtro por Unidad Académica
    if (filterUnidadAcademica.value) {
        tempAcademicos = tempAcademicos.filter(
            (acad) => acad.unidadAcademica === filterUnidadAcademica.value,
        );
    }

    // 3. Filtro por Capacidades ID
    if (filterCapacidadesID.value) {
        tempAcademicos = tempAcademicos.filter(
            (acad) => acad.capacidadesID === filterCapacidadesID.value,
        );
    }

    filteredAcademicos.value = tempAcademicos;
};

// Función para limpiar filtros
const resetFilters = () => {
    searchTerm.value = "";
    filterUnidadAcademica.value = "";
    filterCapacidadesID.value = "";
    applyFilters(); // Vuelve a aplicar los filtros para mostrar todo
};

onMounted(async () => {
    try {
        const response = await axios.get(API_URL_ACADEMICOS);
        academicos.value = response.data.data; // Carga todos los datos
        applyFilters(); // Aplica los filtros iniciales (mostrará todo al principio)
    } catch (err) {
        console.error("Error al cargar inscripciones de académicos:", err);
        error.value = `Error al cargar los datos de inscripciones de académicos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_ACADEMICOS}) sea accesible. Detalles: ${err.message}`;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Estilos generales */
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

/* Sección de Filtros (NUEVOS ESTILOS) */
.filters-section {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 25px;
    margin: 20px auto;
    max-width: 1200px;
    /* Ancho máximo para la sección de filtros */
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
    /* Alinea los controles a la parte inferior */
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
    /* Incluye padding y borde en el ancho */
}

.filter-group select[multiple] {
    min-height: 80px;
    /* Altura mínima para selecciones múltiples si fuera necesario */
    resize: vertical;
}

.reset-button {
    padding: 10px 20px;
    background-color: #f44336;
    /* Rojo */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    transition: background-color 0.3s ease;
    align-self: flex-end;
    /* Alinea el botón limpiar al final en su columna */
}

.reset-button:hover {
    background-color: #d32f2f;
}

/* Grid para tarjetas (EXISTENTE) */
.academicos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    padding: 20px;
}

/* Estilo de la tarjeta individual (EXISTENTE) */
.academico-card {
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

.academico-card:hover {
    transform: translateY(-5px);
}

.academico-card h3 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.6em;
    border-bottom: 2px solid #42b983;
    padding-bottom: 5px;
}

.academico-card p {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #555;
    font-size: 0.95em;
    text-align: left;
}

.academico-card p strong {
    color: #2c3e50;
    margin-right: 5px;
}

.academico-card a {
    color: #42b983;
    text-decoration: none;
}

.academico-card a:hover {
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