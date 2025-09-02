<template>
    <div class="construction">
        <h1>Página en Construcción</h1>
        <p>Esta página se encuentra actualmente en construcción. Por favor, regresa más tarde.</p>
        <span class="construction-icon">🚧</span>
    </div>
</template>

<style scoped>
/* Puedes añadir algunos estilos básicos si lo deseas */
.construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    /* Para que ocupe gran parte de la altura de la ventana */
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
    padding: 20px;
}

.construction h1 {
    font-size: 3em;
    color: #007bff;
    /* Un color distintivo */
    margin-bottom: 20px;
}

.construction p {
    font-size: 1.2em;
    margin-bottom: 30px;
    max-width: 600px;
}

.construction-icon {
    font-size: 5em;
    /* Icono grande */
    animation: bounce 2s infinite;
    /* Una pequeña animación */
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-30px);
    }

    60% {
        transform: translateY(-15px);
    }
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .construction h1 {
        font-size: 2.5em;
    }

    .construction p {
        font-size: 1em;
    }

    .construction-icon {
        font-size: 4em;
    }
}
</style>

<style scoped>
.construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    /* Ajusta la altura según tus necesidades */
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
    padding: 20px;
}

.construction h1 {
    font-size: 4em;
    /* Hace el título mucho más grande */
    color: #f39c12;
    /* Un color naranja típico de construcción */
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.construction p {
    font-size: 1.5em;
    margin-bottom: 30px;
    max-width: 600px;
}

.construction-icon {
    font-size: 8em;
    /* Hace el icono de construcción muy grande */
    color: #f39c12;
    animation: pulse 1.5s infinite alternate;
    /* Añade una animación de pulsación */
}

/* Animación de pulsación */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.1);
    }
}

/* Para un efecto de "cinta de precaución" si lo deseas (opcional) */
.construction::before {
    content: "⚠️ CAUTION ⚠️";
    display: block;
    font-size: 1.8em;
    color: #e74c3c;
    /* Rojo de advertencia */
    background-color: #f9e79f;
    /* Amarillo de advertencia */
    padding: 10px 20px;
    border: 2px dashed #e74c3c;
    margin-bottom: 30px;
    transform: rotate(-5deg);
    /* Ligeramente inclinado */
}
</style>