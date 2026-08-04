import { formatScore } from "@/lib/utils";

interface ScoreGroupProps {
  score: number;
  highScore: number;
}

export function ScoreGroup({ score, highScore }: ScoreGroupProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-7xl font-noto font-bold text-primary-active text-shadow-md text-shadow-primary">
        2048
      </span>
      <div className="flex justify-end gap-2 text-muted-foreground">
        <div
          className="flex flex-col justify-center items-center bg-primary rounded-md p-2"
          aria-label={`Current Score: ${score}`}
        >
          <span className="text-xs font-semibold uppercase">Score</span>
          <span className="text-xl font-bold">{formatScore(score)}</span>
        </div>
        <div
          className="flex flex-col justify-center items-center bg-primary rounded-md p-2"
          aria-label={`High Score: ${highScore}`}
        >
          <span className="text-xs font-semibold uppercase">High Score</span>
          <span className="text-xl font-bold">{formatScore(highScore)}</span>
        </div>
      </div>
    </div>
  );
}
