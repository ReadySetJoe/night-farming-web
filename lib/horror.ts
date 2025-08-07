import { HorrorEvent } from "./types";

export const createForgeNightmareEvent = (): HorrorEvent => ({
  id: `forge_nightmare_${Date.now()}`,
  type: "forge_nightmare",
  isActive: true,
  startTime: Date.now(),
  duration: 8000,
  intensity: 1,
});

export const isHorrorEventActive = (horrorEvent: HorrorEvent | null): boolean => {
  if (!horrorEvent) return false;
  
  const elapsed = Date.now() - horrorEvent.startTime;
  return horrorEvent.isActive && elapsed < horrorEvent.duration;
};

export const getHorrorIntensity = (horrorEvent: HorrorEvent): number => {
  const elapsed = Date.now() - horrorEvent.startTime;
  const progress = elapsed / horrorEvent.duration;
  
  // Intensity curve: starts low, peaks at 50%, then fades
  if (progress < 0.3) {
    return progress / 0.3; // Build up
  } else if (progress < 0.7) {
    return 1.0; // Peak horror
  } else {
    return 1.0 - ((progress - 0.7) / 0.3); // Fade out
  }
};

export const getHorrorMessages = (phase: number): string[] => {
  if (phase < 0.2) {
    return [
      "The flames flicker strangely...",
      "Something whispers from within the fire...",
      "The forge grows unnaturally hot..."
    ];
  } else if (phase < 0.5) {
    return [
      "🔥 THE FIRE SEES YOU 🔥",
      "👁️ EYES IN THE FLAMES 👁️",  
      "🔥 IT HUNGERS FOR MORE 🔥"
    ];
  } else if (phase < 0.8) {
    return [
      "🖤 THE DARKNESS SPREADS 🖤",
      "💀 SHADOWS DANCE AROUND YOU 💀",
      "🔥 THE FORGE CALLS YOUR NAME 🔥"
    ];
  } else {
    return [
      "The flames return to normal...",
      "...but something has changed.",
      "You feel watched."
    ];
  }
};