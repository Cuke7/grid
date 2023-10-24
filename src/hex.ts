export type Cell = {
  x: number;
  y: number;
  radius: number;
  index: number;
  content: any;
  state: "NULL" | "HOVERED" | "ACTIVE" | "GREEN";
};

export type State = {
  cells: Cell[];
};

export function initState(
  dimensions: { rows: number; cols: number },
  celLRadius: number
): State {
  let index = 0;
  let cells: Cell[] = [];
  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.cols; col++) {
      let x = col * ((celLRadius * 3) / 2);
      let y =
        row * (celLRadius * Math.sqrt(3)) +
        ((col % 2) * (celLRadius * Math.sqrt(3))) / 2;
      cells.push({
        x: x + celLRadius,
        y: y + celLRadius,
        radius: celLRadius,
        index,
        content: null,
        state: "NULL",
      });
      index++;
    }
  }
  return { cells };
}

export class HexGrid {
  drawHexagon = (_cell: Cell) => {};
  state: State;

  constructor(state: State, drawHexagon: (cell: Cell) => void) {
    (this.state = state), (this.drawHexagon = drawHexagon);
  }

  drawGrid() {
    for (const cell of this.state.cells) {
      this.drawHexagon(cell);
    }
  }

  getCellsBetweenCells(cell1: Cell, cell2: Cell) {
    cell1.state = "ACTIVE";
    cell2.state = "ACTIVE";

    let closestCell = cell1;
    const result: Cell[] = [];

    while (closestCell.index != cell2.index) {
      const adjacentCells = this.getAdjacentCells(closestCell);
      let bestDist = Infinity;
      adjacentCells.forEach((cell) => {
        const currentDist = dist(cell2, cell);
        if (currentDist < bestDist) {
          bestDist = currentDist;
          closestCell = cell;
        }
      });
      if (closestCell.index != cell2.index) {
        result.push(closestCell);
        closestCell.state = "GREEN";
      }
    }
  }

  // Returns an array containg the adjacent cells
  getAdjacentCells(cell: Cell) {
    const adjacentCells: Cell[] = [];
    for (const otherCell of this.state.cells) {
      if (cell.index != otherCell.index) {
        if (dist(cell, otherCell) < 2 * cell.radius) {
          adjacentCells.push(otherCell);
        }
      }
    }
    return adjacentCells;
  }

  getHoveredCell(mouseX: number, mouseY: number) {
    for (const cell of this.state.cells) {
      let distance = Math.sqrt((cell.x - mouseX) ** 2 + (cell.y - mouseY) ** 2);
      if (distance < cell.radius) {
        return cell;
      }
    }
  }

  resetCellState() {
    for (const cell of this.state.cells) {
      cell.state = "NULL";
    }
  }
}

function dist(cell: Cell, otherCell: Cell) {
  return Math.sqrt((cell.x - otherCell.x) ** 2 + (cell.y - otherCell.y) ** 2);
}
