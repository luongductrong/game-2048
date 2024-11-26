import React from "react";

type ScoreProps = {
  score: number;
  hightScore: number;
};

function Score({ score, hightScore }: ScoreProps) {
  return (
    <div className="flex flex-row">
      <div className="basic-1/2">Score: {score}</div>
      <div className="basic-1/2">Best: {hightScore}</div>
    </div>
  );
}

export default React.memo(Score);
