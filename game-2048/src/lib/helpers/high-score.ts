const HIGH_SCORE_STORAGE_KEY = "game-2048:high-score";

// @export
export function readHighScore() {
  try {
    const value = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
}

// @export
export function writeHighScore(score: number) {
  try {
    window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
  } catch {
    // Ignore storage errors.
  }
}
