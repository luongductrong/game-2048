import React from "react";
import Grid from "./components/Grid";
import Score from "./components/Score";
import Buttons from "./components/Buttons";

const gridMatrix = [
  [2, 4, 8, 16],
  [32, 0, 128, 512],
  [1024, 2048, 2, 64],
  [0, 0, 0, 0],
];

function App() {
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);

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
    <div className="flex justify-center  h-screen">
      <div
        className={`container ${
          !isLandscape ? "w-screen h-full" : "w-[60vh] h-full"
        } bg-red-200`}
      >
        <Score score={10} hightScore={10} />
        <Buttons onUndo={() => {}} onNewGame={() => {}} />
        <Grid gridMatrix={gridMatrix} />
      </div>
    </div>
  );
}

export default App;
