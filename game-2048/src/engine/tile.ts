// @export
export class Tile {
  public readonly id: number;
  public value: number;

  private spawnValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  constructor(id: number);
  constructor(id: number, value: number);

  constructor(id: number, value?: number) {
    this.id = id;
    this.value = value ?? this.spawnValue();
  }

  public merge() {
    this.value *= 2;
  }
}

// @export
export type TileSlot = Tile | null;

// @export
export type TileSnapshot = {
  readonly id: number;
  readonly value: number;
} | null;
