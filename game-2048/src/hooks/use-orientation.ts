import * as React from "react";

type Orientation = "portrait" | "landscape";

function getOrientation(): Orientation {
  return window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
}

// @export
export function useOrientation() {
  return React.useSyncExternalStore(
    function subscribe(callback) {
      let frame = 0;

      function onResize() {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          callback();
        });
      }

      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        if (frame) {
          cancelAnimationFrame(frame);
        }
      };
    },
    getOrientation,
    getOrientation,
  );
}
