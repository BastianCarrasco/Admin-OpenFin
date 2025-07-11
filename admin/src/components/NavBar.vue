<template>
    <nav class="navbar">
        <div class="navbar-brand">Admin OPEN-FIN</div>
        <ul class="navbar-links">
            <li>
                <router-link to="/empresas" class="nav-link">Empresas</router-link>
            </li>
            <li>
                <router-link to="/academicos" class="nav-link">Académicos</router-link>
            </li>
            <li>
                <router-link to="/concurso" class="nav-link">Concurso</router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.navbar-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

.navbar-links li {
    margin-left: 1.5rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #42b983;
    /* Un color de acento de Vue */
}

/* Estilo para el enlace activo */
.router-link-active {
    font-weight: bold;
    color: #42b983;
    /* Un color de acento para el enlace activo */
}
</style>