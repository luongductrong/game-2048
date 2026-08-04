import { Tile } from "./tile";
import { Line } from "./line";
import type { MergeDirection, TileSlot } from "./line";

type MoveDirection = "left" | "right" | "up" | "down";
type CellPosition = [row: number, col: number];

export class Board {
  private static SIZE = 4;
  private nextTileId = 0;
  private _tiles: TileSlot[][];

  public get tiles(): ReadonlyArray<ReadonlyArray<Tile | null>> {
    return this._tiles;
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
    return this._tiles.map((row) => row.map((tile) => tile?.value ?? null));
  }

  public move(direction: MoveDirection): boolean {
    const before = this.serializeTiles();
    const mergeDirection = this.getMergeDirection(direction);

    for (let index = 0; index < Board.SIZE; index++) {
      const line = this.getLine(index, direction);

      line.merge(mergeDirection);
      this.setLine(index, direction, line);
    }

    const after = this.serializeTiles();
    const hasChanged = JSON.stringify(before) !== JSON.stringify(after);

    if (hasChanged) {
      this.spawnTile();
    }

    return hasChanged;
  }
}
