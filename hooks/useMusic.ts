import { useEffect, useRef, useState } from "react";
import { GameState } from "../lib/types";
import { musicManager } from "../lib/audio";

export const useMusic = (gameState: GameState) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const previousGameState = useRef<GameState | null>(null);

  // Initialize music automatically or on first user interaction
  useEffect(() => {
    const initializeAudio = async () => {
      if (!isInitialized) {
        const success = await musicManager.initialize();
        if (success) {
          setIsInitialized(true);
          // Audio manager already has default 50% volume set
        }
      }
    };

    // Try to initialize immediately
    initializeAudio();

    // Add event listeners for user interaction as fallback
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isInitialized]);

  // Update music when game state changes
  useEffect(() => {
    if (isInitialized) {
      musicManager.updateMusic(gameState, previousGameState.current || undefined);
      previousGameState.current = gameState;
    }
  }, [gameState, isInitialized]);
};