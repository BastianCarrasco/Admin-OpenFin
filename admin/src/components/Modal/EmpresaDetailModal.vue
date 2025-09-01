<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" v-if="show" @click="$emit('close')">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>
                        <!-- Título principal -->
                        {{ empresa.nombre || empresa.apellido ? `${empresa.nombre} ${empresa.apellido}`.trim() :
                            empresa.empresaOrganizacion }}
                        <span v-if="empresa.nombre || empresa.apellido"> - {{ empresa.empresaOrganizacion }}</span>

                        <!-- IMAGEN DEL LINK AQUI (si es una imagen) -->
                        <a v-if="empresa.front?.link && isImageLink(empresa.front.link)" :href="empresa.front.link"
                            target="_blank" rel="noopener noreferrer" class="header-image-link-container" @click.stop>
                            <img :src="empresa.front.link" :alt="empresa.empresaOrganizacion + ' logo/imagen'"
                                class="header-image-link" />
                        </a>
                        <!-- Icono de enlace (si no es una imagen o si quieres un icono además de la imagen) -->
                        <a v-else-if="empresa.front?.link" :href="empresa.front.link" target="_blank"
                            rel="noopener noreferrer" class="modal-external-link-icon" @click.stop>
                            🔗 <!-- O <i class="fas fa-external-link-alt"></i> -->
                        </a>
                    </h3>
                    <button class="close-button" @click="$emit('close')">
                        &times;
                    </button>
                </div>

                <div class="modal-body" v-if="empresa">
                    <!-- Información de Contacto y General -->
                    <p v-if="empresa.empresaOrganizacion">
                        <strong>Empresa/Organización:</strong>
                        {{ empresa.empresaOrganizacion }}
                    </p>
                    <p v-if="empresa.areaTrabajo && empresa.areaTrabajo.length">
                        <strong>Área(s) de Trabajo:</strong>
                        {{ empresa.areaTrabajo.join(", ") }}
                    </p>
                    <p v-if="empresa.correoElectronico">
                        <strong>Correo Electrónico:</strong>
                        <a :href="'mailto:' + empresa.correoElectronico">{{
                            empresa.correoElectronico
                            }}</a>
                    </p>
                    <p v-if="empresa.numeroTelefono">
                        <strong>Número de Teléfono:</strong>
                        {{ empresa.numeroTelefono }}
                    </p>
                    <p v-if="empresa.contactoWeb">
                        <strong>Contacto Web:</strong>
                        <a :href="empresa.contactoWeb" target="_blank" rel="noopener noreferrer">{{ empresa.contactoWeb
                            }}</a>
                    </p>

                    <div v-if="empresa.vinculoPUCV && empresa.vinculoPUCV.length">
                        <p>
                            <strong>Vínculo con PUCV:</strong>
                            {{ empresa.vinculoPUCV.join(", ") }}
                        </p>
                    </div>

                    <p v-if="empresa.actividadesServicios">
                        <strong>Actividades/Servicios:</strong>
                        {{ empresa.actividadesServicios }}
                    </p>

                    <!-- Sección Front -->
                    <div v-if="empresa.front" class="front-section">
                        <h4>Información Adicional (Front):</h4>
                        <p v-if="empresa.front.contexto">
                            <strong>Contexto:</strong> {{ empresa.front.contexto }}
                        </p>
                        <div v-if="empresa.front.extra">
                            <p v-if="empresa.front.extra.titulo">
                                <strong>Título Extra:</strong> {{ empresa.front.extra.titulo }}
                            </p>
                            <div v-if="empresa.front.extra.datos && empresa.front.extra.datos.length">
                                <p><strong>Datos Relevantes:</strong></p>
                                <ul>
                                    <li v-for="(dato, index) in empresa.front.extra.datos" :key="index">
                                        {{ dato }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p v-if="empresa.front.desafio_Texto">
                            <strong>Texto de Desafío Front:</strong> {{ empresa.front.desafio_Texto }}
                        </p>
                        <!-- Se eliminó la sección grande de imagen/enlace de aquí -->
                    </div>


                    <!-- Desafíos Principales -->
                    <div v-if="empresa.desafio1 || empresa.desafio2 || empresa.desafio3" class="desafios-section">
                        <h4>Desafíos a Nivel Raíz:</h4>
                        <ul>
                            <li v-if="empresa.desafio1">{{ empresa.desafio1 }}</li>
                            <li v-if="empresa.desafio2">{{ empresa.desafio2 }}</li>
                            <li v-if="empresa.desafio3">{{ empresa.desafio3 }}</li>
                        </ul>
                    </div>

                    <!-- Desafíos Detallados del Front -->
                    <div v-if="empresa.front?.desafio_1?.titulo || empresa.front?.desafio_2?.titulo || empresa.front?.desafio_3?.titulo"
                        class="desafios-section">
                        <h4>Desafíos Detallados:</h4>
                        <div v-if="empresa.front.desafio_1?.titulo">
                            <p>
                                <strong>{{ empresa.front.desafio_1.titulo }}:</strong>
                                {{ empresa.front.desafio_1.descripcion }}
                            </p>
                        </div>
                        <div v-if="empresa.front.desafio_2?.titulo">
                            <p>
                                <strong>{{ empresa.front.desafio_2.titulo }}:</strong>
                                {{ empresa.front.desafio_2.descripcion }}
                            </p>
                        </div>
                        <div v-if="empresa.front.desafio_3?.titulo">
                            <p>
                                <strong>{{ empresa.front.desafio_3.titulo }}:</strong>
                                {{ empresa.front.desafio_3.descripcion }}
                            </p>
                        </div>
                    </div>


                    <p v-if="typeof empresa.interesInformacion === 'boolean'">
                        <strong>Interesado en más información:</strong>
                        {{ empresa.interesInformacion ? "Sí" : "No" }}
                    </p>
                    <p v-if="typeof empresa.Validar === 'boolean'">
                        <strong>Validado:</strong>
                        {{ empresa.Validar ? "Sí" : "No" }}
                    </p>

                    <div class="timestamp-section">
                        <p v-if="empresa.createdAt">
                            <small>
                                <strong>Fecha de Registro:</strong>
                                {{ new Date(empresa.createdAt).toLocaleDateString() }}
                            </small>
                        </p>
                        <p v-if="empresa.updatedAt">
                            <small>
                                <strong>Última Actualización:</strong>
                                {{
                                    new Date(empresa.updatedAt).toLocaleDateString()
                                }}
                            </small>
                        </p>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="close-button-bottom" @click="$emit('close')">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    empresa: {
        type: Object,
        default: null,
    },
});

const emits = defineEmits(["close"]);

// Función para verificar si un enlace apunta a una imagen
const isImageLink = (url) => {
    if (!url || typeof url !== 'string') {
        return false;
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerCaseUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};
</script>

<style scoped>
/* Estilos existentes */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    /* Permitir que los elementos se envuelvan si no hay espacio */
}

.modal-header h3 {
    margin: 0;
    color: #34495e;
    font-size: 1.8em;
    display: flex;
    align-items: center;
    flex-grow: 1;
    /* Permite que el título ocupe el espacio disponible */
    margin-right: 10px;
    /* Espacio antes del icono/imagen */
}

/* Contenedor para la imagen de enlace en el encabezado */
.header-image-link-container {
    display: flex;
    align-items: center;
    height: 100%;
    /* Para alinear verticalmente con el título */
    margin-left: auto;
    /* Moverlo a la derecha si es posible */
}

.header-image-link {
    max-height: 40px;
    /* Tamaño pequeño */
    max-width: 80px;
    /* Limitar el ancho */
    width: auto;
    height: auto;
    border-radius: 5px;
    object-fit: contain;
    /* Asegura que la imagen completa sea visible */
    margin-left: 10px;
    /* Espacio con el título */
}

/* Estilo para el icono de enlace tradicional (si no hay imagen) */
.modal-external-link-icon {
    font-size: 0.8em;
    color: #42b983;
    margin-left: 10px;
    text-decoration: none;
    transition: color 0.3s ease;
}

.modal-external-link-icon:hover {
    color: #384693;
}


.close-button {
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    padding: 0;
    margin-left: 10px;
    /* Espacio entre el icono/imagen y el botón de cerrar */
}

.close-button:hover {
    color: #555;
}

.modal-body {
    flex-grow: 1;
}

.modal-body p {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #555;
    text-align: left;
}

.modal-body p strong {
    color: #2c3e50;
    margin-right: 5px;
}

.modal-body a {
    color: #42b983;
    text-decoration: none;
}

.modal-body a:hover {
    text-decoration: underline;
}

.desafios-section,
.front-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #e0e0e0;
}

.desafios-section h4,
.front-section h4 {
    color: #34495e;
    margin-bottom: 10px;
    font-size: 1.3em;
}

.desafios-section ul,
.front-section ul {
    list-style-type: disc;
    padding-left: 30px;
    margin-top: 0;
}

.desafios-section li,
.front-section li {
    margin-bottom: 8px;
    color: #666;
}

/* Eliminado: .front-link-section y .front-image-link del body */


.timestamp-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #e0e0e0;
    font-size: 0.9em;
    color: #888;
}

.timestamp-section p {
    margin-bottom: 5px;
    text-align: left;
}

.modal-footer {
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-top: 20px;
    text-align: right;
}

.close-button-bottom {
    background-color: #384693;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.close-button-bottom:hover {
    background-color: #2a3471;
}

/* Transiciones para el modal (opcional, pero mejora la UX) */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Para la entrada del modal */
.modal-fade-enter-active .modal-content {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    transform: scale(0.9);
}

.modal-fade-enter-from .modal-content {
    transform: scale(0.9) translateY(20px);
}

/* Para la salida del modal */
.modal-fade-leave-active .modal-content {
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    transform: scale(1);
}

.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(-20px);
}
</style>