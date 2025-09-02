<template>
    <nav class="navbar">
        <div class="navbar-top-row">
            <!-- Contenido de la fila superior (logo + título) -->
            <div class="navbar-left">
                <img src="../icons/PUCV.png" alt="Logo PUCV" class="logo-pucv-navbar" />
                <h1 class="navbar-title">Admin OPENFIN</h1>
            </div>

            <!-- Botones de navegación para desktop -->
            <div v-if="!isMobile" class="navbar-right-desktop">
                <router-link to="/empresas" class="nav-button">
                    <font-awesome-icon :icon="['fas', 'building']" />
                    Empresas y Desafíos
                </router-link>
                <!-- <router-link to="/academicos" class="nav-button">
                    <font-awesome-icon :icon="['fas', 'book-open']" />
                    Académicos/as
                </router-link> -->
                <router-link to="/concurso" class="nav-button">
                    <font-awesome-icon :icon="['fas', 'trophy']" />
                    Editar Desafíos
                </router-link>
            </div>
        </div>

        <!-- Sección de Navegación MÓVIL (visible solo en móvil) -->
        <div v-if="isMobile" class="navbar-mobile-nav">
            <!-- El botón "Vistas" -->
            <button class="nav-button-mobile-toggle" @click="toggleViewsMenu"
                :class="{ 'is-active-toggle': isViewsMenuOpen }">
                <font-awesome-icon :icon="['fas', 'eye']" />
                Vistas
                <font-awesome-icon :icon="['fas', isViewsMenuOpen ? 'chevron-up' : 'chevron-down']"
                    class="toggle-icon" />
            </button>

            <!-- Las opciones reales que se despliegan de "Vistas" -->
            <div :class="['mobile-views-dropdown', { 'is-active': isViewsMenuOpen }]">
                <router-link to="/empresas" class="nav-button-mobile-item" @click="closeViewsMenu">
                    <font-awesome-icon :icon="['fas', 'building']" />
                    Empresas
                </router-link>
                <router-link to="/academicos" class="nav-button-mobile-item" @click="closeViewsMenu">
                    <font-awesome-icon :icon="['fas', 'book-open']" />
                    Académicos/as
                </router-link>
                <router-link to="/concurso" class="nav-button-mobile-item" @click="closeViewsMenu">
                    <font-awesome-icon :icon="['fas', 'trophy']" />
                    Desafíos
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
// import { watch } from "vue";
// import { useRoute } from "vue-router";

const isViewsMenuOpen = ref(false); // Controla el submenú "Vistas"
const isMobile = ref(false); // Para renderizado condicional de desktop vs mobile

const MOBILE_BREAKPOINT = 760; // Usa el mismo breakpoint que tu CSS

const checkMobile = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
});

const toggleViewsMenu = () => {
    isViewsMenuOpen.value = !isViewsMenuOpen.value;
};

const closeViewsMenu = () => {
    isViewsMenuOpen.value = false;
};

// Opcional: Cerrar el menú si la ruta cambia
// const route = useRoute();
// watch(() => route.path, () => {
//   closeViewsMenu();
// });
</script>

<style scoped>
/*
 * ESTILOS GENERALES DEL NAVBAR (APLICAN EN DESKTOP Y MÓVIL)
 */
.navbar {
    display: flex;
    flex-direction: column;
    /* Cambiado a columna para apilar filas */
    justify-content: flex-start;
    /* Alinea contenido arriba */
    align-items: center;
    /* Centra horizontalmente el contenido de cada fila */
    background-color: #2e5c8a;
    padding: 0.8rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 100;
    width: 100%;
    /* Asegura que ocupe todo el ancho */
}

/* Contenedor de la fila superior (logo + título + botones desktop) */
.navbar-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* Ocupa todo el ancho del navbar */
    height: 80px;
    /* Altura fija para la fila superior */
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 15px;
}

.navbar-left .logo-pucv-navbar {
    height: 50px;
    object-fit: contain;
}

.navbar-left .navbar-title {
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    font-family: "Lato", sans-serif;
}

/*
 * MENÚ DE NAVEGACIÓN DERECHO (ESTILO EN DESKTOP)
 */
.navbar-right-desktop {
    display: flex;
    align-items: center;
    gap: 10px;
}

/*
 * ESTILOS DE LOS BOTONES DE NAVEGACIÓN ESTÁNDAR (DESKTOP)
 */
.nav-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.nav-button:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
    color: #000;
}

.nav-button.router-link-active {
    background-color: #f0f0f0;
    border-color: #bbb;
    color: #2e5c8a;
}

/*
 * SECCIÓN DE NAVEGACIÓN MÓVIL (VISIBLE SOLO EN MÓVILES)
 */
.navbar-mobile-nav {
    display: flex;
    flex-direction: column;
    /* Apila el botón Vistas y su dropdown */
    width: calc(100% - 2rem);
    /* Ancho total menos padding del .navbar */
    padding-bottom: 10px;
    /* Un poco de espacio abajo */
    position: relative;
    /* Para posicionar el dropdown, si fuera absoluto respecto a este */
    z-index: 90;
    /* Un z-index menor que el navbar principal */
}

.nav-button-mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 18px;
    background-color: #3f7fb8;
    /* Color principal del botón */
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 8px;
    /* Bordes redondeados para el botón vistas */
    transition: background-color 0.2s ease;
}

.nav-button-mobile-toggle:hover {
    background-color: #5ea8e8;
}

.nav-button-mobile-toggle.is-active-toggle {
    background-color: #1a4a75;
}

.nav-button-mobile-toggle .toggle-icon {
    margin-left: auto;
    /* Empuja el ícono de flecha a la derecha */
    transition: transform 0.3s ease;
}

/* Estilos del submenú desplegable de Vistas */
.mobile-views-dropdown {
    display: flex;
    flex-direction: column;
    background-color: #2e5c8a;
    max-height: 0;
    /* Oculto por defecto */
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    border-radius: 0 0 8px 8px;
    /* Bordes redondeados solo abajo */
    margin-top: -5px;
    /* Para que se superponga un poco al botón toggle */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mobile-views-dropdown.is-active {
    max-height: 200px;
    /* Suficiente altura para los enlaces desplegados */
    padding-top: 5px;
    /* Pequeño padding interno */
    padding-bottom: 10px;
    /* Padding inferior para el menú */
}

/* Estilos de los enlaces reales dentro del submenú "Vistas" */
.nav-button-mobile-item {
    /* Nueva clase para diferenciar de los de desktop */
    display: flex;
    align-items: center;
    gap: 8px;
    width: calc(100% - 2rem);
    /* Ancho completo con padding lateral simulado */
    margin: 5px 1rem;
    background-color: #5ea8e8;
    /* Un color ligeramente diferente */
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.2s ease;
}

.nav-button-mobile-item:hover {
    background-color: #7abff7;
}

.nav-button-mobile-item.router-link-active {
    background-color: #428fd8;
}

/*
 * MEDIA QUERIES PARA RESPONSIVIDAD (CONTROLA LA VISIBILIDAD DE SECCIONES)
 */
@media (max-width: 760px) {
    .navbar {
        padding: 0.8rem 1rem;
        /* Padding reducido en móvil */
        height: auto;
        /* La altura se ajusta al contenido */
    }

    .navbar-top-row {
        height: auto;
        /* Su altura se ajusta a logo/título */
        flex-wrap: wrap;
        /* Permitir que logo/título se envuelva si el título es largo */
        justify-content: center;
        /* Centrar logo y título si hay espacio */
        padding-bottom: 10px;
        /* Espacio antes del botón Vistas */
    }

    .navbar-left {
        width: 100%;
        /* Ocupa todo el ancho en la fila superior */
        justify-content: center;
        /* Centra logo y título */
        margin-bottom: 10px;
        /* Espacio debajo del título antes del botón Vistas */
    }

    /* Ocultar botones de desktop */
    .navbar-right-desktop {
        display: none;
    }

    /* Mostrar la sección de navegación móvil */
    .navbar-mobile-nav {
        display: flex;
        /* Muestra el contenedor del botón Vistas y su dropdown */
    }
}

@media (min-width: 761px) {

    /* Ocultar la sección de navegación móvil en desktop */
    .navbar-mobile-nav {
        display: none;
    }
}
</style>