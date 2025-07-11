<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" v-if="show">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>
                        {{ empresa.nombre }} {{ empresa.apellido }} - Detalles
                        Completos
                    </h3>
                    <button class="close-button" @click="$emit('close')">
                        &times;
                    </button>
                </div>

                <div class="modal-body" v-if="empresa">
                    <p>
                        <strong>Empresa/Organización:</strong>
                        {{ empresa.empresaOrganizacion }}
                    </p>
                    <p>
                        <strong>Área de Trabajo:</strong>
                        {{ empresa.areaTrabajo }}
                    </p>
                    <p>
                        <strong>Correo Electrónico:</strong>
                        <a :href="'mailto:' + empresa.correoElectronico">{{
                            empresa.correoElectronico
                            }}</a>
                    </p>
                    <p>
                        <strong>Número de Teléfono:</strong>
                        {{ empresa.numeroTelefono }}
                    </p>
                    <p>
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

                    <div v-if="empresa.desafio1 || empresa.desafio2 || empresa.desafio3" class="desafios-section">
                        <h4>Desafíos Principales:</h4>
                        <ul>
                            <li v-if="empresa.desafio1">{{ empresa.desafio1 }}</li>
                            <li v-if="empresa.desafio2">{{ empresa.desafio2 }}</li>
                            <li v-if="empresa.desafio3">{{ empresa.desafio3 }}</li>
                        </ul>
                    </div>

                    <p v-if="empresa.interesInformacion">
                        <strong>Interesado en más información:</strong>
                        {{ empresa.interesInformacion === "si" ? "Sí" : "No" }}
                    </p>

                    <div class="timestamp-section">
                        <p>
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
</script>

<style scoped>
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
    /* Altura máxima para el scroll */
    overflow-y: auto;
    /* Permite scroll si el contenido es largo */
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
}

.modal-header h3 {
    margin: 0;
    color: #34495e;
    font-size: 1.8em;
}

.close-button {
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    padding: 0;
}

.close-button:hover {
    color: #555;
}

.modal-body {
    flex-grow: 1;
    /* Permite que el cuerpo ocupe el espacio restante */
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

.desafios-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #e0e0e0;
}

.desafios-section h4 {
    color: #34495e;
    margin-bottom: 10px;
    font-size: 1.3em;
}

.desafios-section ul {
    list-style-type: disc;
    padding-left: 30px;
    margin-top: 0;
}

.desafios-section li {
    margin-bottom: 8px;
    color: #666;
}

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