import { formatScore } from "@/lib/utils";

interface ScoreGroupProps {
  score: number;
  highScore: number;
}

export function ScoreGroup({ score, highScore }: ScoreGroupProps) {
  return (
    <div className="flex flex-row font-noto w-full text-muted-foreground">
      <div className="text-7xl font-bold text-primary-active w-1/2 flex items-center justify-start text-shadow-md text-shadow-primary">
        2048
      </div>
      <div className="flex flex-row justify-end w-1/2">
        <div className="flex flex-col justify-center items-center bg-primary rounded-md ml-2 px-2">
          <div className="inline-block text-xs font-semibold uppercase">
            Score
          </div>
          <div className="text-xl font-bold inline-block">
            {formatScore(score)}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-primary rounded-md ml-2 p-2">
          <div className="inline-block text-xs font-semibold uppercase">
            High Score
          </div>
          <div className="text-xl font-bold inline-block">
            {formatScore(highScore)}
          </div>
        </div>
      </div>
    </div>
  );
}
