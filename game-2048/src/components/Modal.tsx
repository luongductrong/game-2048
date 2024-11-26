type ModalProps = {
  title: string;
  onNewGame: () => void;
};

function Modal({ title, onNewGame }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-slate-200 py-6 px-12 rounded-md text-center">
        <div className="text-rose-500 text-4xl font-bold">{title}</div>
        <button
          className="bg-rose-500 p-2 px-4 rounded-md mt-4 text-white font-bold hover:bg-rose-600"
          onClick={onNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}

export default Modal;
