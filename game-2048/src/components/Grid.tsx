function Grid({ gridMatrix }: { gridMatrix: number[][] }) {
  const getCellColor = (cell: number) => {
    switch (cell) {
      case 2:
        return "bg-red-500";
      case 4:
        return "bg-blue-500";
      case 8:
        return "bg-green-500";
      case 16:
        return "bg-yellow-500";
      case 32:
        return "bg-pink-500";
      case 64:
        return "bg-purple-500";
      case 128:
        return "bg-indigo-500";
      case 256:
        return "bg-red-300";
      case 512:
        return "bg-blue-300";
      case 1024:
        return "bg-green-300";
      case 2048:
        return "bg-yellow-300";
      default:
        return "bg-gray-300";
    }
  };
  return (
    <div className="grid grid-cols-4 gap-3 bg-red-300 p-3 rounded-md">
      {gridMatrix.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`${getCellColor(cell)} w-full aspect-square rounded-md`}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}

export default Grid;