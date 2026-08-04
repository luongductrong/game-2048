import * as React from "react";
import { useGame } from "@/hooks/use-game";
import { Modal } from "@/components/app-modal";
import { GameGrid } from "@/components/game-grid";
import type { MoveDirection } from "@/engine/board";
import { ScoreGroup } from "@/components/score-group";
import { ButtonGroup } from "@/components/button-group";

export function App() {
  // prettier-ignore
  const { tiles, score, highScore, hasWon, isGameOver, move, undo, reset } = useGame();
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const touchStartRef = React.useRef<Touch | null>(null);
  const [newGameConfirm, setNewGameConfirm] = React.useState<boolean>(false);

  const gridMatrix = React.useMemo(
    () => tiles.map((row) => row.map((tile) => tile?.value ?? 0)),
    [tiles],
  );

  const hasOpenModal = hasWon || isGameOver || newGameConfirm;

  const handleMove = React.useCallback(
    (direction: MoveDirection) => {
      if (hasOpenModal) {
        return;
      }

      move(direction);
    },
    [hasOpenModal, move],
  );

  const handleReset = React.useCallback(() => {
    reset();
    setNewGameConfirm(false);
  }, [reset]);

  React.useEffect(() => {
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("selectstart", handleSelectStart);
    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          handleMove("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          handleMove("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          handleMove("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          handleMove("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMove]);

  React.useEffect(() => {
    const handleSwipe = (
      start: Touch | null,
      end: Touch,
    ): MoveDirection | undefined => {
      if (!start) return;

      const dx = end.clientX - start.clientX;
      const dy = end.clientY - start.clientY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (Math.abs(dx) <= 50 && Math.abs(dy) <= 50) {
        return;
      }

      if (angle > -45 && angle <= 45) {
        return "right";
      }

      if (angle > 45 && angle <= 135) {
        return "down";
      }

      if (angle > 135 || angle <= -135) {
        return "left";
      }

      return "up";
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.changedTouches[0];
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const swipeDirection = handleSwipe(
        touchStartRef.current,
        e.changedTouches[0],
      );

      if (swipeDirection) {
        handleMove(swipeDirection);
      }

      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMove]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-center h-screen relative select-none">
      <div
        className={`container flex flex-col justify-center px-4 ${
          !isLandscape ? "w-screen h-full" : "w-[70vh] h-full"
        } bg-rose-100`}
      >
        <ScoreGroup score={score} highScore={highScore} />
        <ButtonGroup
          onUndo={() => {
            undo();
          }}
          onNewGame={() => {
            setNewGameConfirm(true);
          }}
        />
        <GameGrid gridMatrix={gridMatrix} />
        {!isLandscape && <div className="py-4"></div>}
      </div>
      {hasWon && <Modal title="You Win!" onNewGame={handleReset} />}
      {isGameOver && <Modal title="Game Over!" onNewGame={handleReset} />}
      {newGameConfirm && (
        <Modal
          hasCancel={true}
          title="Start a new game?"
          onNewGame={handleReset}
          onCancel={() => setNewGameConfirm(false)}
        />
      )}
    </div>
  );
}
