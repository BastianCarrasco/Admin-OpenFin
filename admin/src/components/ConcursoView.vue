<template>
    <div class="concurso-view">
        <div v-if="loading" class="loading-message">
            <p>Cargando datos de desafíos de empresas...</p>
        </div>

        <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="empresasCardsData.length" class="main-content-grid">
            <!-- Columna Izquierda: Lista de Empresas (Botones) -->
            <div class="empresas-list">
                <h3 class="list-title">Empresas Participantes</h3>
                <div class="button-group">
                    <button v-for="empresa in empresasCardsData" :key="empresa._id" :class="[
                        'empresa-list-button',
                        { 'active': selectedEmpresa && selectedEmpresa._id === empresa._id },
                    ]" @click="selectEmpresa(empresa)">
                        {{ empresa.empresaOrganizacion }}
                    </button>
                </div>
            </div>

            <!-- Columna Derecha: Detalles de la Empresa Seleccionada -->
            <div class="empresa-detail-container">
                <div class="empresa-detail-card" v-if="selectedEmpresa">
                    <!-- Botones de Acción (Editar/Guardar/Cancelar/Eliminar) -->
                    <div class="action-buttons-container">
                        <button v-if="!isEditing" @click="startEditing" class="action-button edit-button">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button v-if="isEditing" @click="saveChanges" class="action-button save-button"
                            :disabled="loading">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button v-if="isEditing" @click="cancelEditing" class="action-button cancel-button"
                            :disabled="loading">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <!-- BOTÓN DE ELIMINAR AGREGADO AQUÍ -->
                        <button @click="deleteEmpresa" class="action-button delete-button"
                            :disabled="loading || isEditing">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                    </div>

                    <!-- Modo de Visualización (Por Defecto) -->
                    <div v-if="!isEditing" class="view-mode">
                        <!-- EL cmf-challenge-header AHORA CONTIENE EL H1 Y EL LOGO -->
                        <div class="cmf-challenge-header" v-if="selectedEmpresa">
                            <div class="cmf-header-content">
                                <h1>DESAFÍO {{ selectedEmpresa.empresaOrganizacion }}</h1>
                                <img v-if="selectedEmpresa.link" :src="selectedEmpresa.link"
                                    :alt="selectedEmpresa.empresaOrganizacion + ' logo'" class="cmf-company-logo" />
                            </div>
                        </div>

                        <!-- CONTENEDOR FLEX PARA CONTEXTO Y REPORTE -->
                        <div class="cmf-context-report-container">

                            <div class="cmf-section" v-if="selectedEmpresa.front.contexto">
                                <h2 class="section-title">Contexto</h2>
                                <p class="cmf-context-text">{{ selectedEmpresa.front.contexto }}</p>
                            </div>

                            <div class="cmf-section" v-if="
                                selectedEmpresa.front.extra &&
                                selectedEmpresa.front.extra.datos &&
                                selectedEmpresa.front.extra.datos.length
                            ">
                                <h2 class="section-title">
                                    {{ selectedEmpresa.front.extra.titulo || 'Reporte de las empresas' }}
                                </h2>
                                <ol class="cmf-report-list">
                                    <li v-for="(dato, i) in selectedEmpresa.front.extra.datos" :key="i">
                                        {{ dato }}
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <!-- FIN CONTENEDOR FLEX -->

                        <div class="cmf-challenges-section">
                            <h2 class="section-title-blue">Desafíos para {{ selectedEmpresa.empresaOrganizacion }}
                            </h2>
                            <p class="cmf-main-challenge-description" v-if="selectedEmpresa.front.desafio_Texto">
                                {{ selectedEmpresa.front.desafio_Texto }}
                            </p>

                            <!-- Mostrar Desafío 1 si existe -->
                            <div v-if="
                                selectedEmpresa.front.desafio_1 &&
                                selectedEmpresa.front.desafio_1.titulo
                            " class="cmf-challenge-box">
                                <h3 class="cmf-challenge-title"> Desafío 1: {{ selectedEmpresa.front.desafio_1.titulo }}
                                </h3>
                                <p class="cmf-challenge-objective">
                                    {{ selectedEmpresa.front.desafio_1.descripcion }}
                                </p>
                            </div>
                            <!-- Mostrar Desafío 2 si existe -->
                            <div v-if="
                                selectedEmpresa.front.desafio_2 &&
                                selectedEmpresa.front.desafio_2.titulo
                            " class="cmf-challenge-box">
                                <h3 class="cmf-challenge-title"> Desafío 2: {{ selectedEmpresa.front.desafio_2.titulo }}
                                </h3>
                                <p class="cmf-challenge-objective">
                                    {{ selectedEmpresa.front.desafio_2.descripcion }}
                                </p>
                            </div>
                            <!-- Mostrar Desafío 3 si existe -->
                            <div v-if="
                                selectedEmpresa.front.desafio_3 &&
                                selectedEmpresa.front.desafio_3.titulo
                            " class="cmf-challenge-box">
                                <h3 class="cmf-challenge-title"> Desafío 3: {{ selectedEmpresa.front.desafio_3.titulo }}
                                </h3>
                                <p class="cmf-challenge-objective">
                                    {{ selectedEmpresa.front.desafio_3.descripcion }}
                                </p>
                            </div>
                        </div>

                    </div>

                    <!-- Modo de Edición (Formulario) -->
                    <div v-else class="edit-mode">
                        <form @submit.prevent="saveChanges" class="edit-form">
                            <h4 class="form-section-title">Información General</h4>
                            <div class="form-group">
                                <label for="empresaOrganizacion">Nombre de la Empresa:</label>
                                <input type="text" id="empresaOrganizacion"
                                    v-model="editableEmpresaData.empresaOrganizacion" required />
                            </div>
                            <div class="form-group">
                                <label for="actividadesServicios">Actividades/Servicios:</label>
                                <textarea id="actividadesServicios"
                                    v-model="editableEmpresaData.actividadesServicios"></textarea>
                            </div>

                            <div class="form-group">
                                <label for="link-logo">URL del Logo:</label>
                                <input type="text" id="link-logo" v-model="editableEmpresaData.link" />
                            </div>

                            <!-- Edición del Desafío Principal -->
                            <h4 class="form-section-title">Desafío Principal</h4>
                            <div class="form-group">
                                <label for="desafio_Texto">Desafío Principal:</label>
                                <textarea id="desafio_Texto" v-model="editableEmpresaData.front.desafio_Texto"
                                    rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="contexto">Contexto del Desafío:</label>
                                <textarea id="contexto" v-model="editableEmpresaData.front.contexto"
                                    rows="3"></textarea>
                            </div>

                            <!-- Edición de Datos Extra (simplificado, puedes expandir para añadir/quitar ítems) -->
                            <h4 class="form-section-title">Detalles Adicionales (Extra)</h4>
                            <div class="form-group">
                                <label for="extra-titulo">Título de Datos Extra:</label>
                                <input type="text" id="extra-titulo" v-model="editableEmpresaData.front.extra.titulo" />
                            </div>
                            <div class="form-group">
                                <label for="extra-datos">Datos Extra (separados por nueva línea):</label>
                                <textarea id="extra-datos" v-model="editableEmpresaData.front.extra._datosString"
                                    rows="5"></textarea>
                                <!-- Campo oculto o computed para manejar array de strings -->
                            </div>

                            <!-- Edición de Desafíos Adicionales -->
                            <h4 class="form-section-title">Desafíos Específicos</h4>
                            <div class="challenge-edit-section">
                                <h5 class="challenge-edit-title">Desafío 1</h5>
                                <div class="form-group">
                                    <label for="desafio1_titulo">Título:</label>
                                    <input type="text" id="desafio1_titulo"
                                        v-model="editableEmpresaData.front.desafio_1.titulo" />
                                </div>
                                <div class="form-group">
                                    <label for="desafio1_descripcion">Descripción:</label>
                                    <textarea id="desafio1_descripcion"
                                        v-model="editableEmpresaData.front.desafio_1.descripcion" rows="3"></textarea>
                                </div>
                            </div>

                            <div class="challenge-edit-section">
                                <h5 class="challenge-edit-title">Desafío 2</h5>
                                <div class="form-group">
                                    <label for="desafio2_titulo">Título:</label>
                                    <input type="text" id="desafio2_titulo"
                                        v-model="editableEmpresaData.front.desafio_2.titulo" />
                                </div>
                                <div class="form-group">
                                    <label for="desafio2_descripcion">Descripción:</label>
                                    <textarea id="desafio2_descripcion"
                                        v-model="editableEmpresaData.front.desafio_2.descripcion" rows="3"></textarea>
                                </div>
                            </div>

                            <div class="challenge-edit-section">
                                <h5 class="challenge-edit-title">Desafío 3</h5>
                                <div class="form-group">
                                    <label for="desafio3_titulo">Título:</label>
                                    <input type="text" id="desafio3_titulo"
                                        v-model="editableEmpresaData.front.desafio_3.titulo" />
                                </div>
                                <div class="form-group">
                                    <label for="desafio3_descripcion">Descripción:</label>
                                    <textarea id="desafio3_descripcion"
                                        v-model="editableEmpresaData.front.desafio_3.descripcion" rows="3"></textarea>
                                </div>
                                <div class="form-group validation-group">
                                    <div class="checkbox-wrapper">
                                        <input type="checkbox" id="validar" v-model="editableEmpresaData.validar" />
                                        <label for="validar">¿Validado para Concurso?</label>
                                    </div>
                                    <span class="help-text">
                                        Al marcar esta casilla, confirmas que la empresa cumple con todos los requisitos
                                        para participar en el concurso. Los datos editados aparecerán en el OpenFin una
                                        vez guardados los cambios.
                                    </span>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="submit-form-button" :disabled="loading">
                                    Guardar Cambios
                                </button>
                                <button type="button" @click="cancelEditing" class="cancel-form-button"
                                    :disabled="loading">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- JSON en bruto para depuración -->
                    <!-- <details class="debug-json">
                        <summary>Ver JSON en bruto</summary>
                        <pre><code>{{ JSON.stringify(selectedEmpresa, null, 2) }}</code></pre>
                    </details> -->
                </div>
                <div v-else class="no-selection-message">
                    <p>Selecciona una empresa de la lista para ver sus desafíos detallados.</p>
                </div>
            </div>
        </div>

        <p v-else class="no-data-message">
            No hay desafíos de empresas registrados o validados.
        </p>
    </div>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import '../assets/concurso.css'; // Importación de tu archivo CSS externo

const empresasCardsData = ref([]);
const selectedEmpresa = ref(null);
const loading = ref(true);
const error = ref(null);

const isEditing = ref(false);
const editableEmpresaData = ref({});

const API_URL_EMPRESAS_DESAFIOS =
    "https://bun-mongo-production.up.railway.app/api/empresas/empresas-desafios-ON";
const API_URL_UPDATE_BASE =
    "https://bun-mongo-production.up.railway.app/api/empresas/inscripcion";
const API_URL_DELETE_BASE =
    "https://bun-mongo-production.up.railway.app/api/empresas/inscripcion"; // La misma URL base para DELETE

const fetchEmpresasForCards = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await fetch(API_URL_EMPRESAS_DESAFIOS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();

        const processedData = rawData.map((emp) => {
            if (emp._id && typeof emp._id === "object" && emp._id.$oid) {
                emp._id = emp._id.$oid;
            } else if (emp._id) {
                emp._id = String(emp._id);
            }

            // Asegurarse de que las estructuras anidadas existan para v-if y v-model en la vista
            emp.front = emp.front || {};
            emp.front.extra = emp.front.extra || {};
            emp.front.extra.datos = emp.front.extra.datos || [];
            emp.front.desafio_1 = emp.front.desafio_1 || {};
            emp.front.desafio_2 = emp.front.desafio_2 || {};
            emp.front.desafio_3 = emp.front.desafio_3 || {};

            // Propiedad temporal para el textarea de datos extra
            emp.front.extra._datosString = emp.front.extra.datos.join("\n");
            return emp;
        });

        empresasCardsData.value = processedData;

        // Si la empresa seleccionada actualmente ya no existe en los datos recién cargados,
        // o si no hay ninguna empresa seleccionada y hay datos disponibles, selecciona la primera.
        if (processedData.length > 0) {
            if (!selectedEmpresa.value || !processedData.some(emp => emp._id === selectedEmpresa.value._id)) {
                selectedEmpresa.value = processedData[0];
            }
        } else {
            selectedEmpresa.value = null; // No hay empresas, deseleccionar
        }

    } catch (err) {
        console.error("Error al cargar empresas:", err);
        error.value = `Error al cargar los datos de desafíos de empresas: ${err.message}. Asegúrate de que el backend esté funcionando correctamente y que la URL (${API_URL_EMPRESAS_DESAFIOS}) sea accesible.`;
    } finally {
        loading.value = false;
    }
};

const selectEmpresa = (empresa) => {
    selectedEmpresa.value = empresa;
    isEditing.value = false;
    editableEmpresaData.value = {};
};

const startEditing = () => {
    if (selectedEmpresa.value) {
        const copy = JSON.parse(JSON.stringify(selectedEmpresa.value));

        copy.front = copy.front || {};
        copy.front.extra = copy.front.extra || {};
        copy.front.extra.datos = copy.front.extra.datos || [];
        copy.front.desafio_1 = copy.front.desafio_1 || {};
        copy.front.desafio_2 = copy.front.desafio_2 || {};
        copy.front.desafio_3 = copy.front.desafio_3 || {};

        copy.front.extra._datosString = copy.front.extra.datos.join("\n");

        editableEmpresaData.value = {
            _id: copy._id, // Necesario para la URL del PUT
            empresaOrganizacion: copy.empresaOrganizacion,
            actividadesServicios: copy.actividadesServicios,
            validar: copy.validar,
            link: copy.link, // URL del logo
            front: {
                contexto: copy.front.contexto,
                extra: {
                    titulo: copy.front.extra.titulo,
                    _datosString: copy.front.extra._datosString, // Propiedad temporal
                },
                desafio_Texto: copy.front.desafio_Texto,
                desafio_1: {
                    titulo: copy.front.desafio_1.titulo,
                    descripcion: copy.front.desafio_1.descripcion,
                },
                desafio_2: {
                    titulo: copy.front.desafio_2.titulo,
                    descripcion: copy.front.desafio_2.descripcion,
                },
                desafio_3: {
                    titulo: copy.front.desafio_3.titulo,
                    descripcion: copy.front.desafio_3.descripcion,
                },
            },
        };
        isEditing.value = true;
    }
};

const cancelEditing = () => {
    isEditing.value = false;
    editableEmpresaData.value = {};
};

const saveChanges = async () => {
    if (!editableEmpresaData.value || !editableEmpresaData.value._id) {
        console.error("No hay empresa seleccionada o ID para actualizar.");
        error.value = "Error: No se puede guardar sin una empresa seleccionada.";
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const url = `${API_URL_UPDATE_BASE}/${editableEmpresaData.value._id}`;

        const dataToSend = {
            empresaOrganizacion: editableEmpresaData.value.empresaOrganizacion,
            actividadesServicios: editableEmpresaData.value.actividadesServicios,
            validar: editableEmpresaData.value.validar,
            link: editableEmpresaData.value.link,
            interesInformacion: true, // Asumimos true por defecto si no se edita
            front: {
                contexto: editableEmpresaData.value.front.contexto,
                extra: {
                    titulo: editableEmpresaData.value.front.extra.titulo,
                    datos: editableEmpresaData.value.front.extra._datosString
                        .split("\n")
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0),
                },
                desafio_Texto: editableEmpresaData.value.front.desafio_Texto,
                desafio_1: {
                    titulo: editableEmpresaData.value.front.desafio_1.titulo,
                    descripcion: editableEmpresaData.value.front.desafio_1.descripcion,
                },
                desafio_2: {
                    titulo: editableEmpresaData.value.front.desafio_2.titulo,
                    descripcion: editableEmpresaData.value.front.desafio_2.descripcion,
                },
                desafio_3: {
                    titulo: editableEmpresaData.value.front.desafio_3.titulo,
                    descripcion: editableEmpresaData.value.front.desafio_3.descripcion,
                },
            },
        };

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        let responseData = null;
        let isJson = false;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            try {
                responseData = await response.json();
                isJson = true;
            } catch (jsonErr) {
                console.warn("La respuesta se declaró JSON, pero no se pudo parsear:", jsonErr);
                responseData = await response.text();
            }
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            let errorMessage = `Error HTTP ${response.status}: ${response.statusText}.`;
            if (responseData) {
                if (isJson && responseData.message) {
                    errorMessage += ` Mensaje: ${responseData.message}`;
                } else if (!isJson) {
                    errorMessage += ` Respuesta del servidor: ${responseData.substring(0, 200)}...`;
                } else {
                    errorMessage += ` Respuesta: ${JSON.stringify(responseData)}`;
                }
            }
            throw new Error(errorMessage);
        }

        const updatedData = isJson ? responseData : dataToSend;

        if (updatedData) {
            updatedData.front = updatedData.front || {};
            updatedData.front.extra = updatedData.front.extra || {};
            updatedData.front.extra.datos = updatedData.front.extra.datos || [];
            updatedData.front.extra._datosString = updatedData.front.extra.datos.join("\n");
        } else {
            console.warn("Respuesta de PUT vacía o no JSON, recargando datos completos.");
            await fetchEmpresasForCards();
            alert("¡Empresa actualizada con éxito! (Se recargaron los datos)");
            isEditing.value = false;
            editableEmpresaData.value = {};
            loading.value = false;
            return;
        }

        const index = empresasCardsData.value.findIndex(
            (emp) => emp._id === selectedEmpresa.value._id,
        );
        if (index !== -1) {
            empresasCardsData.value[index] = updatedData;
            selectedEmpresa.value = updatedData;
        }

        isEditing.value = false;
        editableEmpresaData.value = {};

        alert("¡Empresa actualizada con éxito!");
    } catch (err) {
        console.error("Error al guardar cambios:", err);
        error.value = `Error al actualizar la empresa: ${err.message}. Por favor, inténtalo de nuevo.`;
    } finally {
        loading.value = false;
    }
};


// NUEVA FUNCIÓN PARA ELIMINAR EMPRESA
const deleteEmpresa = async () => {
    if (!selectedEmpresa.value || !selectedEmpresa.value._id) {
        alert("No hay empresa seleccionada para eliminar.");
        return;
    }

    const confirmDelete = confirm(
        `¿Estás seguro de que quieres eliminar la empresa "${selectedEmpresa.value.empresaOrganizacion}"? Esta acción es irreversible.`,
    );

    if (!confirmDelete) {
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const url = `${API_URL_DELETE_BASE}/${selectedEmpresa.value._id}`;
        const response = await fetch(url, {
            method: "DELETE",
        });

        if (!response.ok) {
            let errorMessage = `Error HTTP ${response.status}: ${response.statusText}.`;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const responseData = await response.json();
                if (responseData.message) {
                    errorMessage += ` Mensaje: ${responseData.message}`;
                } else {
                    errorMessage += ` Respuesta: ${JSON.stringify(responseData)}`;
                }
            } else {
                errorMessage += ` Respuesta del servidor: ${await response.text()}`;
            }
            throw new Error(errorMessage);
        }

        alert(`Empresa "${selectedEmpresa.value.empresaOrganizacion}" eliminada con éxito.`);

        // Después de eliminar, recargar la lista y deseleccionar la empresa
        selectedEmpresa.value = null; // Deseleccionar
        await fetchEmpresasForCards(); // Volver a cargar la lista de empresas
    } catch (err) {
        console.error("Error al eliminar empresa:", err);
        error.value = `Error al eliminar la empresa: ${err.message}.`;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchEmpresasForCards();
});

watch(selectedEmpresa, (newValue) => {
    if (newValue) {
        isEditing.value = false;
        editableEmpresaData.value = {};
    }
});
</script>

<style scoped>
/* Añade estos estilos a tu archivo 'assets/concurso.css' */

/* Nuevo estilo para el botón de eliminar */
.delete-button {
    background-color: #dc3545;
    /* Rojo de Bootstrap */
    color: white;
    border: 1px solid #dc3545;
}

.delete-button:hover {
    background-color: #c82333;
    /* Rojo más oscuro al pasar el ratón */
    border-color: #bd2130;
}

/* Estilos para el nuevo contenedor de Contexto y Reporte (uno al lado del otro) */
.cmf-context-report-container {
    display: flex;
    gap: 30px;
    /* Espacio entre las dos columnas */
    margin-bottom: 30px;
    /* Mantener el margen inferior que solían tener las secciones */
    flex-wrap: wrap;
    /* Permitir que las columnas se apilen en pantallas pequeñas */
}

/* Ajustar los cmf-section dentro de este contenedor para que ocupen el ancho */
.cmf-context-report-container .cmf-section {
    flex: 1;
    /* Hace que cada sección intente ocupar el mismo espacio disponible */
    min-width: 300px;
    /* Asegura que no se hagan demasiado pequeños antes de envolverse */
    margin-bottom: 0;
    /* Reiniciar el margen inferior de .cmf-section para que el gap lo maneje */
}

/* Media query para pantallas pequeñas: las secciones se apilan */
@media (max-width: 768px) {
    .cmf-context-report-container {
        flex-direction: column;
        /* Apilar las secciones */
        gap: 20px;
    }

    .cmf-context-report-container .cmf-section {
        min-width: auto;
        /* Desactivar el min-width cuando se apilan */
        width: 100%;
    }
}

/* Añade estos estilos a tu archivo 'assets/concurso.css' */

/* ... (Tus estilos existentes) ... */

/* Ajustes para el cmf-challenge-header para contener título e imagen */
.cmf-challenge-header {
    background-color: #2b70f0;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    /* display: inline-block; <-- Eliminar o modificar si el contenido no se ajusta */
    font-size: 1.2em;
    font-weight: bold;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* Aseguramos que sea un contenedor flex para el título y el logo */
    display: flex;
    align-items: center;
    /* Alinea verticalmente el texto y la imagen */
    justify-content: space-between;
    /* Espacia el título y el logo */
}

.cmf-challenge-header h1 {
    margin: 0;
    font-size: 1.2em;
    color: white;
    flex-grow: 1;
    /* Permite que el título ocupe el espacio restante */
}

/* Contenedor explícito para el H1 y la Imagen, si prefieres más control */
.cmf-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    /* Ocupa todo el ancho del cmf-challenge-header */
}


.cmf-company-logo {
    max-height: 40px;
    /* Ajusta el tamaño máximo del logo */
    max-width: 100px;
    /* Ajusta el ancho máximo del logo */
    object-fit: contain;
    /* Asegura que la imagen se ajuste sin distorsionarse */
    margin-left: 20px;
    /* Espacio entre el título y el logo */
    background-color: white;
    /* Fondo blanco para logos con transparencia */
    padding: 5px;
    /* Un poco de padding para que el logo no toque los bordes */
    border-radius: 5px;
    /* Bordes ligeramente redondeados */
}

/* ... (El resto de tus estilos existentes) ... */

/* Estilos para el nuevo contenedor de Contexto y Reporte (uno al lado del otro) */
.cmf-context-report-container {
    display: flex;
    gap: 30px;
    /* Espacio entre las dos columnas */
    margin-bottom: 30px;
    /* Mantener el margen inferior que solían tener las secciones */
    flex-wrap: wrap;
    /* Permitir que las columnas se apilen en pantallas pequeñas */
}

/* Ajustar los cmf-section dentro de este contenedor para que ocupen el ancho */
.cmf-context-report-container .cmf-section {
    flex: 1;
    /* Hace que cada sección intente ocupar el mismo espacio disponible */
    min-width: 300px;
    /* Asegura que no se hagan demasiado pequeños antes de envolverse */
    margin-bottom: 0;
    /* Reiniciar el margen inferior de .cmf-section para que el gap lo maneje */
}

/* assets/concurso.css */

/* ... tus estilos existentes ... */

/* Estilos para el nuevo contenedor de validación */
.form-group.validation-group {
    margin-top: 25px;
    /* Más espacio arriba para destacarlo */
    margin-bottom: 25px;
    padding: 18px;
    /* Un poco más de padding */
    background-color: #eaf6ff;
    /* Un azul muy claro como fondo */
    border: 1px solid #a8d9ff;
    /* Borde azul suave */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Contenedor específico para el checkbox y su label para que estén en la misma línea */
.form-group.validation-group .checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    /* Espacio entre el checkbox/label y el texto de ayuda */
}

/* Estilos para el input[type="checkbox"] dentro de .validation-group */
.form-group.validation-group input[type="checkbox"] {
    /* Ocultar el checkbox nativo */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* Estilo del checkbox personalizado */
    width: 22px;
    /* Un poco más grande */
    height: 22px;
    border: 2px solid #007bff;
    border-radius: 5px;
    /* Bordes un poco más redondeados */
    background-color: #fff;
    cursor: pointer;
    margin-right: 12px;
    position: relative;
    outline: none;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0;
    /* Asegura que el checkbox no se encoja */
}

.form-group.validation-group input[type="checkbox"]:checked {
    background-color: #007bff;
    border-color: #007bff;
}

.form-group.validation-group input[type="checkbox"]:checked::before {
    content: '\2713';
    display: block;
    color: #fff;
    font-size: 16px;
    /* Tick un poco más grande */
    text-align: center;
    line-height: 20px;
    /* Ajuste para el nuevo tamaño */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.form-group.validation-group input[type="checkbox"]:hover {
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
    /* Sombra un poco más grande al hover */
}

/* Estilos para la etiqueta del checkbox dentro de .validation-group */
.form-group.validation-group label {
    font-weight: bold;
    color: #0056b3;
    /* Un azul más oscuro para la etiqueta */
    cursor: pointer;
    user-select: none;
    font-size: 1.1em;
    /* Ligeramente más grande */
}

/* Nuevo estilo para el texto de ayuda */
.form-group.validation-group .help-text {
    display: block;
    /* Asegura que el texto ocupe su propia línea */
    font-style: italic;
    /* Texto en cursiva */
    color: #000000;
    /* Un color gris más suave */
    font-size: 1.0em;
    /* Más pequeño que el texto normal */
    line-height: 1.4;
    /* Mejora la legibilidad */
    margin-top: 5px;
    /* Pequeño espacio adicional arriba */
    padding-left: 34px;
    /* Alinea el texto de ayuda con el texto de la etiqueta */
}

/* ... el resto de tus estilos ... */


/* Media query para pantallas pequeñas: las secciones se apilan */
@media (max-width: 768px) {
    .cmf-context-report-container {
        flex-direction: column;
        /* Apilar las secciones */
        gap: 20px;
    }

    .cmf-context-report-container .cmf-section {
        min-width: auto;
        /* Desactivar el min-width cuando se apilan */
        width: 100%;
    }

    .cmf-challenge-header {
        flex-direction: column;
        /* Apilar el título y el logo en móviles */
        align-items: flex-start;
        padding-bottom: 15px;
        /* Espacio extra si se apilan */
    }

    .cmf-header-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .cmf-company-logo {
        margin-left: 0;
        margin-top: 10px;
        /* Espacio entre el título y el logo si están apilados */
    }
}
</style>