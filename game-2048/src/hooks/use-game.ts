import * as React from "react";
import { Board, type MoveDirection } from "@/engine/board";

// @export
export type TileSnapshot = {
  readonly id: number;
  readonly value: number;
};

// @export
export type GameSnapshot = {
  readonly tiles: ReadonlyArray<ReadonlyArray<TileSnapshot | null>>;
  readonly score: number;
  readonly highScore: number;
  readonly hasWon: boolean;
  readonly isGameOver: boolean;
};

type GameListener = () => void;

class GameStore {
  private board = new Board();
  private score = 0;
  private highScore = 0;
  private listeners = new Set<GameListener>();
  private snapshot = this.createSnapshot();

  public subscribe = (listener: GameListener) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = () => {
    return this.snapshot;
  };

  public move = (direction: MoveDirection) => {
    if (this.board.isGameOver) {
      return;
    }

    const result = this.board.move(direction);

    if (!result.moved) {
      return;
    }

    this.score += result.scoreGained;
    this.highScore = Math.max(this.highScore, this.score);
    this.commit();
  };

  public reset = () => {
    this.board.reset();
    this.score = 0;
    this.commit();
  };

  private commit() {
    this.snapshot = this.createSnapshot();
    this.emitChange();
  }

  private emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private createSnapshot(): GameSnapshot {
    return {
      tiles: this.board.tiles.map((row) =>
        row.map((tile) =>
          tile === null
            ? null
            : {
                id: tile.id,
                value: tile.value,
              },
        ),
      ),
      score: this.score,
      highScore: this.highScore,
      hasWon: this.board.hasWon,
      isGameOver: this.board.isGameOver,
    };
  }
}

const gameStore = new GameStore();

// @export
export function useGame() {
  const snapshot = React.useSyncExternalStore(
    gameStore.subscribe,
    gameStore.getSnapshot,
    gameStore.getSnapshot,
  );

  return {
    ...snapshot,
    move: gameStore.move,
    reset: gameStore.reset,
  };
}
