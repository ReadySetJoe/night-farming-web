import { HorrorEvent, HorrorState, GameState } from "./types";

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

// Horror progression thresholds
export const HORROR_THRESHOLDS = {
  WHISPERS: 3,      // Day 3: Start hearing whispers
  CORRUPTION: 5,    // Day 5: Crops can become corrupted
  SHADOWS: 8,       // Day 8: Shadow figures appear
  BLOOD_MOON: 12,   // Day 12: Blood moon events
  NIGHTMARE: 15,    // Day 15: Full nightmare mode
} as const;

// Horror event templates
export const HORROR_EVENTS = {
  whispers: {
    type: "whispers" as const,
    duration: 5000,
    triggerConditions: {
      minDay: HORROR_THRESHOLDS.WHISPERS,
      timeRange: { start: 20, end: 6 }, // 8 PM to 6 AM
      probability: 0.3,
    }
  },
  corrupted_crop: {
    type: "corrupted_crop" as const,
    duration: 2000,
    triggerConditions: {
      minDay: HORROR_THRESHOLDS.CORRUPTION,
      probability: 0.2,
    }
  },
  shadow_figure: {
    type: "shadow_figure" as const,
    duration: 8000,
    triggerConditions: {
      minDay: HORROR_THRESHOLDS.SHADOWS,
      timeRange: { start: 22, end: 4 }, // 10 PM to 4 AM
      probability: 0.25,
    }
  },
  blood_moon: {
    type: "blood_moon" as const,
    duration: 60000, // 1 minute blood moon
    triggerConditions: {
      minDay: HORROR_THRESHOLDS.BLOOD_MOON,
      timeRange: { start: 0, end: 6 }, // Midnight to 6 AM
      probability: 0.1,
    }
  }
} as const;

// Calculate horror level based on days survived
export const calculateHorrorLevel = (day: number): number => {
  if (day < 3) return 0;
  if (day < 5) return 1;
  if (day < 8) return 2;
  if (day < 12) return 3;
  if (day < 15) return 4;
  if (day < 20) return 5;
  if (day < 25) return 6;
  if (day < 30) return 7;
  if (day < 40) return 8;
  if (day < 50) return 9;
  return 10; // Maximum horror
};

// Calculate corruption spread based on horror level
export const calculateCorruptionSpread = (horrorLevel: number): number => {
  return Math.min(horrorLevel / 10, 1);
};

// Check if an event should trigger
export const shouldTriggerHorrorEvent = (
  eventType: keyof typeof HORROR_EVENTS,
  gameState: GameState
): boolean => {
  const event = HORROR_EVENTS[eventType];
  const { gameTime, horrorState } = gameState;
  
  // Check minimum day requirement
  if (event.triggerConditions.minDay && gameTime.day < event.triggerConditions.minDay) {
    return false;
  }
  
  // Check time range (if specified)
  if ('timeRange' in event.triggerConditions && event.triggerConditions.timeRange) {
    const { start, end } = event.triggerConditions.timeRange;
    const currentHour = gameTime.hours;
    
    // Handle overnight ranges (e.g., 22-4 means 10 PM to 4 AM)
    const inTimeRange = start > end 
      ? (currentHour >= start || currentHour <= end)
      : (currentHour >= start && currentHour <= end);
      
    if (!inTimeRange) return false;
  }
  
  // Check if event already happened recently
  if (horrorState.recentEvents.includes(eventType)) {
    return false;
  }
  
  // Check probability
  if (event.triggerConditions.probability) {
    return Math.random() < event.triggerConditions.probability;
  }
  
  return true;
};

// Create a horror event
export const createHorrorEvent = (
  eventType: keyof typeof HORROR_EVENTS,
  gameState: GameState
): HorrorEvent => {
  const event = HORROR_EVENTS[eventType];
  const horrorLevel = gameState.horrorState.currentLevel;
  
  return {
    id: `${eventType}_${Date.now()}`,
    type: event.type,
    isActive: true,
    startTime: Date.now(),
    duration: event.duration + (horrorLevel * 1000), // Longer events at higher levels
    intensity: Math.min(horrorLevel + 1, 5), // 1-5 intensity
    triggerConditions: event.triggerConditions,
  };
};

// Update horror state
export const updateHorrorState = (gameState: GameState): HorrorState => {
  const currentLevel = calculateHorrorLevel(gameState.gameTime.day);
  const corruptionSpread = calculateCorruptionSpread(currentLevel);
  
  return {
    ...gameState.horrorState,
    currentLevel,
    totalDays: gameState.gameTime.day,
    corruptionSpread,
    nightmareMode: currentLevel >= 8,
  };
};

// Get random horror event to trigger
export const getRandomHorrorEvent = (gameState: GameState): HorrorEvent | null => {
  const availableEvents = Object.keys(HORROR_EVENTS) as Array<keyof typeof HORROR_EVENTS>;
  const eligibleEvents = availableEvents.filter(eventType => 
    shouldTriggerHorrorEvent(eventType, gameState)
  );
  
  if (eligibleEvents.length === 0) return null;
  
  const randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
  return createHorrorEvent(randomEvent, gameState);
};

// Horror event descriptions for UI
export const HORROR_DESCRIPTIONS = {
  whispers: [
    "You hear faint whispers carried by the wind...",
    "The shadows seem to be whispering your name...",
    "Strange voices echo from the forest...",
  ],
  corrupted_crop: [
    "One of your crops has withered unnaturally...",
    "Dark veins spread through your farmland...",
    "Something is wrong with your harvest...",
  ],
  shadow_figure: [
    "A dark figure watches from the treeline...",
    "You glimpse something moving in your peripheral vision...",
    "The darkness seems to take shape before vanishing...",
  ],
  blood_moon: [
    "The moon turns a deep crimson red...",
    "An ominous red glow fills the night sky...",
    "The blood moon rises, and evil stirs...",
  ],
  forge_nightmare: [
    "The forge burns with an otherworldly flame...",
    "Nightmarish visions dance in the fire...",
    "The metal glows with malevolent energy...",
  ],
  cursed_harvest: [
    "Your harvest feels cursed...",
    "The crops seem to move on their own...",
    "Something evil has taken root in your farm...",
  ]
} as const;

// Get description for horror event
export const getHorrorDescription = (event: HorrorEvent): string => {
  const descriptions = HORROR_DESCRIPTIONS[event.type];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};