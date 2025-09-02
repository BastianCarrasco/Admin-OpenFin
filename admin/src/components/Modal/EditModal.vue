<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Editar Empresa: {{ localEmpresa.nombreEmpresa }}</h2>
                <button @click="close" class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="submitChanges">

                    <!-- Sección de Información General de la Empresa (editable) -->
                    <div class="form-section">
                        <h4>Información Pública de la Empresa</h4>
                        <label>
                            Organización:
                            <input v-model="localEmpresa.nombreEmpresa" type="text" />
                        </label>
                        <label>
                            Actividades/Servicios:
                            <textarea v-model="localEmpresa.actividadesServicios"></textarea>
                        </label>
                        <label>
                            Link del Logo:
                            <input v-model="localEmpresa.link" type="text" />
                        </label>
                        <label>
                            validado Empresa (para aparecer en lista):
                            <input v-model="localEmpresa.validado" type="checkbox" />
                        </label>
                    </div>

                    <!-- Sección Front-end Detalles (editable) -->
                    <div v-if="localEmpresa.front" class="form-section">
                        <h4>Detalles de Contenido del Desafío</h4>
                        <label>
                            Contexto del Desafío:
                            <textarea v-model="localEmpresa.front.contexto"></textarea>
                        </label>
                        <div v-if="localEmpresa.front.extra">
                            <label>
                                Título de Detalles Extra:
                                <input v-model="localEmpresa.front.extra.titulo" type="text" />
                            </label>
                            <label>
                                Datos Extra (separados por comas):
                                <textarea v-model="extraDatosString"></textarea>
                            </label>
                        </div>
                    </div>

                    <!-- Sección Desafío Principal (editable) -->
                    <div v-if="localEmpresa.front" class="form-section">
                        <h4>Desafío Principal</h4>
                        <label>
                            Texto del Desafío Principal:
                            <textarea v-model="localEmpresa.front.desafio_Texto"></textarea>
                        </label>
                    </div>

                    <!-- Sección Desafíos Específicos del Front-end (editable) -->
                    <div v-if="localEmpresa.front" class="form-section">
                        <h4>Desafíos Específicos</h4>
                        <div class="challenge-fields">
                            <label>
                                Desafío 1 Título:
                                <input v-model="localEmpresa.front.desafio_1.titulo" type="text" />
                            </label>
                            <label>
                                Desafío 1 Descripción:
                                <textarea v-model="localEmpresa.front.desafio_1.descripcion"></textarea>
                            </label>
                        </div>
                        <div class="challenge-fields">
                            <label>
                                Desafío 2 Título:
                                <input v-model="localEmpresa.front.desafio_2.titulo" type="text" />
                            </label>
                            <label>
                                Desafío 2 Descripción:
                                <textarea v-model="localEmpresa.front.desafio_2.descripcion"></textarea>
                            </label>
                        </div>
                        <div class="challenge-fields">
                            <label>
                                Desafío 3 Título:
                                <input v-model="localEmpresa.front.desafio_3.titulo" type="text" />
                            </label>
                            <label>
                                Desafío 3 Descripción:
                                <textarea v-model="localEmpresa.front.desafio_3.descripcion"></textarea>
                            </label>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="submit" class="save-button">Guardar Cambios</button>
                        <button type="button" @click="close" class="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import '../../assets/modaledit.css'

const props = defineProps({
    isVisible: Boolean,
    empresa: Object, // La empresa ORIGINAL completa (para comparar)
});

const emit = defineEmits(['close', 'save']);

const localEmpresa = ref({});
const extraDatosString = ref('');

// PLANTILLA BASE CON VALORES POR DEFECTO COMPLETOS
const baseTemplate = {
    nombre: "", apellido: "", correoElectronico: "", numeroTelefono: "",
    nombreEmpresa: "", areaTrabajo: [], contactoWeb: "", vinculoPucv: [],
    actividadesServicios: "", desafio1: "", desafio2: "", desafio3: "",
    masInformacion: false, validado: false, link: "",
    front: {
        contexto: "",
        extra: { titulo: "", datos: [] },
        desafio_Texto: "",
        desafio_1: { titulo: "", descripcion: "" },
        desafio_2: { titulo: "", descripcion: "" },
        desafio_3: { titulo: "", descripcion: "" }
    }
};


watch(() => props.empresa, (newEmpresa) => {
    if (newEmpresa) {
        const combinedData = { ...JSON.parse(JSON.stringify(baseTemplate)), ...newEmpresa };

        if (combinedData._id && typeof combinedData._id === 'object' && combinedData._id.$oid) {
            combinedData._id = combinedData._id.$oid;
        } else if (combinedData._id) {
            combinedData._id = String(combinedData._id);
        }

        localEmpresa.value = JSON.parse(JSON.stringify(combinedData)); // Copia profunda

        extraDatosString.value = localEmpresa.value.front?.extra?.datos?.join(', ') || '';
    }
}, { immediate: true, deep: true });


// Función auxiliar para comparar objetos y encontrar diferencias
const getDifferences = (original, edited) => {
    const diff = {};
    for (const key in edited) {
        if (Object.prototype.hasOwnProperty.call(edited, key)) {
            const originalValue = original[key];
            const editedValue = edited[key];

            // EXCLUIR METADATOS Y CAMPOS NO EDITABLES DEL OBJETO DE CAMBIOS DE NIVEL SUPERIOR
            // Estos se excluyen si no son parte de los campos de 'front' o de la raíz editable
            if (['_id', 'createdAt', 'updatedAt', '__v',
                'nombre', 'apellido', 'correoElectronico', 'numeroTelefono', 'contactoWeb',
                'areaTrabajo', ' vinculoPucv', 'desafio1', 'desafio2', 'desafio3', 'masInformacion'
            ].includes(key)) {
                // Solo para el nivel más alto, si son campos que no se muestran en el modal.
                // En objetos anidados, debemos ser menos agresivos.
                if (original === props.empresa) { // Estamos en el nivel superior del objeto
                    continue; // Si el campo no se edita, no lo incluimos en el PATCH.
                }
            }

            if (typeof editedValue === 'object' && editedValue !== null && !Array.isArray(editedValue)) {
                // Si el objeto anidado ha sido modificado,
                // enviamos el objeto COMPLETO tal como está en 'editedValue' (localEmpresa),
                // que ya incluye los campos originales no tocados y los modificados.
                const hasNestedDiff = Object.keys(getDifferences(originalValue || {}, editedValue)).length > 0;
                if (hasNestedDiff) {
                    diff[key] = editedValue; // Envía el objeto anidado completo si hubo algún cambio dentro
                } else if (JSON.stringify(originalValue || {}) !== JSON.stringify(editedValue || {})) {
                    // Caso borde: el objeto puede ser diferente (ej. una propiedad se convirtió de null a {})
                    diff[key] = editedValue;
                }
            } else if (Array.isArray(editedValue)) {
                const originalArray = originalValue || [];
                // Para arrays de primitivos, ordenamos para ignorar el orden en la comparación
                if (JSON.stringify(originalArray.sort()) !== JSON.stringify(editedValue.sort())) {
                    diff[key] = editedValue;
                }
            }
            else if (originalValue !== editedValue) {
                diff[key] = editedValue;
            }
        }
    }
    return diff;
};

// --- FUNCIÓN DE DEBUGGING PARA VALIDACIÓN EN EL FRONTEND ---
const validateFinalData = (data) => {
    const errors = [];

    // Validaciones de nivel superior
    if (typeof data.nombreEmpresa !== 'string') errors.push('nombreEmpresa debe ser un string.');
    if (typeof data.actividadesServicios !== 'string') errors.push('actividadesServicios debe ser un string.');
    if (typeof data.link !== 'string') errors.push('link debe ser un string.');
    if (typeof data.validado !== 'boolean') errors.push('validado debe ser un booleano.');

    // Validaciones de 'front'
    if (data.front) {
        if (typeof data.front.contexto !== 'string') errors.push('front.contexto debe ser un string.');
        if (data.front.extra) {
            if (typeof data.front.extra.titulo !== 'string') errors.push('front.extra.titulo debe ser un string.');
            if (!Array.isArray(data.front.extra.datos) || !data.front.extra.datos.every(item => typeof item === 'string')) {
                errors.push('front.extra.datos debe ser un array de strings.');
            }
        }
        if (typeof data.front.desafio_Texto !== 'string') errors.push('front.desafio_Texto debe ser un string.');

        // Validaciones de desafio_1, _2, _3
        const validateDesafio = (desafioNum, desafioData) => {
            if (desafioData) {
                if (typeof desafioData.titulo !== 'string') errors.push(`front.desafio_${desafioNum}.titulo debe ser un string.`);
                if (typeof desafioData.descripcion !== 'string') errors.push(`front.desafio_${desafioNum}.descripcion debe ser un string.`);
            }
        };
        validateDesafio(1, data.front.desafio_1);
        validateDesafio(2, data.front.desafio_2);
        validateDesafio(3, data.front.desafio_3);
    }

    return errors;
};


const submitChanges = () => {
    // 1. Prepara el array 'datos' del 'extra'
    if (localEmpresa.value.front?.extra) {
        localEmpresa.value.front.extra.datos = extraDatosString.value
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '');
    }

    // --- Antes de emitir, valida los datos ---
    const finalDataToSend = JSON.parse(JSON.stringify(localEmpresa.value)); // Objeto completo (localEmpresa)
    finalDataToSend._id = props.empresa._id; // Asegurar el ID

    const validationErrors = validateFinalData(finalDataToSend);

    if (validationErrors.length > 0) {
        console.error('--- ERRORES DE VALIDACIÓN DEL MODAL (PRE-ENVÍO) ---');
        validationErrors.forEach(err => console.error(err));
        console.error('----------------------------------------------------');
        // Opcional: Mostrar esto en la UI al usuario
        // alert('Por favor, corrige los siguientes errores:\n' + validationErrors.join('\n'));
        return; // Detener el envío si hay errores
    }
    // --- FIN Validación ---


    // Si todo está bien, genera los cambios y emite
    const changes = getDifferences(props.empresa, finalDataToSend); // Usa finalDataToSend aquí para la comparación


    emit('save', changes); // Emite solo los cambios + el _id
};

const close = () => {
    emit('close');
};
</script>

<style scoped></style>