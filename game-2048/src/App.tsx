import * as React from "react";
import { cn } from "@/lib/utils";
import { useGame } from "@/hooks/use-game";
import { AnimatePresence } from "motion/react";
import { Modal } from "@/components/app-modal";
import { useKeyMove } from "@/hooks/use-key-move";
import { TilesView } from "@/components/tiles-view";
import type { MoveDirection } from "@/engine/board";
import { ScoreGroup } from "@/components/score-group";
import { ButtonGroup } from "@/components/button-group";

export function App() {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const headerRef = React.useRef<HTMLDivElement>(null);
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

  React.useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex justify-center items-center h-dvh w-dvw select-none font-mono bg-background",
        "px-2 sm:px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]",
      )}
    >
      <div
        className="w-[min(100%,calc(100dvh-var(--game-header-height)-env(safe-area-inset-bottom)-2.5rem))]"
        style={
          { "--game-header-height": `${headerHeight}px` } as React.CSSProperties
        }
      >
        <div ref={headerRef}>
          <ScoreGroup score={score} highScore={highScore} />
          <ButtonGroup
            onUndo={() => {
              undo();
            }}
            onNewGame={() => {
              setNewGameConfirm(true);
            }}
          />
        </div>
        <TilesView tiles={tiles} onMove={handleMove} />
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
