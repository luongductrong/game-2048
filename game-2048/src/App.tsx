import React from "react";
import Grid from "./components/Grid";
import Score from "./components/Score";
import Buttons from "./components/Buttons";
import { newGame, moveUp, moveDown, moveLeft, moveRight } from "./handlers";

// const gridMatrix = [
//   [2, 4, 8, 16],
//   [32, 0, 128, 512],
//   [1024, 2048, 2, 64],
//   [0, 0, 0, 0],
// ];

function App() {
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [gridMatrix, setGridMatrix] = React.useState<number[][]>(newGame());
  const oldGridMatrix = React.useRef<number[][]>(gridMatrix);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          console.log("up");
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveUp(prevMatrix);
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          console.log("down");
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveDown(prevMatrix);
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          console.log("left");
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveLeft(prevMatrix);
            oldGridMatrix.current = prevMatrix;
            return newMatrix;
          });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          console.log("right");
          setGridMatrix((prevMatrix) => {
            const newMatrix = moveRight(prevMatrix);
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
    <div className="flex justify-center h-screen">
      <div
        className={`container flex flex-col justify-center px-4 ${
          !isLandscape ? "w-screen h-full" : "w-[70vh] h-full"
        } bg-rose-100`}
      >
        <Score score={12000} hightScore={10} />
        <Buttons
          onUndo={() => setGridMatrix(oldGridMatrix.current)}
          onNewGame={() => setGridMatrix(newGame())}
        />
        <Grid gridMatrix={gridMatrix} />
        {!isLandscape && <div className="py-4"></div>}
      </div>
    </div>
  );
}

export default App;
