import { useEffect } from "react";
import { GameState } from "../lib/types";
import { TIME_TICK_INTERVAL } from "../lib/constants";

export const useGameTime = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newTotalMinutes = prev.gameTime.totalMinutes + 10;
        const newHours = Math.floor(newTotalMinutes / 60) % 24;
        const newMinutes = newTotalMinutes % 60;

        return {
          ...prev,
          gameTime: {
            hours: newHours,
            minutes: newMinutes,
            totalMinutes: newTotalMinutes,
            day: prev.gameTime.day, // Preserve the day value
          },
        };
      });
    }, TIME_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [setGameState]);
};
