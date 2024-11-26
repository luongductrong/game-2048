type Props = {
  onFullScreenChange: (isFullScreen: boolean) => void;
};

function FullScreenButton({ onFullScreenChange }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center z-50">
      <button
        className="bg-rose-500 p-2 px-4 rounded-md text-white font-bold hover:bg-rose-600"
        onClick={() => {
          document.documentElement.requestFullscreen();
          onFullScreenChange(true);
        }}
      >
        Full Screen
      </button>
    </div>
  );
}

export default FullScreenButton;
