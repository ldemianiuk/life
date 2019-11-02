import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {GameOfLife} from '../life';
import * as seedrandom from 'seedrandom';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('inputSize', { static: true })
  inputSize: ElementRef<HTMLInputElement>;
  @ViewChild('inputCellSize', { static: true })
  inputCellSize: ElementRef<HTMLInputElement>;
  @ViewChild('inputSeed', { static: true })
  inputSeed: ElementRef<HTMLInputElement>;
  @ViewChild('inputBorder', { static: true })
  inputBorder: ElementRef<HTMLInputElement>;
  ctx: CanvasRenderingContext2D;
  life: GameOfLife;
  size = 200;
  cellSize = 4;
  running: boolean;
  paramsChanged: boolean;
  delay = 100;
  timeout: number;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.paramsChanged = false;
    this.running = false;
    this.canvas.nativeElement.width = this.size * this.cellSize;
    this.canvas.nativeElement.height = this.size * this.cellSize;
    this.life = new GameOfLife(this.size);
    const seed = this.inputSeed.nativeElement.value;
    if (seed) {
      seedrandom(seed, {global: true});
    }
    this.life.random();
    // this.life.addBlock(2, 2);
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  run() {
    this.running = !this.running;
    if (this.running) {
      this.ngZone.runOutsideAngular(() => this.animate());
    } else {
      clearTimeout(this.timeout);
    }
  }

  animate() {
    if (this.running) {
      this.life.step();
      this.draw();
      // requestAnimationFrame(() => this.animate());
      this.timeout = setTimeout(() => this.animate(), this.delay);
    }
  }

  draw() {
    if (this.cellSize === 1) {
      this.drawPixels();
    } else {
      this.drawRects();
    }
  }

  drawPixels() {
    // Fast pixel drawing on canvas - https://gist.github.com/biovisualize/5400576
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const buf = new ArrayBuffer(imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);
    const data = new Uint32Array(buf);
    // tslint:disable-next-line:no-bitwise
    const cellColor = 255 << 24;
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.life.cell(i, j) !== 0) {
          data[i * canvasWidth + j] = cellColor;
        }
      }
    }
    imageData.data.set(buf8);
    this.ctx.putImageData(imageData, 0, 0);
  }


  drawRects() {
    const border = this.inputBorder.nativeElement.checked ? 1 : 0;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.life.cell(i, j) !== 0) {
          this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize - border, this.cellSize - border);
        }
      }
    }
  }

  reset() {
    this.stop();
    this.size = +this.inputSize.nativeElement.value;
    if (this.size < 1) {
      this.size = 1;
    }
    this.cellSize = +this.inputCellSize.nativeElement.value;
    if (this.cellSize < 1) {
      this.cellSize = 1;
    }
    this.ngOnInit();
  }

  stop() {
        this.running = false;
        clearTimeout(this.timeout);
        requestAnimationFrame(() => {});
    }

  step() {
    this.stop();
    this.life.step();
    this.draw();
  }
}
