import * as React from "react";
import { useGame } from "@/hooks/use-game";
import { AnimatePresence } from "motion/react";
import { Modal } from "@/components/app-modal";
import { useKeyMove } from "@/hooks/use-key-move";
import { TilesView } from "@/components/tiles-view";
import type { MoveDirection } from "@/engine/board";
import { ScoreGroup } from "@/components/score-group";
import { ButtonGroup } from "@/components/button-group";
import { useOrientation } from "@/hooks/use-orientation";

export function App() {
  const orientation = useOrientation();
  const [newGameConfirm, setNewGameConfirm] = React.useState<boolean>(false);
  // prettier-ignore
  const { tiles, score, highScore, hasWon, isGameOver, move, undo, reset } = useGame();

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

  // Hook to listen for key presses and trigger moves
  useKeyMove(handleMove);

  return (
    <div className="flex justify-center h-screen relative select-none">
      <div
        className={`container flex flex-col justify-center px-4 ${
          orientation === "portrait" ? "w-screen h-full" : "w-[70vh] h-full"
        } bg-background`}
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
        <TilesView tiles={tiles} onMove={handleMove} />
        {orientation === "portrait" && <div className="py-4"></div>}
      </div>
      <AnimatePresence>
        {hasWon && <Modal key="win" title="You Win!" onNewGame={handleReset} />}
        {isGameOver && (
          <Modal key="over" title="Game Over!" onNewGame={handleReset} />
        )}
        {newGameConfirm && (
          <Modal
            key="confirm"
            hasCancel={true}
            title="Start a new game?"
            onNewGame={handleReset}
            onCancel={() => setNewGameConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
