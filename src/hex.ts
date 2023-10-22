export type Cell = {
  x: number;
  y: number;
  radius: number;
  index: number;
  content: any;
  state: "NULL" | "HOVERED" | "ACTIVE";
};

export class HexGrid {
  dimensions;
  drawHexagon = (_cell: Cell) => {};
  cells: Cell[] = [];
  cellRadius: number;

  constructor(
    dimensions: { rows: number; cols: number },
    celLRadius: number,
    drawHexagon: (cell: Cell) => void
  ) {
    this.dimensions = dimensions;
    this.cellRadius = celLRadius;
    this.drawHexagon = drawHexagon;
    let index = 0;
    for (let row = 0; row < dimensions.rows; row++) {
      for (let col = 0; col < dimensions.cols; col++) {
        let x = col * ((celLRadius * 3) / 2);
        let y =
          row * (celLRadius * Math.sqrt(3)) +
          ((col % 2) * (celLRadius * Math.sqrt(3))) / 2;
        this.cells.push({
          x: x + this.cellRadius,
          y: y + this.cellRadius,
          radius: celLRadius,
          index,
          content: null,
          state: "NULL",
        });
        index++;
      }
    }
  }

  drawGrid() {
    for (const cell of this.cells) {
      this.drawHexagon(cell);
    }
  }

  // Returns an array containg the adjacent cells
  getAdjacentCells(cell: Cell) {
    const adjacentCells: Cell[] = [];
    for (const otherCell of this.cells) {
      if (cell.index != otherCell.index) {
        if (dist(cell, otherCell) < 2 * cell.radius) {
          adjacentCells.push(otherCell);
        }
      }
    }
    return adjacentCells;
  }

  getHoveredCell(mouseX: number, mouseY: number) {
    for (const cell of this.cells) {
      let distance = Math.sqrt((cell.x - mouseX) ** 2 + (cell.y - mouseY) ** 2);
      if (distance < 0.8 * cell.radius) {
        return cell;
      }
    }
  }

  resetCellState() {
    for (const cell of this.cells) {
      if (cell.state == "HOVERED") cell.state = "NULL";
    }
  }
}

function dist(cell: Cell, otherCell: Cell) {
  return Math.sqrt((cell.x - otherCell.x) ** 2 + (cell.y - otherCell.y) ** 2);
}
