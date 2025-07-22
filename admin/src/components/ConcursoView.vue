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
import { ref, onMounted, onUnmounted, computed } from "vue"; // Importa onUnmounted
import axios from "axios";
import '../assets/concurso.css'

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
            (desafio) => desafio.desafioInteres === filterDesafiosInteres.value,
        );
    }

    filteredDesafios.value = tempDesafios;
};

// ** Nueva función para obtener y comparar datos (Polling) **
const fetchDataAndCompare = async () => {
    try {
        const response = await axios.get(API_URL_DESAFIO);
        const newData = response.data.data;

        // Clonar los datos actuales para evitar mutaciones directas y hacer una comparación limpia
        const currentData = JSON.parse(JSON.stringify(desafios.value));

        // Comparar los arrays. Una forma simple es serializarlos a JSON.
        // Si los arrays son grandes y el orden importa, esta es una buena forma.
        // Si el orden no importa, podrías necesitar una lógica de comparación más compleja.
        if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
            console.log("¡Datos actualizados detectados! Refrescando la lista.");
            desafios.value = newData; // Actualiza los datos principales con los nuevos
            applyFilters(); // Re-aplica los filtros para que el nuevo elemento se vea afectado
            error.value = null; // Limpia cualquier mensaje de error anterior
        }
    } catch (err) {
        console.error("Error al sondear la API para actualizar datos:", err);
        error.value = `Error al actualizar los datos de inscripciones a desafíos. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_DESAFIO}) sea accesible. Detalles: ${err.message}`;
    } finally {
        // Si 'loading' solo es para la carga inicial, se podría quitar de aquí
        // o usar otra variable para indicar que el polling está en curso.
        // Para la carga inicial, nos aseguramos de que se apague.
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