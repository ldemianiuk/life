import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {GameOfLife} from '../life';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private life: GameOfLife;
  private size = 100;
  private cellSize = 8;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.canvas.nativeElement.width = this.size * this.cellSize;
    this.canvas.nativeElement.height = this.size * this.cellSize;
    this.life = new GameOfLife(800);
    this.life.random();
    // this.life.addBlock(2, 2);
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  onClick() {
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  animate() {
    this.life.step();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let x = 0; x < this.size; x += 1) {
      for (let y = 0; y < this.size; y += 1) {
        if (this.life.life[y + 1][x + 1] !== 0) {
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        }
      }
    }
  }

}
