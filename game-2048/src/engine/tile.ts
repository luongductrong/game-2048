export class Tile {
  public readonly id: number;
  public value: number;

  private spawnValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  public constructor(id: number) {
    this.id = id;
    this.value = this.spawnValue();
  }

  public merge() {
    this.value *= 2;
  }
}
