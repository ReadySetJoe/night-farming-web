import { useCallback, useEffect } from "react";
import { GameState, KeyState, ToolType } from "../lib/types";
import { GAME_CONTROL_KEYS } from "../lib/constants";
import { generateToolbar } from "../lib/toolbar";

export const useInput = (
  setKeys: React.Dispatch<React.SetStateAction<KeyState>>,
  setDebugMode: React.Dispatch<React.SetStateAction<boolean>>,
  onToolSelect: (tool: ToolType) => void,
  onAction: () => void,
  gameState: GameState
) => {
  const toolbar = generateToolbar(gameState);
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
        case "F3":
        case "f3":
          setDebugMode(prev => !prev);
          break;
        default:
          // Dynamic tool selection based on current toolbar
          const keyNum = parseInt(key);
          if (keyNum >= 1 && keyNum <= toolbar.length) {
            const toolItem = toolbar[keyNum - 1];
            if (!toolItem.disabled) {
              onToolSelect(toolItem.id as ToolType);
            }
          }
          break;
      }
    },
    [setKeys, setDebugMode, onToolSelect, onAction, toolbar]
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
