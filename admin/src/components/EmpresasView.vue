<template>
    <div>
        <div class="filters-section">
            <!-- Contenedor para el título y subtítulo -->
            <div class="page-header-content">
                <h1 class="admin-page-title">Panel de Administración de Empresas</h1>
                <p class="admin-page-description">
                    Esta sección le permite visualizar los detalles de cada empresa registrada
                    y monitorear el progreso y estado de validación de los desafíos que han
                    presentado.
                </p>
            </div>

            <!-- Controles de filtro (ordenar por fecha y validado) -->
            <div class="filter-controls">
                <div class="filter-group">
                    <label for="sortOrder">Ordenar por Fecha de Registro:</label>
                    <select id="sortOrder" v-model="sortOrder" @change="applySorting">
                        <option value="desc">Más Recientes Primero</option>
                        <option value="asc">Más Antiguos Primero</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="validationFilter">Estado de Validación:</label>
                    <select id="validationFilter" v-model="validationFilter" @change="applyFiltering">
                        <option value="all">Todos</option>
                        <option value="validated">Validados</option>
                        <option value="not-validated">No Validados</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de empresas...</p>
        </div>

        <div v-else-if="filteredAndSortedEmpresas.length" class="empresas-grid">
            <div v-for="empresa in filteredAndSortedEmpresas" :key="empresa._id" class="empresa-card"
                @click="openModal(empresa)">

                <!-- Indicador de validación como barra en la parte superior -->
                <div :class="['validation-bar', { 'is-validated': empresa.validado }]">
                    <span>{{ empresa.validado ? 'DESAFÍO VALIDADO PARA OPENFIN' : 'DESAFÍO NO VALIDADO' }}</span>
                </div>

                <div class="card-header">
                    <div class="card-title-and-image">
                        <!-- Imagen/Link de la empresa (logo) -->
                        <a v-if="empresa.link && isImageLink(empresa.link)" :href="empresa.link" target="_blank"
                            rel="noopener noreferrer" class="card-company-image-container" @click.stop>
                            <img :src="empresa.link" :alt="empresa.nombreEmpresa + ' logo'"
                                class="card-company-image" />
                        </a>
                        <a v-else-if="empresa.link" :href="empresa.link" target="_blank" rel="noopener noreferrer"
                            class="card-external-link-icon" @click.stop>
                            🔗
                        </a>
                        <!-- Nombre de la empresa -->
                        <h3 class="card-title">{{ empresa.nombreEmpresa }}</h3>
                    </div>

                    <!-- Fecha de registro -->
                    <p class="card-date" v-if="empresa.createdAt">
                        <small> Fecha de registro: {{ new Date(empresa.createdAt).toLocaleDateString() }}</small>
                    </p>
                </div>

                <!-- CONTENIDO PRINCIPAL DE LA TARJETA SIMPLIFICADO -->
                <div class="card-main-content">
                    <p v-if="empresa.actividadesServicios">
                        <strong>Descripcion:</strong> {{ truncateText(empresa.actividadesServicios, 100) }}
                    </p>
                    <p v-else-if="empresa.front && empresa.front.contexto">
                        <strong>Contexto:</strong> {{ truncateText(empresa.front.contexto, 100) }}
                    </p>
                    <p v-else>
                        <em>No hay contexto ni actividades definidas.</em>
                    </p>
                </div>

                <p class="click-info">Haz clic para más detalles</p>
            </div>
        </div>

        <p v-else class="no-data-message">
            No hay empresas registradas disponibles que cumplan con los filtros.
        </p>
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Componente Modal -->
        <EmpresaDetailModal :show="showModal" :empresa="selectedEmpresa" @close="closeModal" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import EmpresaDetailModal from "./Modal/EmpresaDetailModal.vue";
import '../assets/empresas.css';

const empresas = ref([]); // Contiene todos los datos sin filtrar
const loading = ref(true);
const error = ref(null);

const sortOrder = ref("desc"); // 'asc' para ascendente, 'desc' para descendente
const validationFilter = ref("all"); // 'all', 'validated', 'not-validated'

const showModal = ref(false);
const selectedEmpresa = ref(null);

const API_URL_EMPRESAS = import.meta.env.VITE_API_URL_EMPRESAS;

// Propiedad computada para las empresas FILTRADAS Y ORDENADAS
const filteredAndSortedEmpresas = computed(() => {
    let tempEmpresas = [...empresas.value]; // Crear una copia para no modificar el original

    // 1. Aplicar filtro de validación
    if (validationFilter.value === "validated") {
        tempEmpresas = tempEmpresas.filter(emp => emp.validado);
    } else if (validationFilter.value === "not-validated") {
        tempEmpresas = tempEmpresas.filter(emp => !emp.validado);
    }

    // 2. Aplicar ordenamiento por fecha de creación
    tempEmpresas.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        if (sortOrder.value === "asc") {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });

    return tempEmpresas;
});


const openModal = (empresa) => {
    selectedEmpresa.value = empresa;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedEmpresa.value = null;
};

// Funciones para aplicar el ordenamiento/filtro (solo provocan que computed se re-evalúe)
const applySorting = () => {
    // `filteredAndSortedEmpresas` se recalculará automáticamente
};
const applyFiltering = () => {
    // `filteredAndSortedEmpresas` se recalculará automáticamente
};


// Función para truncar texto
const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};


const isImageLink = (url) => {
    if (!url || typeof url !== 'string') return false;

    // 1. Comprobar si es una Data URI (base64)
    if (url.startsWith('data:image/')) {
        return true;
    }

    // 2. Comprobar si es una URL normal con extensión de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerCaseUrl = url.toLowerCase();
    // También consideramos si el link incluye una extensión seguida de un '?' para parámetros de query
    return imageExtensions.some(ext => lowerCaseUrl.endsWith(ext) || lowerCaseUrl.includes(ext + "?"));
};


onMounted(async () => {
    try {
        const response = await axios.get(API_URL_EMPRESAS);
        empresas.value = response.data.map(emp => ({
            ...emp,
            link: emp.link || (emp.front ? emp.front.link : null),
            createdAt: emp.createdAt || new Date(), // Asignar una fecha si no existe para evitar errores en el ordenamiento
        }));
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>
<style scoped>
/* --- Base y Reusable Styles --- */
.empresa-card {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    overflow: hidden;
    /* Importante para que la barra de validación con border-radius se vea bien */
}

.empresa-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* --- Validation Bar --- */
.validation-bar {
    width: 100%;
    padding: 6px 0;
    text-align: center;
    font-weight: bold;
    font-size: 0.85em;
    text-transform: uppercase;
    color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

/* Estilo para NO VALIDADO */
.validation-bar {
    background-color: #f44336;
    /* Rojo brillante */
}

/* Estilo para VALIDADO */
.validation-bar.is-validated {
    background-color: #4caf50;
    /* Verde brillante */
}

/* --- Card Header --- */
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 15px;
    /* Ajustado para espacio debajo de la barra */
    margin-bottom: 10px;
}

.card-title-and-image {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-grow: 1;
}

.card-company-image-container {
    flex-shrink: 0;
    /* Evita que la imagen se encoja */
}

.card-company-image {
    width: 40px;
    /* Tamaño fijo para el logo */
    height: 40px;
    object-fit: contain;
    /* Asegura que la imagen se vea bien dentro del contenedor */
    border-radius: 4px;
}

.card-external-link-icon {
    font-size: 1.5em;
    /* Tamaño para el ícono de link */
    color: #007bff;
    text-decoration: none;
}

.card-title {
    margin: 0;
    flex-grow: 1;
    min-width: 100px;
    font-size: 1.3em;
    /* Ajustado para mejor equilibrio en la tarjeta */
    color: #343a40;
}

.card-date {
    margin: 0;
    white-space: nowrap;
    font-size: 0.8em;
    color: #6c757d;
}

/* --- Card Main Content --- */
.card-main-content {
    padding: 0 15px 15px;
    /* Padding horizontal y espacio abajo */
}

.card-main-content p {
    margin-bottom: 8px;
    color: #495057;
    font-size: 0.95em;
    line-height: 1.5;
}

.card-main-content p em {
    color: #888;
    font-size: 0.85em;
}

/* --- Click Info --- */
.click-info {
    padding: 10px 15px 15px;
    font-size: 0.9em;
    color: #007bff;
    text-align: center;
    border-top: 1px solid #eee;
    /* Separador visual */
    margin-top: 10px;
    /* Espacio arriba del separador */
}

/* --- Página de Administración - Encabezado y Título/Subtítulo --- */

/* Contenedor principal del encabezado (filters-section contiene todo) */
.filters-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 30px;
    padding: 25px 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Contenedor para el título y subtítulo */
.page-header-content {
    flex: 1;
    margin-right: 20px;
    min-width: 300px;
}

/* Controles de filtro (se posicionarán a la derecha) */
.filter-controls {
    display: flex;
    flex-wrap: wrap;
    /* Permite que los grupos de filtro se envuelvan */
    gap: 20px;
    /* Espacio entre los grupos de filtro */
    align-items: center;
    flex-shrink: 0;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}


/* Estilos para el Título Principal (H1) */
.admin-page-title {
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 700;
    line-height: 1.2;
}

/* Estilos para el Subtítulo/Descripción (P) */
.admin-page-description {
    font-size: 1.1em;
    color: #555;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.5;
    max-width: 800px;
}

/* Estilos para el label y select en general */
label {
    font-weight: 600;
    color: #333;
}

select {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: #fff;
    font-size: 1em;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-in-out;
}

select:hover {
    border-color: #80bdff;
}

select:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}


/* --- Mensajes de estado (Loading, No Data, Error) --- */
.loading-message,
.no-data-message,
.error-message {
    text-align: center;
    padding: 20px;
    font-size: 1.1em;
    color: #555;
    background-color: #f0f0f0;
    border-radius: 8px;
    margin-top: 20px;
}

.error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
}


/* --- Grid de Empresas --- */
.empresas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    padding: 20px 0;
}


/* --- Media Queries para Responsividad General --- */
@media (max-width: 992px) {
    .admin-page-title {
        font-size: 2.2em;
    }

    .admin-page-description {
        font-size: 1em;
    }

    .filters-section {
        padding: 20px 25px;
    }

    .empresas-grid {
        gap: 20px;
    }

    .card-title {
        font-size: 1.2em;
    }
}

@media (max-width: 768px) {
    .filters-section {
        flex-direction: column;
        align-items: flex-start;
    }

    .page-header-content {
        margin-right: 0;
        margin-bottom: 20px;
        width: 100%;
    }

    .filter-controls {
        width: 100%;
        justify-content: flex-start;
        flex-direction: column;
        /* Apila los grupos de filtro en móviles */
        align-items: flex-start;
        gap: 15px;
        /* Espacio entre los grupos de filtro apilados */
    }

    .filter-group {
        width: 100%;
        /* Asegura que cada grupo ocupe todo el ancho */
        justify-content: space-between;
        /* Etiqueta a la izquierda, select a la derecha */
    }


    .admin-page-title {
        font-size: 2em;
        margin-bottom: 8px;
    }

    .admin-page-description {
        font-size: 0.95em;
    }

    .empresas-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
}

@media (max-width: 480px) {
    .admin-page-title {
        font-size: 1.8em;
    }

    .admin-page-description {
        font-size: 0.9em;
    }

    .filters-section {
        padding: 10px 15px;
    }

    .filter-group {
        flex-direction: column;
        /* Apila label y select en el grupo */
        align-items: flex-start;
        gap: 5px;
    }

    label,
    select {
        width: 100%;
        /* Etiqueta y select ocupan todo el ancho */
    }

    .empresa-card {
        margin: 0 auto;
    }

    .empresas-grid {
        grid-template-columns: 1fr;
        padding: 10px 5px;
    }
}
</style>