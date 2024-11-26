import React from "react";

type Props = {
  onFullScreenChange: (isFullScreen: boolean) => void;
};

function FullScreenButton({ onFullScreenChange }: Props) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        document.documentElement.requestFullscreen();
        onFullScreenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
