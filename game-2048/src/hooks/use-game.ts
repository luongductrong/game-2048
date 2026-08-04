import * as React from "react";
import type { TileSnapshot } from "@/engine/tile";
import { Board, type MoveDirection } from "@/engine/board";
import { readHighScore, writeHighScore } from "@/lib/helpers/high-score";

// @export
export type GameSnapshot = {
  readonly tiles: ReadonlyArray<ReadonlyArray<TileSnapshot>>;
  readonly score: number;
  readonly highScore: number;
  readonly hasWon: boolean;
  readonly isGameOver: boolean;
};

type GameListener = () => void;
type GameHistoryEntry = {
  readonly tiles: ReadonlyArray<ReadonlyArray<TileSnapshot>>;
  readonly score: number;
};

class GameStore {
  private board = new Board();
  private score = 0;
  private highScore = readHighScore();
  private previousState: GameHistoryEntry | null = null;
  private listeners = new Set<GameListener>();
  private snapshot = this.createSnapshot(); // must be initialized after board, score, and highScore

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

    const previousState: GameHistoryEntry = {
      tiles: this.snapshot.tiles,
      score: this.score,
    };
    const result = this.board.move(direction);

    if (!result.moved) {
      return;
    }

    this.previousState = previousState;
    this.score += result.scoreGained;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      writeHighScore(this.highScore);
    }
    this.commit();
  };

  public undo = () => {
    if (!this.previousState) {
      return;
    }

    this.board.restoreTiles(this.previousState.tiles);
    this.score = this.previousState.score;
    this.previousState = null;
    this.commit();
  };

  public reset = () => {
    this.board.reset();
    this.score = 0;
    this.previousState = null;
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
    undo: gameStore.undo,
    reset: gameStore.reset,
  };
}
