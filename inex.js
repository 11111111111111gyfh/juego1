const playerCar = document.getElementById("player-car");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");
const scoreListElement = document.getElementById("score-list");

let playerX = 180; // Posición inicial del coche del jugador
let score = 0;
let gameSpeed = 5;
let enemies = []; // Array para almacenar los enemigos
let playerSpeed = 40; // Velocidad del coche (aumentada de 20 a 40 píxeles)

// Array para almacenar las puntuaciones
let highScores = JSON.parse(localStorage.getItem("highScores")) || []; // Cargar las puntuaciones desde localStorage si existen

// Mostrar las puntuaciones al inicio del juego
updateScoreboard();

// Movimiento del jugador
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed; // Movimiento más rápido hacia la izquierda
  } else if (event.key === "ArrowRight" && playerX < 360) {
    playerX += playerSpeed; // Movimiento más rápido hacia la derecha
  }
  playerCar.style.left = playerX + "px";
});

// Crear un nuevo enemigo
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 360) + "px"; // Posición aleatoria
  gameContainer.appendChild(enemy);
  enemies.push({ element: enemy, y: -70 }); // Añadir al array de enemigos
}

// Actualizar los enemigos
function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.y += gameSpeed; // Mover enemigo hacia abajo
    enemy.element.style.top = enemy.y + "px";

    // Si el enemigo sale de la pantalla
    if (enemy.y > 600) {
      enemy.y = -70; // Volver a la parte superior
      enemy.element.style.left = Math.floor(Math.random() * 360) + "px"; // Nueva posición aleatoria
      score++;
      scoreElement.textContent = "Puntaje: " + score;

      // Incrementar la velocidad cada 5 puntos
      if (score % 5 === 0) {
        gameSpeed++;
      }
    }

    // Detectar colisión
    const enemyRect = enemy.element.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();
    if (
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      alert("¡Choque! Tu puntaje final es: " + score);
      saveScore(score); // Guardar puntuación cuando el jugador pierde
      resetGame();
    }
  });
}

// Guardar puntuación en el array y actualizar la clasificación
function saveScore(newScore) {
  // Añadir la puntuación al array de puntuaciones
  highScores.push(newScore);

  // Ordenar las puntuaciones de mayor a menor y mantener solo las 10 mejores
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 10);

  // Guardar las puntuaciones en localStorage
  localStorage.setItem("highScores", JSON.stringify(highScores));

  // Actualizar el cuadro de puntuaciones
  updateScoreboard();
}

// Actualizar la lista de puntuaciones
function updateScoreboard() {
  scoreListElement.innerHTML = ""; // Limpiar la lista actual

  // Añadir las 10 mejores puntuaciones
  highScores.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${score}`;
    scoreListElement.appendChild(listItem);
  });
}

// Reiniciar el juego
function resetGame() {
  enemies.forEach((enemy) => {
    gameContainer.removeChild(enemy.element);
  });
  enemies = [];
  score = 0;
  gameSpeed = 5;
  scoreElement.textContent = "Puntaje: 0";
  createEnemy(); // Crear un primer enemigo
}

// Bucle principal del juego
function gameLoop() {
  updateEnemies();
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego
createEnemy(); // Crear el primer enemigo
gameLoop();

// Crear un enemigo cada 10 segundos
setInterval(() => {
  createEnemy(); // Crear un nuevo enemigo
}, 10000); // 10000 milisegundos = 10 segundos
