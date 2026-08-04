import { Tile } from "./tile";

// @export
export type TileSlot = Tile | null;
// @export
export type MergeDirection = "left" | "right";

// @export
export class Line {
  private readonly _tiles: TileSlot[];
  private readonly size: number;

  public constructor(tiles: ReadonlyArray<TileSlot>, size: number) {
    if (tiles.length !== size) {
      throw new Error("Line length must match its size.");
    }

    this.size = size;
    this._tiles = [...tiles];
  }

  public get tiles(): ReadonlyArray<TileSlot> {
    return this._tiles;
  }

  public merge(direction: MergeDirection): number {
    const workingTiles =
      direction === "left" ? [...this._tiles] : [...this._tiles].reverse();
    const lineTiles = workingTiles.filter(
      (tile): tile is Tile => tile !== null,
    );
    let scoreGained = 0;
    const mergedTiles: TileSlot[] = [];

    for (let i = 0; i < lineTiles.length; i++) {
      const currentTile = lineTiles[i];
      const nextTile = lineTiles[i + 1];

      if (nextTile && currentTile.value === nextTile.value) {
        nextTile.merge();
        scoreGained += nextTile.value;
        mergedTiles.push(nextTile);
        i++;
      } else {
        mergedTiles.push(currentTile);
      }
    }

    while (mergedTiles.length < this.size) {
      mergedTiles.push(null);
    }

    const resultTiles =
      direction === "left" ? mergedTiles : mergedTiles.reverse();

    this._tiles.splice(0, this.size, ...resultTiles);
    return scoreGained;
  }

  public toArray(): TileSlot[] {
    return [...this._tiles];
  }
}
