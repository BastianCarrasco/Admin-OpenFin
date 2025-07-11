<template>
    <div>
        <div class="filters-section">
            <div class="filter-controls">
                <div class="filter-group">
                    <label for="search">Buscar por Nombre/Empresa:</label>
                    <input type="text" id="search" v-model="searchTerm" placeholder="Escribe para buscar..."
                        @input="applyFilters" />
                </div>

                <div class="filter-group">
                    <label for="areaTrabajo">Área de Trabajo:</label>
                    <select id="areaTrabajo" v-model="filterAreaTrabajo" @change="applyFilters">
                        <option value="">Todas</option>
                        <option v-for="area in uniqueAreasTrabajo" :key="area" :value="area">
                            {{ area }}
                        </option>
                    </select>
                </div>

                <!-- Descomentar y ajustar si decides reincorporar este filtro -->
                <!-- <div class="filter-group">
                    <label for="vinculoPUCV">Vínculo con PUCV:</label>
                    <select id="vinculoPUCV" v-model="filterVinculoPUCV" multiple @change="applyFilters">
                        <option v-for="vinculo in uniqueVinculosPUCV" :key="vinculo" :value="vinculo">
                            {{ vinculo }}
                        </option>
                    </select>
                </div> -->

                <div class="filter-group">
                    <label for="interesInfo">Interesado en +Info:</label>
                    <select id="interesInfo" v-model="filterInteresInfo" @change="applyFilters">
                        <option value="">Todos</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <button @click="resetFilters" class="reset-button">
                    Limpiar Filtros
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de empresas...</p>
        </div>

        <div v-else-if="filteredEmpresas.length" class="empresas-grid">
            <div v-for="empresa in filteredEmpresas" :key="empresa._id" class="empresa-card"
                @click="openModal(empresa)">
                <h3>{{ empresa.nombre }} {{ empresa.apellido }}</h3>
                <p>
                    <strong>Empresa/Organización:</strong>
                    {{ empresa.empresaOrganizacion }}
                </p>
                <div v-if="empresa.vinculoPUCV && empresa.vinculoPUCV.length">
                    <p>
                        <strong>Vínculo con PUCV:</strong>
                        {{ empresa.vinculoPUCV.join(", ") }}
                    </p>
                </div>
                <!-- Aquí puedes añadir un indicador de clic o más info si lo deseas -->
                <p class="click-info">Haz clic para más detalles</p>
            </div>
        </div>

        <p v-else class="no-data-message">
            No hay empresas registradas que coincidan con los filtros aplicados.
        </p>
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Componente Modal -->
        <EmpresaDetailModal :show="showModal" :empresa="selectedEmpresa" @close="closeModal" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import EmpresaDetailModal from "./Modal/EmpresaDetailModal.vue"; // Importa el nuevo componente modal

const empresas = ref([]); // Todos los datos cargados desde la API
const filteredEmpresas = ref([]); // La lista que se muestra, basada en los filtros
const loading = ref(true);
const error = ref(null);

// Estados para los filtros
const searchTerm = ref("");
const filterAreaTrabajo = ref("");
const filterVinculoPUCV = ref([]); // Array para selección múltiple
const filterInteresInfo = ref("");

// Estados para el Modal
const showModal = ref(false);
const selectedEmpresa = ref(null);

const API_URL_EMPRESAS = import.meta.env.VITE_API_URL_EMPRESAS;

// Propiedades computadas para obtener opciones únicas para los selects
const uniqueAreasTrabajo = computed(() => {
    const areas = new Set(
        empresas.value.map((emp) => emp.areaTrabajo).filter(Boolean),
    );
    return Array.from(areas).sort();
});

const uniqueVinculosPUCV = computed(() => {
    const vinculos = new Set();
    empresas.value.forEach((emp) => {
        if (Array.isArray(emp.vinculoPUCV)) {
            emp.vinculoPUCV.forEach((v) => vinculos.add(v));
        }
    });
    return Array.from(vinculos).sort();
});

// Función para abrir el modal
const openModal = (empresa) => {
    selectedEmpresa.value = empresa;
    showModal.value = true;
};

// Función para cerrar el modal
const closeModal = () => {
    showModal.value = false;
    selectedEmpresa.value = null; // Limpiar la empresa seleccionada
};

// Función para aplicar filtros
const applyFilters = () => {
    let tempEmpresas = empresas.value;

    // 1. Filtro por búsqueda (nombre, apellido, empresaOrganizacion)
    if (searchTerm.value) {
        const searchLower = searchTerm.value.toLowerCase();
        tempEmpresas = tempEmpresas.filter(
            (emp) =>
                (emp.nombre && emp.nombre.toLowerCase().includes(searchLower)) ||
                (emp.apellido &&
                    emp.apellido.toLowerCase().includes(searchLower)) ||
                (emp.empresaOrganizacion &&
                    emp.empresaOrganizacion.toLowerCase().includes(searchLower)),
        );
    }

    // 2. Filtro por Área de Trabajo
    if (filterAreaTrabajo.value) {
        tempEmpresas = tempEmpresas.filter(
            (emp) => emp.areaTrabajo === filterAreaTrabajo.value,
        );
    }

    // 3. Filtro por Vínculo con PUCV (si hay algo seleccionado)
    if (filterVinculoPUCV.value.length > 0) {
        tempEmpresas = tempEmpresas.filter((emp) =>
            emp.vinculoPUCV
                ? filterVinculoPUCV.value.some((fv) =>
                    emp.vinculoPUCV.includes(fv),
                )
                : false,
        );
    }

    // 4. Filtro por Interés en más información
    if (filterInteresInfo.value) {
        tempEmpresas = tempEmpresas.filter(
            (emp) => emp.interesInformacion === filterInteresInfo.value,
        );
    }

    filteredEmpresas.value = tempEmpresas;
};

// Función para limpiar filtros
const resetFilters = () => {
    searchTerm.value = "";
    filterAreaTrabajo.value = "";
    filterVinculoPUCV.value = [];
    filterInteresInfo.value = "";
    applyFilters(); // Vuelve a aplicar los filtros para mostrar todo
};

onMounted(async () => {
    try {
        const response = await axios.get(API_URL_EMPRESAS);
        empresas.value = response.data.data; // Carga todos los datos
        applyFilters(); // Aplica los filtros iniciales (mostrará todo al principio)
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS}) sea accesible.`;
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

/* Sección de Filtros */
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
    /* Altura mínima para selecciones múltiples */
    resize: vertical;
}

.reset-button {
    padding: 10px 20px;
    background-color: #384693;
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

/* Grid para tarjetas */
.empresas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    padding: 20px;
}

/* Estilo de la tarjeta individual */
.empresa-card {
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
    cursor: pointer;
    /* Añade cursor de puntero para indicar que es clickeable */
}

.empresa-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.empresa-card h3 {
    color: #34495e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.6em;
    border-bottom: 2px solid #42b983;
    padding-bottom: 5px;
}

.empresa-card p {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #555;
    font-size: 0.95em;
    text-align: left;
}

.empresa-card p strong {
    color: #2c3e50;
    margin-right: 5px;
}

.click-info {
    font-size: 0.85em;
    color: #42b983;
    text-align: center;
    margin-top: 15px;
    font-style: italic;
}
</style>