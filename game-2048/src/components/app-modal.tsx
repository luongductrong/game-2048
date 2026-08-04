import { motion } from "motion/react";

interface ModalProps {
  title: string;
  onNewGame: () => void;
  onCancel?: () => void | undefined;
  hasCancel?: boolean | undefined;
}

export function Modal(props: ModalProps) {
  const { hasCancel = false, title, onNewGame, onCancel } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-overlay flex justify-center items-center z-50 p-5 md:p-10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-background py-6 px-12 rounded-md text-center shadow-xl"
      >
        <p className="text-foreground text-3xl md:text-4xl font-bold">
          {title}
        </p>
        <div className="mt-4 flex justify-center gap-4">
          {hasCancel && onCancel && (
            <button
              className="bg-secondary p-2 px-4 rounded-md text-muted-foreground font-bold hover:bg-secondary/90 transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            className="bg-foreground p-2 px-4 rounded-md text-muted-foreground font-bold hover:bg-foreground/90 transition-colors"
            onClick={onNewGame}
          >
            New Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
