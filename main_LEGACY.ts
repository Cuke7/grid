import P5 from "p5";
import { HexGrid, Cell, initState } from "./hex";

const app = document.getElementById("app");
const appwWidth = app?.getBoundingClientRect().width || 50;
const appwHeight = app?.getBoundingClientRect().height || 50;

let p: P5;
const cellSize = 20;

const state = initState({ cols: 25, rows: 12 }, cellSize);

// Init grid with drawHexagon callback function
const grid = new HexGrid(state, (cell: Cell) => {
  p.fill("black");
  p.stroke("white");
  if (cell.entity.type == "PIECE") p.fill("green");
  if (cell.entity.type == "WALL") p.fill("blue");

  if (cell.state == "HOVERED") p.fill("gray");
  if (cell.state == "ACTIVE") p.fill("red");

  p.beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (p.TWO_PI / 6) * i;
    let xOffset = cell.radius * p.cos(angle);
    let yOffset = cell.radius * p.sin(angle);
    p.vertex(cell.x + xOffset, cell.y + yOffset);
  }
  p.endShape(p.CLOSE);
});

// Creating the sketch itself
const sketch = (p5: P5) => {
  p = p5;

  p5.setup = () => {
    const canvas = p5.createCanvas(appwWidth, appwHeight);
    canvas.parent("app");
    p5.frameRate(24);
    initArena();
  };

  // The sketch draw method
  p5.draw = () => {
    p5.clear(1, 1, 1, 1);
    grid.resetCellState();
    grid.drawGrid();
  };
};

new P5(sketch);

function initArena() {
  grid.state.cells[68].entity.type = "WALL";
  grid.state.cells[69].entity.type = "WALL";
  grid.state.cells[70].entity.type = "WALL";
  grid.state.cells[71].entity.type = "WALL";
  grid.state.cells[88].entity.type = "WALL";
  grid.state.cells[89].entity.type = "WALL";
  grid.state.cells[90].entity.type = "WALL";
  grid.state.cells[91].entity.type = "WALL";
  grid.state.cells[92].entity.type = "WALL";
  grid.state.cells[93].entity.type = "WALL";
  grid.state.cells[94].entity.type = "WALL";
  grid.state.cells[95].entity.type = "WALL";
  grid.state.cells[96].entity.type = "WALL";
  grid.state.cells[97].entity.type = "WALL";
  grid.state.cells[98].entity.type = "WALL";
  grid.state.cells[99].entity.type = "WALL";
}
