<template>
    <div>
        <div class="filters-section">
            <div class="filter-controls">
                <div class="filter-group">
                    <label for="sortOrder">Ordenar por Fecha de Registro:</label>
                    <select id="sortOrder" v-model="sortOrder" @change="applySorting">
                        <option value="desc">Más Recientes Primero</option>
                        <option value="asc">Más Antiguos Primero</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Cargando datos de empresas...</p>
        </div>

        <div v-else-if="sortedEmpresas.length" class="empresas-grid">
            <div v-for="empresa in sortedEmpresas" :key="empresa._id" class="empresa-card" @click="openModal(empresa)">
                <div class="card-header">
                    <div class="card-title-and-image">
                        <!-- Imagen/Link de la empresa (mantener este siempre visible en el header para el logo) -->
                        <a v-if="empresa.link && isImageLink(empresa.link)" :href="empresa.link" target="_blank"
                            rel="noopener noreferrer" class="card-company-image-container" @click.stop>
                            <img :src="empresa.link" :alt="empresa.empresaOrganizacion + ' logo'"
                                class="card-company-image" />
                        </a>
                        <a v-else-if="empresa.link" :href="empresa.link" target="_blank" rel="noopener noreferrer"
                            class="card-external-link-icon" @click.stop>
                            🔗
                        </a>
                        <!-- Nombre de la empresa -->
                        <h3 class="card-title">{{ empresa.empresaOrganizacion }}</h3>
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
            No hay empresas registradas disponibles.
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

const showModal = ref(false);
const selectedEmpresa = ref(null);

const API_URL_EMPRESAS = import.meta.env.VITE_API_URL_EMPRESAS;

// Propiedad computada para las empresas ordenadas
const sortedEmpresas = computed(() => {
    let tempEmpresas = [...empresas.value]; // Crear una copia para no modificar el original

    // Ordenar por fecha de creación
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

// Función para aplicar el ordenamiento (simplemente re-evalúa computed)
const applySorting = () => {
    // El computed `sortedEmpresas` se recalculará automáticamente
    // cuando `sortOrder.value` cambie, por lo que esta función
    // no necesita hacer nada más allá de provocar un cambio si fuera necesario,
    // pero @change ya lo hace. La dejaremos para claridad si en el futuro se añade más lógica.
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
        // Asegúrate de que los datos tengan 'createdAt' si vas a ordenar por ello.
        // Si 'createdAt' no está directamente en la respuesta, podrías necesitar un mapeo.
        empresas.value = response.data.map(emp => ({
            ...emp,
            // Si el 'link' puede venir en 'front.link' o a nivel raíz, consolida aquí
            link: emp.link || (emp.front ? emp.front.link : null),
            createdAt: emp.createdAt || new Date(), // Asignar una fecha si no existe para evitar errores en el ordenamiento
        }));
        // applySorting() no es estrictamente necesario aquí ya que sortedEmpresas es computed.
        // Pero lo llamamos para claridad inicial si se requiere alguna manipulación adicional.
        applySorting();
    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de empresas. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
});
</script>
<style scoped>
.card-main-content p {
    margin-bottom: 8px;
    color: #495057;
    font-size: 0.95em;
    /* Puedes ajustar este tamaño */
    line-height: 1.5;
    /* max-height: 4.5em; /* Limitar altura para 3 líneas de texto, por ejemplo */
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    /* white-space: normal; */
    /* Asegura que el texto se envuelva */
}

/* Si quieres un estilo específico para "No hay contexto..." */
.card-main-content p em {
    color: #888;
    font-size: 0.85em;
}
</style>