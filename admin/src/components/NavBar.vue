<template>
    <nav class="navbar">
        <div class="navbar-left">
            <img src="../icons/PUCV.png" alt="Logo PUCV" class="logo-pucv-navbar" />
            <h1 class="navbar-title">Admin OPENFIN</h1>
        </div>

        <!-- Botón de hamburguesa para móviles -->
        <button class="hamburger-menu" @click="toggleMobileMenu">
            <font-awesome-icon :icon="['fas', 'bars']" />
        </button>

        <!-- Menú de navegación (oculto en móviles por defecto, se muestra con JS) -->
        <div :class="['navbar-right', { 'is-active': isMobileMenuOpen }]">
            <router-link to="/empresas" class="nav-button" @click="closeMobileMenu">
                <font-awesome-icon :icon="['fas', 'building']" />
                Empresas
            </router-link>

            <router-link to="/academicos" class="nav-button" @click="closeMobileMenu">
                <font-awesome-icon :icon="['fas', 'book-open']" />
                Académicos/as
            </router-link>

            <router-link to="/concurso" class="nav-button" @click="closeMobileMenu">
                <font-awesome-icon :icon="['fas', 'trophy']" />
                Desafíos
            </router-link>
        </div>
    </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router"; // Para cerrar el menú al cambiar de ruta si es necesario
import '../assets/concurso.css'
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Función para cerrar el menú móvil, útil al hacer clic en un enlace
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

// Opcional: Cerrar el menú si la ruta cambia (si no se usa @click en cada link)
// const route = useRoute();
// watch(route, () => {
//   isMobileMenuOpen.value = false;
// });
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2e5c8a;
    padding: 0.8rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    height: 80px;
    position: relative;
    /* Necesario para posicionar el menú móvil */
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

.hamburger-menu {
    display: none;
    /* Oculto por defecto en desktop */
    background: none;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 5px;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

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
        border-color 0.2s ease;
}

.nav-button:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
}

.nav-button.router-link-active {
    background-color: #f0f0f0;
    border-color: #bbb;
}

/* ------------------ Media Queries para Responsividad ------------------ */

@media (max-width: 768px) {

    /* En pantallas más pequeñas (tabletas y móviles) */
    .navbar {
        flex-wrap: wrap;
        /* Permite que los elementos se envuelvan */
        height: auto;
        /* Altura auto para acomodar el menú desplegable */
        padding: 0.8rem 1rem;
        /* Padding reducido */
    }

    .navbar-left {
        flex-grow: 1;
        /* Permite que la sección izquierda ocupe espacio */
        justify-content: flex-start;
    }

    .hamburger-menu {
        display: block;
        /* Muestra el botón de hamburguesa */
        order: 2;
        /* Asegura que esté a la derecha del logo */
    }

    .navbar-right {
        /* Oculta la navegación por defecto en móviles */
        display: none;
        flex-direction: column;
        /* Apila los enlaces verticalmente */
        width: 100%;
        /* Ocupa todo el ancho disponible */
        background-color: #2e5c8a;
        /* Mismo color de fondo */
        position: absolute;
        /* Posiciona debajo del navbar principal */
        top: 100%;
        /* Inicia justo debajo del navbar */
        left: 0;
        padding: 10px 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        /* Asegura que esté por encima de otros contenidos */
    }

    .navbar-right.is-active {
        display: flex;
        /* Muestra el menú cuando está activo */
    }

    .nav-button {
        width: calc(100% - 2rem);
        /* Ancho completo menos padding horizontal */
        margin: 5px 1rem;
        /* Espacio entre botones y padding */
        justify-content: center;
        /* Centra el contenido del botón */
        background-color: #3f7fb8;
        /* Un tono de azul más claro para los botones del menú */
        color: white;
        border: none;
        /* Sin borde en los botones internos del menú */
    }

    .nav-button:hover {
        background-color: #5ea8e8;
        /* Tono más claro al pasar el ratón */
        border-color: transparent;
    }

    .nav-button.router-link-active {
        background-color: #1a4a75;
        /* Tono más oscuro para el activo en el menú móvil */
        border-color: transparent;
    }
}
</style>