import React from "react";
import Grid from "./components/Grid";
import Score from "./components/Score";
import Buttons from "./components/Buttons";
import Modal from "./components/Modal";
import FullScreenButton from "./components/FullScreenButton";
import ExitButton from "./components/ExitFullScreenButton";
import { newGame, moveUp, moveDown, moveLeft, moveRight } from "./handlers";
import { isGameOver as hasGameOver, isWin as hasWin } from "./handlers";

// const gridMatrix = [
//   [2, 4, 8, 16],
//   [32, 0, 128, 512],
//   [1024, 2048, 2, 64],
//   [0, 0, 0, 0],
// ];
type ScoreType = {
  score: number;
  highScore: number;
};

function App() {
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [gridMatrix, setGridMatrix] = React.useState<number[][]>(newGame());
  const oldGridMatrix = React.useRef<number[][]>(gridMatrix);
  const [score, setScore] = React.useState<ScoreType>({
    score: 0,
    highScore: 0,
  });
  const oldScore = React.useRef<ScoreType>(score);
  const prevScore = React.useRef<number>(score.score);
  const [isWin, setIsWin] = React.useState<boolean>(false);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const touchStartRef = React.useRef<Touch | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement === null) {
        setIsFullScreen(false);
      }
    });
    return () => {
      document.removeEventListener("fullscreenchange", () => {
        setIsFullScreen(false);
      });
    };
  }, []);

  React.useEffect(() => {
    document.addEventListener("selectstart", (e) => {
      e.preventDefault();
    });
    return () => {
      document.removeEventListener("selectstart", (e) => {
        e.preventDefault();
      });
    };
  }, []);

  React.useEffect(() => {
    const savedHighScore = localStorage.getItem("highScore2048");
    if (savedHighScore) {
      setScore((prevScore) => ({
        ...prevScore,
        highScore: parseInt(savedHighScore),
      }));
    }
  }, []);

  React.useEffect(() => {
    if (score.score > prevScore.current) {
      const newHighScore = Math.max(score.score, score.highScore);
      localStorage.setItem("highScore2048", newHighScore.toString());
      setScore((prevScore) => ({
        ...prevScore,
        highScore: newHighScore,
      }));
    }
    prevScore.current = score.score;
  }, [score.score, score.highScore]);

  React.useEffect(() => {
    if (hasWin(gridMatrix)) {
      setIsWin(true);
    }
    if (hasGameOver(gridMatrix)) {
      setIsGameOver(true);
    }
  }, [gridMatrix]);

  React.useEffect(() => {
    const handleMoveUp = () => {
      setGridMatrix((prevMatrix) => {
        const newMatrix = moveUp(prevMatrix, score, (newScore: ScoreType) =>
          setScore((prevScore) => {
            const updatedScore = {
              score: prevScore.score + newScore.score,
              highScore: Math.max(
                prevScore.score + newScore.score,
                prevScore.highScore
              ),
            };
            oldScore.current = prevScore;
            return updatedScore;
          })
        );
        oldGridMatrix.current = prevMatrix;
        return newMatrix;
      });
    };

    const handleMoveDown = () => {
      setGridMatrix((prevMatrix) => {
        const newMatrix = moveDown(prevMatrix, score, (newScore: ScoreType) =>
          setScore((prevScore) => {
            const updatedScore = {
              score: prevScore.score + newScore.score,
              highScore: Math.max(
                prevScore.score + newScore.score,
                prevScore.highScore
              ),
            };
            oldScore.current = prevScore;
            return updatedScore;
          })
        );
        oldGridMatrix.current = prevMatrix;
        return newMatrix;
      });
    };

    const handleMoveLeft = () => {
      setGridMatrix((prevMatrix) => {
        const newMatrix = moveLeft(prevMatrix, score, (newScore: ScoreType) =>
          setScore((prevScore) => {
            const updatedScore = {
              score: prevScore.score + newScore.score,
              highScore: Math.max(
                prevScore.score + newScore.score,
                prevScore.highScore
              ),
            };
            oldScore.current = prevScore;
            return updatedScore;
          })
        );
        oldGridMatrix.current = prevMatrix;
        return newMatrix;
      });
    };

    const handleMoveRight = () => {
      setGridMatrix((prevMatrix) => {
        const newMatrix = moveRight(prevMatrix, score, (newScore: ScoreType) =>
          setScore((prevScore) => {
            const updatedScore = {
              score: prevScore.score + newScore.score,
              highScore: Math.max(
                prevScore.score + newScore.score,
                prevScore.highScore
              ),
            };
            oldScore.current = prevScore;
            return updatedScore;
          })
        );
        oldGridMatrix.current = prevMatrix;
        return newMatrix;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullScreen) {
        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            handleMoveUp();
            break;
          case "ArrowDown":
          case "s":
          case "S":
            handleMoveDown();
            break;
          case "ArrowLeft":
          case "a":
          case "A":
            handleMoveLeft();
            break;
          case "ArrowRight":
          case "d":
          case "D":
            handleMoveRight();
            break;
        }
      }
    };

    const handleSwipe = (
      start: Touch | null,
      end: Touch
    ): string | undefined => {
      if (!start) return;

      const dx = end.clientX - start.clientX;
      const dy = end.clientY - start.clientY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
        if (angle > -45 && angle <= 45) {
          return "right";
        } else if (angle > 45 && angle <= 135) {
          return "down";
        } else if (angle > 135 || angle <= -135) {
          return "left";
        } else {
          return "up";
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isFullScreen) {
        const touchStart = e.changedTouches[0];
        touchStartRef.current = touchStart;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isFullScreen) {
        const touchEnd = e.changedTouches[0];
        if (touchStartRef.current) {
          const swipeDirection = handleSwipe(touchStartRef.current, touchEnd);
          if (swipeDirection) {
            switch (swipeDirection) {
              case "up":
                handleMoveUp();
                break;
              case "down":
                handleMoveDown();
                break;
              case "left":
                handleMoveLeft();
                break;
              case "right":
                handleMoveRight();
                break;
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isFullScreen]);

  React.useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY > 50 && isFullScreen) {
        e.preventDefault();
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > window.innerHeight) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-center h-screen relative">
      {isFullScreen ? (
        <ExitButton onFullScreenChange={setIsFullScreen} />
      ) : (
        <FullScreenButton onFullScreenChange={setIsFullScreen} />
      )}
      <div
        className={`container flex flex-col justify-center px-4 ${
          !isLandscape ? "w-screen h-full" : "w-[70vh] h-full"
        } bg-rose-100`}
      >
        <Score score={score} />
        <Buttons
          onUndo={() => {
            setScore(oldScore.current);
            setGridMatrix(oldGridMatrix.current);
          }}
          onNewGame={() => {
            setScore({ score: 0, highScore: score.highScore });
            setGridMatrix(newGame());
          }}
        />
        <Grid gridMatrix={gridMatrix} />
        {!isLandscape && <div className="py-4"></div>}
      </div>
      {isWin && (
        <Modal
          title="You Win!"
          onNewGame={() => {
            setScore({ score: 0, highScore: score.highScore });
            setIsWin(false);
            setGridMatrix(newGame());
          }}
        />
      )}
      {isGameOver && (
        <Modal
          title="Game Over!"
          onNewGame={() => {
            setScore({ score: 0, highScore: score.highScore });
            setIsGameOver(false);
            setGridMatrix(newGame());
          }}
        />
      )}
    </div>
  );
}

export default App;
