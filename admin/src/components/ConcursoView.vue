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

                <!-- INICIO DEL CAMBIO: Mostrar como lista con viñetas -->
                <p>
                    <strong>Desafío de Interés:</strong>
                <ul v-if="Array.isArray(desafio.desafioInteres)">
                    <li v-for="(item, index) in desafio.desafioInteres" :key="index">
                        {{ item }}
                    </li>
                </ul>
                <span v-else>
                    {{ desafio.desafioInteres }}
                </span>
                </p>
                <!-- FIN DEL CAMBIO -->

                <!-- Puedes descomentar esto si decides mostrarlo -->
                <!-- <p>
                    <strong>Capacidades para el Desafío:</strong>
                    {{ desafio.capacidadesDesafio }}
                </p> -->

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
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import "../assets/concurso.css";

const desafios = ref([]); // Todos los datos cargados desde la API
const filteredDesafios = ref([]); // La lista que se muestra, basada en los filtros
const loading = ref(true);
const error = ref(null);
let pollingInterval = null; // Variable para almacenar el ID del temporizador de sondeo

// Estados para los filtros
const searchTerm = ref("");
const filterUnidadAcademica = ref("");
const filterDesafioInteres = ref("");

const API_URL_DESAFIO = import.meta.env.VITE_API_URL_DESAFIOS;

// Propiedades computadas para obtener opciones únicas para los selects
const uniqueUnidadesAcademicas = computed(() => {
    const unidades = new Set(
        desafios.value.map((desafio) => desafio.unidadAcademica).filter(Boolean),
    );
    desafios.value.forEach((desafio) => {
        if (desafio.unidadAcademica === "Otra..." && desafio.otraUnidad) {
            unidades.add("Otra...");
        }
    });
    return Array.from(unidades).sort();
});

const uniqueDesafiosInteres = computed(() => {
    const intereses = new Set();
    desafios.value.forEach((desafio) => {
        if (desafio.desafioInteres) {
            if (Array.isArray(desafio.desafioInteres)) {
                desafio.desafioInteres.forEach((item) => intereses.add(item));
            } else {
                intereses.add(desafio.desafioInteres);
            }
        }
    });
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
        const filterValue = filterDesafiosInteres.value;
        tempDesafios = tempDesafios.filter((desafio) => {
            if (Array.isArray(desafio.desafioInteres)) {
                return desafio.desafioInteres.includes(filterValue);
            } else {
                return desafio.desafioInteres === filterValue;
            }
        });
    }

    filteredDesafios.value = tempDesafios;
};

// ** Nueva función para obtener y comparar datos (Polling) **
const fetchDataAndCompare = async () => {
    try {
        const response = await axios.get(API_URL_DESAFIO);
        const newData = response.data.data;

        if (JSON.stringify(desafios.value) !== JSON.stringify(newData)) {
            console.log("¡Datos actualizados detectados! Refrescando la lista.");
            desafios.value = newData; // Actualiza los datos principales con los nuevos
            applyFilters(); // Re-aplica los filtros para que el nuevo elemento se vea afectado
            error.value = null; // Limpia cualquier mensaje de error anterior
        }
    } catch (err) {
        console.error("Error al sondear la API para actualizar datos:", err);
        error.value = `Error al actualizar los datos de inscripciones a desafíos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_DESAFIO}) sea accesible. Detalles: ${err.message}`;
    } finally {
        if (loading.value) {
            loading.value = false;
        }
    }
};

// Función para limpiar filtros
const resetFilters = () => {
    searchTerm.value = "";
    filterUnidadAcademica.value = "";
    filterDesafioInteres.value = "";
    applyFilters(); // Vuelve a aplicar los filtros para mostrar todo
};

onMounted(async () => {
    loading.value = true; // Indicar que la carga inicial está en progreso
    await fetchDataAndCompare(); // Realiza la carga inicial inmediatamente

    // Inicia el sondeo cada 4 segundos
    pollingInterval = setInterval(fetchDataAndCompare, 4000); // 4000 ms = 4 segundos
});

onUnmounted(() => {
    // Limpia el temporizador de sondeo cuando el componente se desmonta
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
});
</script>

<style scoped>
/* Puedes añadir o ajustar estilos aquí para personalizar la apariencia de la lista */
.desafio-card ul {
    list-style-type: disc;
    /* Muestra un disco como viñeta. Puedes usar 'circle', 'square', 'none', etc. */
    margin-left: 20px;
    /* Indenta la lista para que se vea mejor */
    padding-left: 0;
    /* Asegura que no haya padding extra del navegador */
    margin-top: 5px;
    /* Pequeño espacio sobre la lista */
    margin-bottom: 5px;
    /* Pequeño espacio debajo de la lista */
}

.desafio-card ul li {
    margin-bottom: 3px;
    /* Espacio entre cada elemento de la lista */
}
</style>