type ScoreType = {
  score: number;
  hightScore: number;
};

type AddScoreType = {
  score: number;
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const newCellValue = () => {
  return Math.random() < 0.9 ? 2 : 4;
};

const newGame = () => {
  const cell1 = {
    longtitue: randomInt(0, 4),
    latitude: randomInt(0, 4),
    value: newCellValue(),
  };
  let cell2 = {
    longtitue: randomInt(0, 4),
    latitude: randomInt(0, 4),
    value: newCellValue(),
  };

  while (
    cell1.longtitue === cell2.longtitue &&
    cell1.latitude === cell2.latitude
  ) {
    cell2 = {
      longtitue: randomInt(0, 4),
      latitude: randomInt(0, 4),
      value: newCellValue(),
    };
  }

  const gridMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  gridMatrix[cell1.latitude][cell1.longtitue] = cell1.value;
  gridMatrix[cell2.latitude][cell2.longtitue] = cell2.value;
  return gridMatrix;
};

const isGameOver = (gridMatrix: number[][]) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (gridMatrix[i][j] === 0) return false;
      if (i < 3 && gridMatrix[i][j] === gridMatrix[i + 1][j]) return false;
      if (j < 3 && gridMatrix[i][j] === gridMatrix[i][j + 1]) return false;
    }
  }
  return true;
};

const isWin = (gridMatrix: number[][]) => {
  return gridMatrix.some((row) => row.some((cell) => cell === 2048));
};

const areMatricesEqual = (matrix1: number[][], matrix2: number[][]) => {
  return matrix1.every((row, rowIndex) =>
    row.every((cell, colIndex) => cell === matrix2[rowIndex][colIndex])
  );
};

const newCell = (newMatrix: number[][]) => {
  let count = 0;
  const cell = {
    longitude: randomInt(0, 4),
    latitude: randomInt(0, 4),
    value: newCellValue(),
  };
  while (newMatrix[cell.latitude][cell.longitude] !== 0) {
    cell.longitude = randomInt(0, 4);
    cell.latitude = randomInt(0, 4);
    count++;
    if (count > 16) {
      if (isGameOver(newMatrix)) {
        console.log("Game Over");
      }
      return;
    }
  }
  newMatrix[cell.latitude][cell.longitude] = cell.value;
};

const merge = (cells: number[], isRevest: boolean, addScore: AddScoreType) => {
  const result: number[] = [];
  let skip = false;

  cells
    .filter((cell) => cell !== 0)
    .forEach((cell, index, array) => {
      if (skip) {
        skip = false;
        return;
      } else {
        if (cell === array[index + 1]) {
          result.push(cell * 2);
          addScore.score += cell * 2;
          skip = true;
          return;
        }
        result.push(cell);
      }
    });

  let length = result.length;
  while (length < 4) {
    isRevest ? result.unshift(0) : result.push(0);
    length++;
  }

  return result;
};

const transpose = (matrix: number[][]) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const moveUp = (
  gridMatrix: number[][],
  score: ScoreType,
  onScoreChange: (newScore: ScoreType) => void
) => {
  const newMatrix = transpose(gridMatrix);
  const addScore: AddScoreType = {
    score: 0,
  };

  newMatrix[0] = merge(newMatrix[0], false, addScore);
  newMatrix[1] = merge(newMatrix[1], false, addScore);
  newMatrix[2] = merge(newMatrix[2], false, addScore);
  newMatrix[3] = merge(newMatrix[3], false, addScore);

  const transposeMatrix = transpose(newMatrix);
  if (areMatricesEqual(gridMatrix, transposeMatrix)) {
    return gridMatrix;
  }
  newCell(transposeMatrix);
  if (addScore.score > 0) {
    console.log("Add score: ", addScore.score, "Old Score", score.score);
    onScoreChange({
      score: score.score + addScore.score,
      hightScore: Math.max(score.score + addScore.score, score.hightScore),
    });
  }
  return transposeMatrix;
};

const moveDown = (
  gridMatrix: number[][],
  score: ScoreType,
  onScoreChange: (newScore: ScoreType) => void
) => {
  const newMatrix = transpose(gridMatrix);
  const addScore: AddScoreType = {
    score: 0,
  };

  newMatrix[0] = merge(newMatrix[0], true, addScore);
  newMatrix[1] = merge(newMatrix[1], true, addScore);
  newMatrix[2] = merge(newMatrix[2], true, addScore);
  newMatrix[3] = merge(newMatrix[3], true, addScore);

  const transposeMatrix = transpose(newMatrix);
  if (areMatricesEqual(gridMatrix, transposeMatrix)) {
    return gridMatrix;
  }
  newCell(transposeMatrix);
  if (addScore.score > 0) {
    console.log("Add score: ", addScore.score, "Old Score", score.score);
    onScoreChange({
      score: score.score + addScore.score,
      hightScore: Math.max(score.score + addScore.score, score.hightScore),
    });
  }
  return transposeMatrix;
};

const moveLeft = (
  gridMatrix: number[][],
  score: ScoreType,
  onScoreChange: (newScore: ScoreType) => void
) => {
  const newMatrix = gridMatrix.map((row) => [...row]);
  const addScore: AddScoreType = {
    score: 0,
  };

  newMatrix[0] = merge(newMatrix[0], false, addScore);
  newMatrix[1] = merge(newMatrix[1], false, addScore);
  newMatrix[2] = merge(newMatrix[2], false, addScore);
  newMatrix[3] = merge(newMatrix[3], false, addScore);

  if (areMatricesEqual(gridMatrix, newMatrix)) {
    return gridMatrix;
  }
  newCell(newMatrix);
  if (addScore.score > 0) {
    console.log("Add score: ", addScore.score, "Old Score", score.score);
    onScoreChange({
      score: score.score + addScore.score,
      hightScore: Math.max(score.score + addScore.score, score.hightScore),
    });
  }
  return newMatrix;
};

const moveRight = (
  gridMatrix: number[][],
  score: ScoreType,
  onScoreChange: (newScore: ScoreType) => void
) => {
  const newMatrix = gridMatrix.map((row) => [...row]);
  const addScore: AddScoreType = {
    score: 0,
  };

  newMatrix[0] = merge(newMatrix[0], true, addScore);
  newMatrix[1] = merge(newMatrix[1], true, addScore);
  newMatrix[2] = merge(newMatrix[2], true, addScore);
  newMatrix[3] = merge(newMatrix[3], true, addScore);

  if (areMatricesEqual(gridMatrix, newMatrix)) {
    return gridMatrix;
  }
  newCell(newMatrix);
  if (addScore.score > 0) {
    console.log("Add score: ", addScore.score, "Old Score", score.score);
    onScoreChange({
      score: score.score + addScore.score,
      hightScore: Math.max(score.score + addScore.score, score.hightScore),
    });
  }
  return newMatrix;
};

export { newGame, moveUp, moveDown, moveLeft, moveRight, isGameOver, isWin };
