//Example by v0.dev
import React, { useState, useEffect } from "react";

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[]>(Array(CELL_COUNT).fill(0));
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    initBoard();
  }, []);

  const initBoard = () => {
    const newBoard = Array(CELL_COUNT).fill(0);
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (currentBoard: number[]) => {
    const emptyTiles = currentBoard.reduce(
      (acc: number[], curr, index) => (curr === 0 ? [...acc, index] : acc),
      []
    );
    if (emptyTiles.length > 0) {
      const randomIndex =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      currentBoard[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;

    let newBoard = [...board];
    let changed = false;
    let newScore = score;

    const moveLineOrColumn = (line: number[]) => {
      const nonZeroTiles = line.filter((tile) => tile !== 0);
      const mergedTiles: number[] = [];
      for (let i = 0; i < nonZeroTiles.length; i++) {
        if (
          i < nonZeroTiles.length - 1 &&
          nonZeroTiles[i] === nonZeroTiles[i + 1]
        ) {
          mergedTiles.push(nonZeroTiles[i] * 2);
          newScore += nonZeroTiles[i] * 2;
          i++;
        } else {
          mergedTiles.push(nonZeroTiles[i]);
        }
      }
      const newLine = [
        ...mergedTiles,
        ...Array(GRID_SIZE - mergedTiles.length).fill(0),
      ];
      changed = changed || JSON.stringify(line) !== JSON.stringify(newLine);
      return newLine;
    };

    if (direction === "left" || direction === "right") {
      for (let i = 0; i < GRID_SIZE; i++) {
        const startIndex = i * GRID_SIZE;
        const line = newBoard.slice(startIndex, startIndex + GRID_SIZE);
        const movedLine = moveLineOrColumn(
          direction === "left" ? line : line.reverse()
        );
        newBoard.splice(
          startIndex,
          GRID_SIZE,
          ...(direction === "left" ? movedLine : movedLine.reverse())
        );
      }
    } else {
      for (let i = 0; i < GRID_SIZE; i++) {
        const column = [
          newBoard[i],
          newBoard[i + GRID_SIZE],
          newBoard[i + GRID_SIZE * 2],
          newBoard[i + GRID_SIZE * 3],
        ];
        const movedColumn = moveLineOrColumn(
          direction === "up" ? column : column.reverse()
        );
        for (let j = 0; j < GRID_SIZE; j++) {
          newBoard[i + j * GRID_SIZE] = movedColumn[j];
        }
      }
    }

    if (changed) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const isGameOver = (currentBoard: number[]): boolean => {
    // Check if there are any empty cells
    if (currentBoard.some((cell) => cell === 0)) return false;

    // Check if there are any adjacent cells with the same value
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const currentValue = currentBoard[i * GRID_SIZE + j];
        if (
          (j < GRID_SIZE - 1 &&
            currentValue === currentBoard[i * GRID_SIZE + j + 1]) ||
          (i < GRID_SIZE - 1 &&
            currentValue === currentBoard[(i + 1) * GRID_SIZE + j])
        ) {
          return false;
        }
      }
    }

    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">2048</h1>
      <div className="mb-4">Score: {score}</div>
      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-2 rounded">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded ${
              cell === 0 ? "bg-gray-200" : "bg-yellow-200"
            }`}
            style={{
              backgroundColor:
                cell !== 0 ? `hsl(${Math.log2(cell) * 20}, 70%, 70%)` : "",
              color: cell > 4 ? "white" : "black",
            }}
          >
            {cell !== 0 && cell}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold">
          Game Over!{" "}
          <button
            onClick={initBoard}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Restart
          </button>
        </div>
      )}
      <div className="mt-4">
        <p>Use arrow keys to move tiles</p>
      </div>
    </div>
  );
};

export default Game2048;
