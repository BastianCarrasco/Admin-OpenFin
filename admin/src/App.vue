<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* ----------------------------------------------- */
/* Estilos Globales (Idealmente en un archivo CSS base, e.g., base.css) */
/* ----------------------------------------------- */

/* Reseteo básico de márgenes y padding para asegurar compatibilidad */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* Asegura que el padding y border se incluyen en el ancho/alto total */
}

/* Define el modelo de caja para todos los elementos (opcional, pero buena práctica) */
*,
*::before,
*::after {
  box-sizing: inherit;
}

/* Estilos de la aplicación principal */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  /* margin-top: 0px; Ya no es necesario si se resetea body/html */
}

.content {
  padding: 20px;
  /* Considera si necesitas padding-top si tu navbar es fixed o sticky */
  /* Si el navbar es fijo, el contenido podría quedar debajo. Si es el caso,
     añadir un padding-top al .content igual o mayor a la altura del navbar
     podría ser necesario: padding-top: 80px; (si el navbar tiene 80px de alto) */
}
</style>