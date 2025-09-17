<template>
  <div class="d-flex ga-2 w-100 justify-center container">
    <canvas
      ref="canvas"
      :width="glass[0]"
      :height="glass[1]"
    />
    <div
      class="grid-tetris"
      :width="glass[0]"
      :height="glass[1]"
    >
      <div
        v-for="n in (glass[0] * glass[1]) / glass[2] ** 2"
        :key="n"
        :width="glass[2]"
        :height="glass[2]"
      />
    </div>
    <div class="d-flex align-center flex-column stats text-h6">
      <span> Счёт: </span>
      <span>{{ score }}</span>
      <div class="preview-container mt-4">
        <canvas
          ref="previewCanvas"
          width="150"
          height="150"
        />
        <div
          class="grid-preview"
          :width="glass[0]"
          :height="glass[1]"
        >
          <div
            v-for="n in 25"
            :key="n"
            :width="glass[2]"
            :height="glass[2]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const score = ref(0);
const canvas = ref(null);
const previewCanvas = ref(null); // Добавляем реф для превью
const colors = ["red", "purple", "blue", "green", "yellow", "orange", "pink"];

const glass = [360, 600, 30];
const cell = [glass[0] / glass[2], glass[1] / glass[2]];
const dropIntervals = {
  // Скорость падения фигур 2 кл/с - 10кл/с
  lvl1: 500,
  lvl2: 400,
  lvl3: 300,
  lvl4: 200,
  lvl5: 100,
};
let context,
  previewContext, // Контекст для превью
  arena,
  player,
  nextPiece = null, // Храним следующую фигуру
  dropCounter = 0,
  dropInterval = dropIntervals.lvl1, // Скорость падения фигур
  lastTime = 0;

function arenaSweep() {
  let rowCount = 0;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0];
    arena.unshift(row);
    rowCount++;
  }

  // Начисляем очки за очищенные линии
  if (rowCount > 0) {
    score.value += rowCount * 100;
    // Сохранение очков
    sessionStorage.setItem("tetris-user-score", score.value);
    // Изменение уровня по очкам
    if (score.value >= 1000 && score.value <= 2000) {
      dropInterval = dropIntervals.lvl2;
    } else if (score.value >= 2000 && score.value <= 3000) {
      dropInterval = dropIntervals.lvl3;
    } else if (score.value >= 3000 && score.value <= 4000) {
      dropInterval = dropIntervals.lvl4;
    } else if (score.value >= 5000) {
      dropInterval = dropIntervals.lvl5;
    }
  }
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  return Array.from({ length: h }, () => Array(w).fill(0));
}

function createPiece(type) {
  let r = Math.floor(Math.random() * colors.length - 1);
  if (r <= 0) {
    r = 1;
  }
  if (type === "T")
    return [
      [0, 0, 0, 0, 0],
      [0, 0, r, 0, 0],
      [0, r, r, r, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "O")
    return [
      [0, 0, 0, 0, 0],
      [0, r, r, 0, 0],
      [0, r, r, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "L")
    return [
      [0, 0, 0, 0, 0],
      [0, 0, 0, r, 0],
      [0, r, r, r, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "J")
    return [
      [0, 0, 0, 0, 0],
      [0, r, 0, 0, 0],
      [0, r, r, r, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "I")
    return [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [r, r, r, r, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "S")
    return [
      [0, 0, 0, 0, 0],
      [0, 0, r, r, 0],
      [0, r, r, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  if (type === "Z")
    return [
      [0, 0, 0, 0, 0],
      [0, r, r, 0, 0],
      [0, 0, r, r, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
}

function draw() {
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, cell[0], cell[1]);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;

  // Добавляем очки за принудительный сброс
  score.value += 2;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = "TJLOSZI";

  // Если следующей фигуры нет - создаем
  if (!nextPiece) {
    nextPiece = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  }
  // Берем текущую фигуру из следующей
  player.matrix = nextPiece;
  // Генерируем новую следующую фигуру
  nextPiece = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);

  player.pos.y = 0;
  player.pos.x =
    Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);

  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
  }

  // Отрисовываем следующую фигуру
  drawNextPiece();
}
// Новая функция для отрисовки превью
function drawNextPiece() {
  previewContext.fillStyle = "#FFFFFF";
  previewContext.fillRect(0, 0, 100, 100);

  // Центрируем фигуру в превью
  const offset = {
    x: (5 - nextPiece[0].length) / 2,
    y: (5 - nextPiece.length) / 2,
  };

  drawMatrix(nextPiece, offset, previewContext);
}

// Модифицируем drawMatrix для работы с любым контекстом
function drawMatrix(matrix, offset, ctx = context) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value - 1];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function playerRotate() {
  const m = player.matrix;
  // Поворот на 90 градусов по часовой стрелке
  const tempMatrix = m.map((_, i) => m.map((row) => row[i])).reverse();
  player.matrix = tempMatrix;

  // Если после поворота есть коллизия, откатить изменения
  if (collide(arena, player)) {
    // Повернуть матрицу обратно
    const revertedMatrix = tempMatrix
      .map((_, i) => tempMatrix.map((row) => row[i]))
      .reverse();
    player.matrix = revertedMatrix;
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

onMounted(() => {
  // Основной контекст
  context = canvas.value.getContext("2d");
  context.scale(glass[2], glass[2]);

  // Контекст превью
  previewContext = previewCanvas.value.getContext("2d");
  previewContext.scale(glass[2], glass[2]); // Масштаб для превью

  arena = createMatrix(cell[0], cell[1]);
  player = { pos: { x: 0, y: 0 }, matrix: null };
  playerReset();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") playerMove(-1);
    else if (e.key === "ArrowRight") playerMove(1);
    else if (e.key === "ArrowDown") playerDrop();
    else if (e.key === "ArrowUp") playerRotate();
  });

  update();
});
</script>

<style scoped>
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

canvas {
  position: relative;
}

.grid-tetris {
  position: absolute;
  display: grid;
  width: 360px;
  left: 150px;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  box-shadow: 0 0 2px black;
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
  box-shadow: 0 0 2px black;
}

.grid-tetris div {
  width: 30px;
  height: 30px;
  border: 1px solid #c1c1c1;
}

.grid-preview div {
  width: 30px;
  height: 30px;
  border: 1px solid #c1c1c1;
}
</style>
