import * as THREE from "three";

export type Entity = {
  id: number;
  type: "WALL" | "PIECE" | null;
};

export type Cell = {
  x: number;
  y: number;
  radius: number;
  index: number;
  entity: Entity;
  state: "NULL" | "HOVERED" | "ACTIVE";
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
        entity: { id: 0, type: null },
        state: "NULL",
      });
      index++;
    }
  }
  return { cells };
}

export class HexGrid {
  state: State;

  constructor(state: State) {
    this.state = state;
  }

  getCellRange(cell: Cell, range: number) {
    cell.state = "ACTIVE";
    let cellsInRange = [...this.getAdjacentCells(cell)];

    // Remove any cells that have an entity
    cellsInRange = cellsInRange.filter((cell) => {
      return cell.entity.type == null;
    });

    for (let i = 1; i < range; i++) {
      cellsInRange.forEach((rangeCell) => {
        //If rangeCell is empty, retrieve adjacent cells
        if (rangeCell.entity.type == null) {
          const adjacentCells = this.getAdjacentCells(rangeCell);
          adjacentCells.forEach((adjCell) => {
            if (adjCell.entity.type == null) cellsInRange.push(adjCell);
          });
        }
      });
    }

    return removeDuplicate(cellsInRange).filter((uniqCell) => {
      return uniqCell.index != cell.index;
    });
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
        closestCell.state = "HOVERED";
      }
    }
  }

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

function removeDuplicate<Type>(arr: Type[]): Type[] {
  const ids = arr.map(({ index }) => index);
  return arr.filter(({ index }, i) => !ids.includes(index, i + 1));
}
