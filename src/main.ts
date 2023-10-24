import P5 from "p5";
import { HexGrid, Cell, initState } from "./hex";

let p: P5;

const state = initState({ rows: 11, cols: 26 }, 20);

// Init grid with drawHexagon callback function
const grid = new HexGrid(state, (cell: Cell) => {
  p.fill("black");
  p.stroke("white");
  if (cell.state == "HOVERED") p.fill("gray");
  if (cell.state == "ACTIVE") p.fill("red");
  if (cell.state == "GREEN") p.fill("green");

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
    const canvas = p5.createCanvas(800, 400);
    canvas.parent("app");
    p5.frameRate(24);
  };

  // The sketch draw method
  p5.draw = () => {
    p5.background("black");
    grid.resetCellState();
    let cell1 = grid.state.cells[0];
    let cell2 = grid.getHoveredCell(p5.mouseX, p5.mouseY);
    if (cell2) {
      grid.getCellsBetweenCells(cell1, cell2);
    }
    grid.drawGrid();
  };

  p5.mouseClicked = () => {
    const cell = grid.getHoveredCell(p5.mouseX, p5.mouseY);
    if (cell) cell.state = "ACTIVE";
  };
};

new P5(sketch);
