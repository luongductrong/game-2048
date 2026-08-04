import { Line, type MergeDirection } from "./line";
import { Tile, type TileSlot, type TileSnapshot } from "./tile";

// @export
export type MoveDirection = "left" | "right" | "up" | "down";
type CellPosition = [row: number, col: number];

// @export
export type MoveResult = {
  moved: boolean;
  scoreGained: number;
};

// @export
export class Board {
  private static SIZE = 4;
  private static WINNING_VALUE = 2048;
  private nextTileId = 0;
  private _tiles: TileSlot[][];

  public get tiles(): ReadonlyArray<ReadonlyArray<TileSlot>> {
    return this._tiles;
  }

  public get hasWon(): boolean {
    return this._tiles.some((row) =>
      row.some((tile) => tile !== null && tile.value >= Board.WINNING_VALUE),
    );
  }

  public get isGameOver(): boolean {
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    for (let row = 0; row < Board.SIZE; row++) {
      for (let col = 0; col < Board.SIZE; col++) {
        const currentTile = this._tiles[row][col];

        if (
          col < Board.SIZE - 1 &&
          currentTile?.value === this._tiles[row][col + 1]?.value
        ) {
          return false;
        }

        if (
          row < Board.SIZE - 1 &&
          currentTile?.value === this._tiles[row + 1][col]?.value
        ) {
          return false;
        }
      }
    }

    return true;
  }

  private getEmptyCells(): CellPosition[] {
    const emptyCells: CellPosition[] = [];

    for (let row = 0; row < Board.SIZE; row++) {
      for (let col = 0; col < Board.SIZE; col++) {
        if (this._tiles[row][col] === null) {
          emptyCells.push([row, col]);
        }
      }
    }
    return emptyCells;
  }

  private spawnTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      throw new Error("No empty cells available to spawn a new tile.");
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this._tiles[row][col] = new Tile(this.nextTileId++);
  }

  public constructor() {
    this._tiles = Array(Board.SIZE)
      .fill(null)
      .map(() => Array(Board.SIZE).fill(null));

    this.spawnTile();
    this.spawnTile();
  }

  public reset() {
    this._tiles = Array(Board.SIZE)
      .fill(null)
      .map(() => Array(Board.SIZE).fill(null));

    this.nextTileId = 0;
    this.spawnTile();
    this.spawnTile();
  }

  // prettier-ignore
  public restoreTiles(tiles: ReadonlyArray<ReadonlyArray<TileSnapshot>>) {
    if (tiles.length !== Board.SIZE) {
      throw new Error("Board tiles row count must match board size.");
    }

    this._tiles = tiles.map((row) => {
      if (row.length !== Board.SIZE) {
        throw new Error("Board tiles column count must match board size.");
      }

      return row.map((tile) =>
        tile === null ? null : new Tile(tile.id, tile.value),
      );
    });
  }

  private getLine(index: number, direction: MoveDirection): Line {
    if (direction === "left" || direction === "right") {
      return new Line(this._tiles[index], Board.SIZE);
    }

    const tiles: TileSlot[] = [];

    for (let row = 0; row < Board.SIZE; row++) {
      tiles.push(this._tiles[row][index]);
    }

    return new Line(tiles, Board.SIZE);
  }

  private setLine(index: number, direction: MoveDirection, line: Line) {
    const tiles = line.toArray();

    if (direction === "left" || direction === "right") {
      this._tiles[index] = tiles;
      return;
    }

    for (let row = 0; row < Board.SIZE; row++) {
      this._tiles[row][index] = tiles[row];
    }
  }

  private getMergeDirection(direction: MoveDirection): MergeDirection {
    return direction === "left" || direction === "up" ? "left" : "right";
  }

  private serializeTiles() {
    return this._tiles.map((row) => row.map((tile) => tile?.value ?? null)); // get the value of the tile or null if it's empty
  }

  public move(direction: MoveDirection): MoveResult {
    const before = this.serializeTiles();
    const mergeDirection = this.getMergeDirection(direction);
    let scoreGained = 0;

    for (let index = 0; index < Board.SIZE; index++) {
      const line = this.getLine(index, direction);

      scoreGained += line.merge(mergeDirection);
      this.setLine(index, direction, line);
    }

    const after = this.serializeTiles();
    const hasChanged = JSON.stringify(before) !== JSON.stringify(after);

    if (hasChanged) {
      this.spawnTile();
    }

    return {
      moved: hasChanged,
      scoreGained: hasChanged ? scoreGained : 0,
    };
  }
}
