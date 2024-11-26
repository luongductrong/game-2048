import React from "react";
import Grid from "./components/Grid";
import Score from "./components/Score";
import Buttons from "./components/Buttons";
import Modal from "./components/Modal";
import { newGame, moveUp, moveDown, moveLeft, moveRight } from "./handlers";

// const gridMatrix = [
//   [2, 4, 8, 16],
//   [32, 0, 128, 512],
//   [1024, 2048, 2, 64],
//   [0, 0, 0, 0],
// ];
type ScoreType = {
  score: number;
  hightScore: number;
};

function App() {
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [gridMatrix, setGridMatrix] = React.useState<number[][]>(newGame());
  const oldGridMatrix = React.useRef<number[][]>(gridMatrix);
  const [score, setScore] = React.useState<ScoreType>({
    score: 0,
    hightScore: 0,
  });
  const oldScore = React.useRef<ScoreType>(score);
  const prevScore = React.useRef<number>(score.score);
  const [isWin, setIsWin] = React.useState<boolean>(false);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);

  React.useEffect(() => {
    const savedHighScore = localStorage.getItem("hightScore2048");
    if (savedHighScore) {
      setScore((prevScore) => ({
        ...prevScore,
        hightScore: parseInt(savedHighScore),
      }));
    }
  }, []);

  React.useEffect(() => {
    if (score.score > prevScore.current) {
      const newHighScore = Math.max(score.score, score.hightScore);
      console.log("New high score: ", newHighScore);
      localStorage.setItem("hightScore2048", newHighScore.toString());
      setScore((prevScore) => ({
        ...prevScore,
        hightScore: newHighScore,
      }));
    }
    prevScore.current = score.score;
  }, [score.score, score.hightScore]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          console.log("up");
          console.log("Current score: ", score.score);
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveUp(prevMatrix, score, (newScore: ScoreType) =>
              setScore((prevScore) => {
                const updatedScore = {
                  score: prevScore.score + newScore.score,
                  hightScore: Math.max(
                    prevScore.score + newScore.score,
                    prevScore.hightScore
                  ),
                };
                oldScore.current = prevScore;
                return updatedScore;
              })
            );
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          console.log("down");
          console.log("Current score: ", score.score);
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveDown(
              prevMatrix,
              score,
              (newScore: ScoreType) =>
                setScore((prevScore) => {
                  const updatedScore = {
                    score: prevScore.score + newScore.score,
                    hightScore: Math.max(
                      prevScore.score + newScore.score,
                      prevScore.hightScore
                    ),
                  };
                  oldScore.current = prevScore;
                  return updatedScore;
                })
            );
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          console.log("left");
          console.log("Current score: ", score.score);
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveLeft(
              prevMatrix,
              score,
              (newScore: ScoreType) =>
                setScore((prevScore) => {
                  const updatedScore = {
                    score: prevScore.score + newScore.score,
                    hightScore: Math.max(
                      prevScore.score + newScore.score,
                      prevScore.hightScore
                    ),
                  };
                  oldScore.current = prevScore;
                  return updatedScore;
                })
            );
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          console.log("right");
          console.log("Current score: ", score.score);
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveRight(
              prevMatrix,
              score,
              (newScore: ScoreType) =>
                setScore((prevScore) => {
                  const updatedScore = {
                    score: prevScore.score + newScore.score,
                    hightScore: Math.max(
                      prevScore.score + newScore.score,
                      prevScore.hightScore
                    ),
                  };
                  oldScore.current = prevScore;
                  return updatedScore;
                })
            );
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
            setScore({ score: 0, hightScore: score.hightScore });
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
            setScore({ score: 0, hightScore: score.hightScore });
            setIsWin(false);
            setGridMatrix(newGame());
          }}
        />
      )}
      {isGameOver && (
        <Modal
          title="Game Over!"
          onNewGame={() => {
            setScore({ score: 0, hightScore: score.hightScore });
            setIsGameOver(false);
            setGridMatrix(newGame());
          }}
        />
      )}
    </div>
  );
}

export default App;
