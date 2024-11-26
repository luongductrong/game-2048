import React from "react";

type ScoreProps = {
  score: number;
  hightScore: number;
};

function Score({ score, hightScore }: ScoreProps) {
  const formatScore = (score: number): string => {
    if (score < 1000) return score.toString();
    if (score < 1000000) return `${(score / 1000).toFixed(1)}K`;
    return `${(score / 1000000).toFixed(1)}M`;
  };

  const scoreX = formatScore(score);
  const hightScoreX = formatScore(hightScore);

  return (
    <div className="flex flex-row font-noto w-full">
      <div className="text-7xl font-bold text-rose-400 w-1/2 flex items-center justify-start">
        2048
      </div>
      <div className="flex flex-row justify-end w-1/2">
        <div className="flex flex-col justify-center items-center bg-rose-300 rounded-md ml-2 px-2">
          <div className="inline-block text-rose-100 text-xs font-semibold uppercase">
            Score
          </div>
          <div className="text-xl font-bold text-rose-50 inline-block">
            {scoreX}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-rose-300 rounded-md ml-2 p-2">
          <div className="inline-block text-rose-100 text-xs font-semibold uppercase">
            High Score
          </div>
          <div className="text-xl font-bold text-rose-50 inline-block">
            {hightScoreX}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Score);
