export class Figure {
  constructor(pattern) {
    this.size = 5;
    this.pattern = pattern;
    this.matrix = this.toMatrix(pattern);
    this.matrix = this.normalize(this.matrix);
  }

  toMatrix(pattern) {
    const m = [];
    for (let i = 0; i < this.size; i++) {
      m.push(pattern.slice(i * this.size, (i + 1) * this.size).split(""));
    }
    return m;
  }

  toString(matrix) {
    return matrix.map((row) => row.join("")).join("");
  }

  rotate(matrix) {
    const n = this.size;
    const res = Array.from({ length: n }, () => Array(n).fill("0"));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        res[j][n - 1 - i] = matrix[i][j];
      }
    }
    return res;
  }

  flip(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  normalize(matrix) {
    const n = this.size;

    // найти минимальные сдвиги
    let minRow = n,
      minCol = n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === "1") {
          minRow = Math.min(minRow, i);
          minCol = Math.min(minCol, j);
        }
      }
    }

    // сдвинуть
    const res = Array.from({ length: n }, () => Array(n).fill("0"));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === "1") {
          res[i - minRow][j - minCol] = "1";
        }
      }
    }
    return res;
  }

  equals(other) {
    let variants = [];

    let m = other.matrix;
    for (let i = 0; i < 4; i++) {
      variants.push(this.toString(this.normalize(m))); // без отражения
      variants.push(this.toString(this.normalize(this.flip(m)))); // отражённая
      m = this.rotate(m);
    }

    const current = this.toString(this.matrix);
    return variants.includes(current);
  }
}
