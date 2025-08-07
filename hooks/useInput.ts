import { useCallback, useEffect } from "react";
import { KeyState, ToolType } from "../lib/types";
import { GAME_CONTROL_KEYS } from "../lib/constants";

export const useInput = (
  setKeys: React.Dispatch<React.SetStateAction<KeyState>>,
  setDebugMode: React.Dispatch<React.SetStateAction<boolean>>,
  onToolSelect: (tool: ToolType) => void,
  onAction: () => void
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;

      // Prevent default behavior for game controls
      if (GAME_CONTROL_KEYS.includes(key as any)) {
        e.preventDefault();
      }

      switch (key) {
        case "ArrowUp":
        case "w":
        case "W":
          setKeys(prev => ({ ...prev, up: true }));
          break;
        case "ArrowDown":
        case "s":
        case "S":
          setKeys(prev => ({ ...prev, down: true }));
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case " ":
          onAction();
          break;
        case "1":
          onToolSelect("hoe");
          break;
        case "2":
          onToolSelect("seeds");
          break;
        case "3":
          onToolSelect("watering_can");
          break;
        case "4":
          onToolSelect("hand");
          break;
        case "F3":
        case "f3":
          setDebugMode(prev => !prev);
          break;
      }
    },
    [setKeys, setDebugMode, onToolSelect, onAction]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;

      switch (key) {
        case "ArrowUp":
        case "w":
        case "W":
          setKeys(prev => ({ ...prev, up: false }));
          break;
        case "ArrowDown":
        case "s":
        case "S":
          setKeys(prev => ({ ...prev, down: false }));
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setKeys(prev => ({ ...prev, right: false }));
          break;
      }
    },
    [setKeys]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};