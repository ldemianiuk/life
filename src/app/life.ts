export class GameOfLife {
  life: number[][];
  n: number;
  private aux: number[][];

  constructor(n: number) {
    this.n = n;
    this.life = [...Array(n + 2)].map(x => [...Array(n + 2)].map(y => 0));
    this.aux = [...Array(n + 2)].map(x => [...Array(n + 2)].map(y => 0));
  }

  random() {
    for (let x = 1; x <= this.n; x += 1) {
      for (let y = 1; y <= this.n; y += 1) {
        this.life[x][y] = Math.round(Math.random());
      }
    }
  }

  clearaux() {
    for (let x = 0; x <= this.n + 1; x += 1) {
      for (let y = 0; y <= this.n + 1; y += 1) {
        this.aux[x][y] = 0;
      }
    }
  }

  step() {
    const indices: number[][] = [-1, 0, 1].map(i => [-1, 0, 1].map(j => [i, j])).flat().filter(([i, j]) => !(i === 0 && j === 0));
    for (let x = 1; x <= this.n; x += 1) {
      for (let y = 1; y <= this.n; y += 1) {
        if (this.life[x][y]) {
          indices.map(([i, j]) => {
            this.aux[x + i][y + j] += 1;
          });
        }
      }
    }
    for (let x = 1; x <= this.n; x += 1) {
      for (let y = 1; y <= this.n; y += 1) {
        const cell = this.aux[x][y];
        if (cell === 3) {
          this.aux[x][y] = 1;
        } else if (cell !== 2) {
          this.aux[x][y] = 0;
        } else {
          this.aux[x][y] = this.life[x][y];
        }
      }
    }
    const tmp = this.life;
    this.life = this.aux;
    this.aux = tmp;
    this.clearaux();
  }

  addBlock(x: number, y: number) {
    this.life[x][y] = 1;
    this.life[x + 1][y] = 1;
    this.life[x][y + 1] = 1;
    this.life[x + 1][y + 1] = 1;
  }
}


declare global {
  interface Array<T> {
    flat(): Array<any>;
  }
}

Array.prototype.flat = function() {
  return [].concat(...this);
};
