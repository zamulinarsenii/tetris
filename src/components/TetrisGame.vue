<template>
  <!-- Рендерим игровую область только после загрузки grid -->
  <div class="d-flex ga-2 w-100 justify-center container" v-if="grid">
    <div class="container-tetris">
      <canvas ref="canvas" :width="grid[0]" :height="grid[1]" />
      <div
        v-if="shouldBeGrid"
        class="grid-tetris"
        :style="{
          width: grid[0] + 'px',
          height: grid[1] + 'px',
          gridTemplateColumns: `repeat(${grid[0] / cellSize}, ${cellSize}px)`,
        }"
      >
        <div
          v-for="n in (grid[0] * grid[1]) / cellSize ** 2"
          :key="n"
          :width="cellSize"
          :height="cellSize"
        />
      </div>
    </div>

    <div class="d-flex align-center flex-column stats text-h6">
      <span> Счёт: </span>
      <span>{{ score }}</span>
      <div class="preview-container mt-4">
        <canvas ref="previewCanvas" width="150" height="150" />
        <div
          class="grid-preview"
          :width="grid[0]"
          :height="grid[1]"
          v-if="shouldBePreview"
        >
          <div v-for="n in 25" :key="n" :width="cellSize" :height="cellSize" />
        </div>
      </div>
    </div>
  </div>

  <!-- Попап Game Over -->
  <div v-if="isGameOver" class="game-over-popup">
    <p>Игра окончена!</p>
    <p>Счёт: {{ score }}</p>
    <p>Время: {{ timer }}</p>
    <button @click="restartGame">Начать заново</button>
  </div>
</template>

<script setup>
/*
  Исправленный и рабочий вариант:
  - корректная инициализация cell/arena/grid
  - единый поток инициализации: loadLevel() выполняется перед созданием контекстов
  - при Game Over выставляем isGameOver = true и останавливаем update()
  - restartGame корректно пересоздаёт арену и запускает игру заново
*/

import { onMounted, onBeforeUnmount, ref } from "vue";
import { useGetLevelById } from "@/api/levels";
import { useGetFiguresById } from "@/api/level-use-figures";
import { useSaveGame } from "@/api/game"; // если у тебя есть API сохранения игры
import { useSaveLevelHistory } from "@/api/levelHistory";

// ---------- Состояние и константы ----------
let level; // объект уровня с бэка
let figures = []; // массив фигур уровня
const cellSize = 30; // px на клетку
const score = ref(0);
const timer = ref(0);
const canvas = ref(null);
const previewCanvas = ref(null);
const grid = ref(null); // [widthPx, heightPx]
const isGameOver = ref(false);

const colors = ["red", "purple", "blue", "green", "yellow", "orange", "pink"];

// игровые переменные (не реактивные)
let context;
let previewContext;
let cell; // [cols, rows] (количество клеток)
let arena; // матрица rows x cols
let gameId;
let player;
let nextPiece = null;
let dropCounter = 0;
let dropInterval = 500; // будет задан в loadLevel
let lastTime = 0;
let timeStart = Date.now();
const shouldBeGrid = ref(true);
const shouldBePreview = ref(true);
// для отписки слушателя клавиш
let keyHandler = null;

// ---------- Загрузка уровня (правильная) ----------
const loadLevel = async () => {
  const levelId = sessionStorage.getItem("tetris-level");
  level = await useGetLevelById(levelId);
  figures = await useGetFiguresById(levelId);
  shouldBePreview.value = level.shouldBePreview;
  shouldBeGrid.value = level.shouldBeGrid;
  // сохраняем игру (если нужно)
  const userId = sessionStorage.getItem("tetrisUserId");
  if (useSaveGame && userId) {
    gameId = await useSaveGame(userId);
    console.log("gameId:", gameId);
  }

  // количество клеток поля
  const cols = level.grid.width;
  const rows = level.grid.height;

  // grid в пикселях для canvas
  grid.value = [cols * cellSize, rows * cellSize];

  // сохраняем cell (количество клеток) и создаём арену
  cell = [cols, rows];
  arena = createMatrix(cols, rows);

  // задаём скорость падения, учтём значение уровня (level.speed)
  // dropInterval в миллисекундах; настрой под нужную логику
  dropInterval = Math.max(50, 500 - (level.speed - 1) * 50); // пример
  console.log("Loaded level:", level, "cols/rows:", cols, rows);
};

// ---------- Утилиты ----------
function createMatrix(cols, rows) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function createPiece(patternStr, rows = 5, cols = 5) {
  // корректный индекс цвета 1..colors.length
  const color = Math.floor(Math.random() * colors.length) + 1;
  const normalized = (String(patternStr) + "0".repeat(rows * cols)).slice(
    0,
    rows * cols
  );
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const ch = normalized[i * cols + j];
      row.push(ch === "1" ? color : 0);
    }
    matrix.push(row);
  }
  return matrix;
}

// рисует любую матрицу в контексте (в масштабе, так как context.scale вызван)
function drawMatrix(matrix, offset, ctx = context) {
  if (!matrix) return;
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value - 1] || colors[0];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// ---------- Логика игры ----------
function collide(arenaLocal, playerLocal) {
  const [m, o] = [playerLocal.matrix, playerLocal.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] !== 0 &&
        (arenaLocal[y + o.y] && arenaLocal[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge(arenaLocal, playerLocal) {
  playerLocal.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arenaLocal[y + playerLocal.pos.y][x + playerLocal.pos.x] = value;
      }
    });
  });
}

function arenaSweep() {
  let rowCount = 0;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    // удаляем полную строку и добавляем пустую сверху
    arena.splice(y, 1);
    arena.unshift(new Array(arena[0].length).fill(0));
    rowCount++;
  }

  if (rowCount > 0) {
    score.value += rowCount * 100;
    sessionStorage.setItem("tetris-user-score", score.value);
  }
}

function draw() {
  if (!context) return;
  // очищаем (в единицах клеток, потому что context.scale уже установлен)
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, cell[0], cell[1]);

  drawMatrix(arena, { x: 0, y: 0 });
  if (player && player.matrix) drawMatrix(player.matrix, player.pos);
}

// падение фигуры на 1
function playerDrop() {
  if (!player) return;
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    arenaSweep();
    playerReset();
  } else {
    // очки за принудительное падение
    score.value += 2;

    // прим. логика ускорения (если нужно)
    let scoreBefore = Math.trunc((score.value - 2) / (level.pointsLimit || 1));
    let scoreAfter = Math.trunc(score.value / (level.pointsLimit || 1));
    if (scoreAfter - scoreBefore > 0) {
      const newDrop = dropInterval - scoreAfter * 100 * (level.speed || 1);
      dropInterval = Math.max(50, newDrop);
    }
  }
  dropCounter = 0;
}

function playerMove(dir) {
  if (!player) return;
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
}

function rotateMatrix(matrix, dir = 1) {
  const N = matrix.length;
  const trans = Array.from({ length: N }, () => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      trans[x][y] = matrix[y][x];
    }
  }
  if (dir > 0) return trans.map((row) => row.reverse());
  return trans.reverse();
}

function playerRotate(dir = 1) {
  if (!player) return;
  const posX = player.pos.x;
  const old = player.matrix;
  const rotated = rotateMatrix(old, dir);
  player.matrix = rotated;

  let offset = 1;
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (Math.abs(offset) > rotated[0].length) {
      player.matrix = old;
      player.pos.x = posX;
      return;
    }
  }
}

function playerReset() {
  // если нет следующей — создаём
  if (!nextPiece) {
    const pat = figures[Math.floor(Math.random() * figures.length)].pattern;
    nextPiece = createPiece(pat);
  }

  player.matrix = nextPiece;

  // создаём новый nextPiece
  const pat = figures[Math.floor(Math.random() * figures.length)].pattern;
  nextPiece = createPiece(pat);

  // позиция по центру по X, сверху
  player.pos = {
    x:
      Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2),
    y: 0,
  };

  // если фигура не помещается — game over
  if (collide(arena, player)) {
    isGameOver.value = true;
    timer.value = Math.floor((Date.now() - timeStart) / 1000);
    saveLevelHistory();
    console.log("Game Over!");
    return;
  }

  drawNextPiece();
}

const saveLevelHistory = async () => {
  await useSaveLevelHistory(level.id, gameId.id, score.value, timer.value);
};

function hardDrop() {
  if (!player || isGameOver.value) return;

  let dropDistance = 0;

  // пока не столкнемся
  while (!collide(arena, player)) {
    player.pos.y++;
    dropDistance++;
  }

  // если вылезли за арену — откат на шаг назад
  player.pos.y--;

  // фиксируем фигуру
  merge(arena, player);
  arenaSweep();
  playerReset();

  // очки за hard drop (по 2 за клетку)
  score.value += dropDistance * 2;

  dropCounter = 0;
}

function drawNextPiece() {
  if (!previewContext || !nextPiece) return;
  previewContext.fillStyle = "#FFFFFF";
  previewContext.fillRect(0, 0, 100, 100);

  const offset = {
    x: (5 - nextPiece[0].length) / 2,
    y: (5 - nextPiece.length) / 2,
  };
  drawMatrix(nextPiece, offset, previewContext);
}

function update(time = 0) {
  if (isGameOver.value) return; // останавливаем цикл при GameOver

  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  draw();
  requestAnimationFrame(update);
}

// ---------- Перезапуск игры ----------
function restartGame() {
  // arena пересоздаём по текущим cell (cols, rows)
  arena = createMatrix(cell[0], cell[1]);
  score.value = 0;
  isGameOver.value = false;
  nextPiece = null;
  player = { pos: { x: 0, y: 0 }, matrix: null };
  playerReset();
  lastTime = 0;
  timeStart = Date.now();
  dropCounter = 0;
  update();
}

// ---------- Инициализация на mounted ----------
onMounted(async () => {
  await loadLevel(); // ждём загрузки уровня и фигур

  // получаем контексты канвасов и масштабируем: 1 единица = 1 клетка
  context = canvas.value.getContext("2d");
  context.scale(cellSize, cellSize);

  previewContext = previewCanvas.value.getContext("2d");
  previewContext.scale(cellSize, cellSize);

  // player, arena уже подготовлены в loadLevel (arena создан), но всё равно инициализируем player
  player = { pos: { x: 0, y: 0 }, matrix: null };
  playerReset();

  // слушатель клавиш — сохраняем ссылку, чтобы можно было отписаться
  keyHandler = (e) => {
    if (isGameOver.value) return;
    // Предотвращаем стандартное поведение пробела (проскролл страницы)
    if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      hardDrop();
      return;
    }
    if (e.key === "ArrowLeft") playerMove(-1);
    else if (e.key === "ArrowRight") playerMove(1);
    else if (e.key === "ArrowDown") playerDrop();
    else if (e.key === "ArrowUp") playerRotate(1);
  };
  document.addEventListener("keydown", keyHandler);

  // старт игрового цикла
  update();
});

// отписка при размонтировании компонента
onBeforeUnmount(() => {
  if (keyHandler) document.removeEventListener("keydown", keyHandler);
});
</script>

<style scoped>
/* ... оставил твои стили как есть ... */
.container {
  position: relative;
  left: 100px;
}

.stats {
  position: relative;
  background: #fff;
  padding: 10px;
  width: 200px;
  height: fit-content;
  border-radius: 5px;
}
.container-tetris {
  position: relative;
}
canvas {
  position: relative;
}

.grid-tetris {
  position: absolute;
  display: grid;
  width: 300px;
  left: 0px;
  top: 0;

  grid-template-rows: auto;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.grid-preview {
  position: absolute;
  display: grid;
  margin: 0 !important;
  bottom: 20px;
  width: 150px;
  height: 150px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.grid-tetris div {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.grid-preview div {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.game-over-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}
.game-over-popup button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
