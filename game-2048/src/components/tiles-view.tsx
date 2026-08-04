import * as React from "react";
import { cn } from "@/lib/utils";
import type { TileSnapshot } from "@/engine/tile";
import type { MoveDirection } from "@/engine/board";
import { AnimatePresence, motion } from "motion/react";

function getTileColor(value: number) {
  switch (value) {
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
      return "bg-red-600";
    case 512:
      return "bg-blue-300";
    case 1024:
      return "bg-green-300";
    case 2048:
      return "bg-yellow-300";
    case 4096:
      return "bg-pink-300";
    default:
      return "bg-rose-100";
  }
}

type AnimatedTile = {
  readonly id: number;
  readonly value: number;
  readonly row: number;
  readonly col: number;
};

type PanInfoLike = {
  offset: {
    x: number;
    y: number;
  };
};

interface TilesViewProps {
  tiles: ReadonlyArray<ReadonlyArray<TileSnapshot>>;
  onMove: (direction: MoveDirection) => void;
}

// @export
export function TilesView({ tiles, onMove }: TilesViewProps) {
  const animatedTiles = React.useMemo(() => flattenTiles(tiles), [tiles]);

  return (
    <motion.div
      onPanEnd={(_, info) => {
        const direction = getSwipeDirection(info);
        if (direction) {
          onMove(direction);
        }
      }}
      className="relative touch-none rounded-md bg-rose-300 p-3"
    >
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 16 }, (_, index) => (
          <div
            key={index}
            className="aspect-square rounded-md bg-rose-100/70 shadow-inner"
          />
        ))}
      </div>
      <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 gap-3">
        <AnimatePresence initial={false}>
          {animatedTiles.map((tile) => (
            <motion.div
              key={tile.id}
              layout
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.45,
                filter: "blur(2px)",
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 520,
                  damping: 42,
                  mass: 0.75,
                },
                scale: {
                  duration: 0.18,
                  ease: "easeOut",
                },
                opacity: {
                  duration: 0.12,
                },
              }}
              style={{
                gridColumnStart: tile.col + 1,
                gridRowStart: tile.row + 1,
                zIndex: 1,
              }}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md text-2xl font-bold shadow-lg will-change-transform",
                getTileColor(tile.value),
              )}
            >
              <motion.span
                key={`${tile.id}-${tile.value}`}
                initial={{ scale: 0.65, opacity: 0.75 }}
                animate={{ scale: [0.85, 1.22, 1], opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 650,
                  damping: 24,
                }}
              >
                {tile.value}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function flattenTiles(
  tiles: ReadonlyArray<ReadonlyArray<TileSnapshot>>,
): AnimatedTile[] {
  return tiles.flatMap((line, row) =>
    line.flatMap((tile, col) =>
      tile === null
        ? []
        : [
            {
              id: tile.id,
              value: tile.value,
              row,
              col,
            },
          ],
    ),
  );
}

function getSwipeDirection(info: PanInfoLike): MoveDirection | undefined {
  const minDistance = 48;
  const { x, y } = info.offset;

  if (Math.abs(x) < minDistance && Math.abs(y) < minDistance) {
    return;
  }

  if (Math.abs(x) > Math.abs(y)) {
    return x > 0 ? "right" : "left";
  }

  return y > 0 ? "down" : "up";
}
