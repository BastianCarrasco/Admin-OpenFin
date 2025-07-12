<template>
    <nav class="navbar">
        <div class="navbar-left">
            <img src="../icons/PUCV.png" alt="Logo PUCV" class="logo-pucv-navbar" />
            <h1 class="navbar-title">Admin OPENFIN</h1>
        </div>

        <div class="navbar-right">
            <router-link to="/empresas" class="nav-button">
                <font-awesome-icon :icon="['fas', 'building']" />
                Empresas
            </router-link>

            <router-link to="/academicos" class="nav-button">
                <font-awesome-icon :icon="['fas', 'book-open']" />
                Académicos/as
            </router-link>

            <!-- Concurso agregado aquí -->
            <router-link to="/concurso" class="nav-button">
                <font-awesome-icon :icon="['fas', 'trophy']" />
                Concurso
            </router-link>
        </div>
    </nav>
</template>

<script setup>
// No se necesita lógica JS compleja para este navbar estático.
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2e5c8a;
    /* Color de fondo azul */
    padding: 0.8rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    /* Borde más sutil */
    height: 80px;
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 15px;
    /* Espacio entre el logo y el título */
}

/* Estilo para la imagen del logo PUCV dentro de la navbar */
.navbar-left .logo-pucv-navbar {
    height: 50px;
    /* Ajusta el tamaño del logo según tu imagen */
    object-fit: contain;
}

/* Estilos para el título H1 */
.navbar-left .navbar-title {
    color: white;
    /* Color de texto blanco */
    font-size: 1.8rem;
    /* Ajusta el tamaño de la fuente si es necesario */
    font-weight: 700;
    /* Hace el texto más grueso (bold) */
    margin: 0;
    /* Elimina el margen por defecto del h1 */
    font-family: "Lato", sans-serif;
    /* Asegura que la fuente Lato se use si está cargada */
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
    /* Texto de los botones más oscuro */
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

.nav-button.dropdown {
    position: relative;
}

.nav-button .dropdown-icon {
    margin-left: 5px;
    font-size: 0.8em;
}
</style>