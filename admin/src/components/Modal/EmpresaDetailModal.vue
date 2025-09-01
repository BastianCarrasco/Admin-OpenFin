<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" v-if="show" @click="$emit('close')" :class="{ 'modal-print-mode': isPrinting }">
            <div class="modal-content" @click.stop id="modal-content-to-print">
                <div class="modal-header">
                    <h3>
                        <!-- Título principal -->
                        {{
                            empresa.nombre || empresa.apellido
                                ? `${empresa.nombre} ${empresa.apellido}`.trim()
                                : empresa.empresaOrganizacion || "Empresa Desconocida"
                        }}
                        <span v-if="empresa.nombre || empresa.apellido">
                            - {{ empresa.empresaOrganizacion || "Organización Desconocida" }}
                        </span>

                        <!-- IMAGEN DEL LINK -->
                        <a v-if="empresa.front?.link && isImageLink(empresa.front.link)" :href="empresa.front.link"
                            target="_blank" rel="noopener noreferrer" class="header-image-link-container" @click.stop>
                            <img :src="empresa.front.link" :alt="empresa.empresaOrganizacion + ' logo/imagen'"
                                class="header-image-link" />
                        </a>
                        <a v-else-if="empresa.front?.link" :href="empresa.front.link" target="_blank"
                            rel="noopener noreferrer" class="modal-external-link-icon" @click.stop>
                            🔗
                        </a>
                    </h3>
                    <button class="close-button no-print" @click="$emit('close')">
                        &times;
                    </button>
                </div>

                <div class="modal-body" v-if="empresa">
                    <p>
                        <strong>Empresa/Organización:</strong>
                        {{ empresa.empresaOrganizacion || "Sin datos" }}
                    </p>
                    <p>
                        <strong>Área(s) de Trabajo:</strong>
                        {{
                            empresa.areaTrabajo && empresa.areaTrabajo.length
                                ? empresa.areaTrabajo.join(", ")
                                : "Sin datos"
                        }}
                    </p>
                    <p>
                        <strong>Correo Electrónico:</strong>
                        <template v-if="empresa.correoElectronico">
                            <a :href="'mailto:' + empresa.correoElectronico">{{
                                empresa.correoElectronico
                                }}</a>
                        </template>
                        <template v-else> Sin datos </template>
                    </p>
                    <p>
                        <strong>Número de Teléfono:</strong>
                        {{ empresa.numeroTelefono || "Sin datos" }}
                    </p>
                    <p>
                        <strong>Contacto Web:</strong>
                        <template v-if="empresa.contactoWeb">
                            <a :href="empresa.contactoWeb" target="_blank" rel="noopener noreferrer">{{
                                empresa.contactoWeb }}</a>
                        </template>
                        <template v-else> Sin datos </template>
                    </p>

                    <div>
                        <p>
                            <strong>Vínculo con PUCV:</strong>
                            {{
                                empresa.vinculoPUCV && empresa.vinculoPUCV.length
                                    ? empresa.vinculoPUCV.join(", ")
                                    : "Sin datos"
                            }}
                        </p>
                    </div>

                    <p>
                        <strong>Actividades/Servicios:</strong>
                        {{ empresa.actividadesServicios || "Sin datos" }}
                    </p>

                    <!-- Sección Front -->
                    <div class="front-section">
                        <h4>Información Adicional (Front):</h4>
                        <template v-if="empresa.front">
                            <p>
                                <strong>Contexto:</strong>
                                {{ empresa.front.contexto || "Sin datos" }}
                            </p>
                            <div>
                                <p>
                                    <strong>Título Extra:</strong>
                                    {{ empresa.front.extra?.titulo || "Sin datos" }}
                                </p>
                                <div v-if="
                                    empresa.front.extra?.datos &&
                                    empresa.front.extra.datos.length
                                ">
                                    <p><strong>Datos Relevantes:</strong></p>
                                    <ul>
                                        <li v-for="(dato, index) in empresa.front.extra.datos" :key="index">
                                            {{ dato || "Sin datos" }}
                                        </li>
                                    </ul>
                                </div>
                                <p v-else>
                                    <strong>Datos Relevantes:</strong> Sin datos
                                </p>
                            </div>
                            <p>
                                <strong>Texto de Desafío Front:</strong>
                                {{ empresa.front.desafio_Texto || "Sin datos" }}
                            </p>
                        </template>
                        <p v-else>Sin datos para la sección Front.</p>
                    </div>

                    <!-- Desafíos Principales -->
                    <div class="desafios-section">
                        <h4>Desafíos a Nivel Raíz:</h4>
                        <ul>
                            <li>{{ empresa.desafio1 || "Sin datos" }}</li>
                            <li>{{ empresa.desafio2 || "Sin datos" }}</li>
                            <li>{{ empresa.desafio3 || "Sin datos" }}</li>
                        </ul>
                    </div>

                    <!-- Desafíos Detallados -->
                    <div class="desafios-section">
                        <h4>Desafíos Detallados:</h4>
                        <template v-if="
                            empresa.front?.desafio_1?.titulo ||
                            empresa.front?.desafio_2?.titulo ||
                            empresa.front?.desafio_3?.titulo
                        ">
                            <div>
                                <p>
                                    <strong>{{
                                        empresa.front.desafio_1?.titulo || "Desafío 1"
                                        }}:</strong>
                                    {{ empresa.front.desafio_1?.descripcion || "Sin datos" }}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>{{
                                        empresa.front.desafio_2?.titulo || "Desafío 2"
                                        }}:</strong>
                                    {{ empresa.front.desafio_2?.descripcion || "Sin datos" }}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>{{
                                        empresa.front.desafio_3?.titulo || "Desafío 3"
                                        }}:</strong>
                                    {{ empresa.front.desafio_3?.descripcion || "Sin datos" }}
                                </p>
                            </div>
                        </template>
                        <p v-else>Sin datos de desafíos detallados.</p>
                    </div>

                    <p>
                        <strong>Interesado en más información:</strong>
                        {{
                            typeof empresa.interesInformacion === "boolean"
                                ? empresa.interesInformacion
                                    ? "Sí"
                                    : "No"
                                : "Sin datos"
                        }}
                    </p>
                    <p>
                        <strong>Validado:</strong>
                        {{
                            typeof empresa.Validar === "boolean"
                                ? empresa.Validar
                                    ? "Sí"
                                    : "No"
                                : "Sin datos"
                        }}
                    </p>

                    <div class="timestamp-section">
                        <p>
                            <small>
                                <strong>Fecha de Registro:</strong>
                                {{
                                    empresa.createdAt
                                        ? new Date(empresa.createdAt).toLocaleDateString()
                                        : "Sin datos"
                                }}
                            </small>
                        </p>
                        <p>
                            <small>
                                <strong>Última Actualización:</strong>
                                {{
                                    empresa.updatedAt
                                        ? new Date(empresa.updatedAt).toLocaleDateString()
                                        : "Sin datos"
                                }}
                            </small>
                        </p>
                    </div>
                </div>

                <div class="modal-footer no-print">
                    <!-- <button class="print-button" @click="exportPDF">
                        📄 Exportar PDF
                    </button> -->
                    <button class="word-button" @click="exportWord(empresa)">
                        📝 Exportar Word
                    </button>
                    <button class="close-button-bottom" @click="$emit('close')">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>


<script setup>
import { defineProps, defineEmits, ref } from "vue";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import "../../assets/empresasmodal.css";

const props = defineProps({
    show: { type: Boolean, default: false },
    empresa: { type: Object, default: null },
});

const emits = defineEmits(["close"]);
const isPrinting = ref(false);

const isImageLink = (url) => {
    if (!url || typeof url !== "string") return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

// 📄 Exportar a PDF
const exportPDF = () => {
    const element = document.getElementById("modal-content-to-print");
    if (!element) return;

    const opt = {
        margin: 10,
        filename: "empresa-info.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
};

// 📝 Exportar a Word (con toda la info)
// 📝 Exportar a Word (con estilo mejorado y toda la info)
// 📝 Exportar a Word (con estilo mejorado y toda la info)
const exportWord = (empresa) => {
    if (!empresa) return;

    const children = [];

    // Helper para desafíos detallados
    const addChallenge = (titulo, descripcion, fallbackTitulo = "Desafío") => {
        children.push(
            new Paragraph({
                text: titulo || fallbackTitulo,
                heading: "Heading3", // Subtítulo más pequeño
                spacing: { after: 50 },
            })
        );
        children.push(
            new Paragraph({
                text: descripcion || "Sin datos",
                spacing: { after: 200 },
            })
        );
    };

    // Helper para títulos de sección
    const addTitle = (text) => {
        children.push(
            new Paragraph({
                text,
                heading: "Heading1", // Título grande
                spacing: { after: 200 },
            })
        );
    };

    // Helper para subtítulos
    const addSubtitle = (text) => {
        children.push(
            new Paragraph({
                text,
                heading: "Heading2", // Subtítulo
                spacing: { after: 100 },
            })
        );
    };

    // Helper para párrafos normales
    const addParagraph = (label, value) => {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${label}: `, bold: true }),
                    new TextRun({ text: value || "Sin datos" }),
                ],
                spacing: { after: 100 },
            })
        );
    };

    // Helper para listas
    const addList = (label, items) => {
        children.push(new Paragraph({ text: `${label}:`, bold: true }));
        if (items && items.length) {
            items.forEach((item) => {
                children.push(
                    new Paragraph({
                        text: item || "Sin datos",
                        bullet: { level: 0 },
                    })
                );
            });
        } else {
            children.push(new Paragraph("Sin datos"));
        }
    };

    // =========================
    // 📌 Información General
    // =========================
    addTitle("Información General");
    addParagraph("Nombre", `${empresa.nombre || ""} ${empresa.apellido || ""}`.trim());
    addParagraph("Empresa/Organización", empresa.empresaOrganizacion);
    addParagraph("Correo", empresa.correoElectronico);
    addParagraph("Teléfono", empresa.numeroTelefono);
    addParagraph("Contacto Web", empresa.contactoWeb);
    addList("Área(s) de Trabajo", empresa.areaTrabajo);
    addList("Vínculo con PUCV", empresa.vinculoPUCV);
    addParagraph("Actividades/Servicios", empresa.actividadesServicios);

    // =========================
    // 📌 Desafíos Raíz
    // =========================
    addTitle("Desafíos a Nivel Raíz");
    addParagraph("Desafío 1", empresa.desafio1);
    addParagraph("Desafío 2", empresa.desafio2);
    addParagraph("Desafío 3", empresa.desafio3);

    // =========================
    // 📌 Sección Front
    // =========================
    if (empresa.front) {
        addTitle("Información Adicional (Front)");

        addParagraph("Contexto", empresa.front.contexto);
        addParagraph("Título Extra", empresa.front.extra?.titulo);
        addList("Datos Relevantes", empresa.front.extra?.datos);

        addParagraph("Texto de Desafío Front", empresa.front.desafio_Texto);

        // Desafíos detallados
        addSubtitle("Desafíos Detallados");
        addChallenge(empresa.front.desafio_1?.titulo, empresa.front.desafio_1?.descripcion, "Desafío 1");
        addChallenge(empresa.front.desafio_2?.titulo, empresa.front.desafio_2?.descripcion, "Desafío 2");
        addChallenge(empresa.front.desafio_3?.titulo, empresa.front.desafio_3?.descripcion, "Desafío 3");
    }

    // =========================
    // 📌 Otros datos
    // =========================
    addTitle("Otros Datos");
    addParagraph(
        "Interesado en más información",
        empresa.interesInformacion === true
            ? "Sí"
            : empresa.interesInformacion === false
                ? "No"
                : "Sin datos"
    );
    addParagraph(
        "Validado",
        empresa.Validar === true ? "Sí" : empresa.Validar === false ? "No" : "Sin datos"
    );
    addParagraph(
        "Fecha de Registro",
        empresa.createdAt ? new Date(empresa.createdAt).toLocaleDateString() : "Sin datos"
    );
    addParagraph(
        "Última Actualización",
        empresa.updatedAt ? new Date(empresa.updatedAt).toLocaleDateString() : "Sin datos"
    );

    // =========================
    // 📌 Crear documento
    // =========================
    const doc = new Document({
        sections: [{ children }],
    });

    Packer.toBlob(doc).then((blob) => {
        const companyName = empresa.empresaOrganizacion || empresa.nombre || "empresa";
        const fileName = `Desafio ${companyName} info.docx`;
        saveAs(blob, fileName);
    });
};
</script>

<style scoped>
.print-button,
.word-button,
.close-button-bottom {
    background-color: #007bff;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    font-size: 1rem;
}

.word-button {
    background-color: #28a745;
}

.word-button:hover {
    background-color: #1e7e34;
}

.print-button:hover {
    background-color: #0056b3;
}

.close-button-bottom {
    background-color: #6c757d;
}

.close-button-bottom:hover {
    background-color: #5a6268;
}
</style>