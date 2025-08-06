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
/* Estilos Globales para toda la aplicación */
/* ----------------------------------------------- */

/*
  Reseteo Básico:
  - Elimina márgenes y paddings predeterminados del navegador.
  - Usa `box-sizing: border-box;` para un control más predecible del diseño.
    Esto significa que el `padding` y `border` se incluirán dentro del
    `width` y `height` especificados del elemento.
*/
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  /* Asegura que el body ocupe toda la altura de la ventana */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* Mueve la fuente aquí para que sea global */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
  /* Un color de fondo suave para toda la app */
  color: #333;
  /* Un color de texto base para toda la app, más oscuro que negro puro */
  overflow-x: hidden;
  /* Evita el scroll horizontal causado por elementos que desbordan */
}

/* Define el modelo de caja para todos los elementos */
*,
*::before,
*::after {
  box-sizing: inherit;
}

/*
  Estilos de la aplicación principal (#app):
  - No es necesario `text-align: center;` aquí, ya que generalmente quieres
    que el contenido de las páginas tenga una alineación normal.
    Si necesitas centrar elementos específicos, hazlo a nivel de componente.
*/
#app {
  display: flex;
  flex-direction: column;
  /* Apila el NavBar y el contenido verticalmente */
  min-height: 100vh;
  /* Asegura que la app ocupe al menos toda la altura de la ventana */
}

/*
  Estilos para el contenedor principal del contenido:
  - Ajusta el padding superior para evitar que el contenido quede debajo
    del NavBar.
  - Un padding general para los lados es buena práctica.dwd
*/
.content {
  flex-grow: 1;
  /* Permite que el contenido ocupe el espacio restante */
  padding: 20px;
  /* Padding general para el contenido */

  /* El padding-top debe compensar la altura del navbar (80px).
     Dado que el menú móvil se superpone (position: absolute),
     no necesitamos un padding-top dinámico.
  */
  padding-top: calc(80px + 20px);
  /* Altura del navbar (80px) + padding deseado (20px) */

  text-align: left;
  /* Restablece la alineación del texto para el contenido */
}

/*
  Media Query para el .content en móviles:
  Asegura que el padding general se ajuste al breakpoint de móvil definido en NavBar.
*/
@media (max-width: 760px) {

  /* <-- CAMBIO AQUÍ: Consistencia con NavBar.vue */
  .content {
    padding: 15px;
    /* Reduce el padding general en pantallas pequeñas */
    padding-top: calc(80px + 15px);
    /* Altura del navbar (80px) + padding deseado (15px) */
  }
}
</style>