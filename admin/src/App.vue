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
/* Estilos globales, si los necesitas. Podrías mover esto a base.css */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top: 0px;
  /* Asegura que la barra de navegación esté en la parte superior */
}

.content {
  padding: 20px;
}
</style>