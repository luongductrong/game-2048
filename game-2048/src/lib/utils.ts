export function formatScore(score: number): string {
  if (score < 1000) return score.toString();
  if (score < 1000000) return `${(score / 1000).toFixed(1)}K`;
  return `${(score / 1000000).toFixed(1)}M`;
}
