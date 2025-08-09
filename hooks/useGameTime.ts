import { useEffect } from "react";
import { GameState } from "../lib/types";
import { TIME_TICK_INTERVAL } from "../lib/constants";
import { updateTimeState } from "../lib/timeUtils";

export const useGameTime = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newTotalMinutes = prev.gameTime.totalMinutes + 10;
        const newHours = Math.floor(newTotalMinutes / 60) % 24;
        const newMinutes = newTotalMinutes % 60;

        const updatedTimeState = updateTimeState({
          hours: newHours,
          minutes: newMinutes,
          totalMinutes: newTotalMinutes,
          day: prev.gameTime.day,
          isNight: prev.gameTime.isNight,
          nightIntensity: prev.gameTime.nightIntensity,
        });

        return {
          ...prev,
          gameTime: updatedTimeState,
        };
      });
    }, TIME_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [setGameState]);
};
