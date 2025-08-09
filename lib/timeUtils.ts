export interface TimeState {
  hours: number;
  minutes: number;
  totalMinutes: number;
  day: number;
  isNight: boolean;
  nightIntensity: number;
}

// Time constants
export const DAY_START_HOUR = 6;   // 6:00 AM - day starts
export const DUSK_START_HOUR = 18;  // 6:00 PM - sunset begins  
export const NIGHT_START_HOUR = 20; // 8:00 PM - full night
export const DAWN_START_HOUR = 5;   // 5:00 AM - sunrise begins

// Calculate if it's currently night time
export const calculateIsNight = (hours: number): boolean => {
  return hours >= NIGHT_START_HOUR || hours < DAY_START_HOUR;
};

// Calculate night intensity (0 = day, 1 = deepest night)
export const calculateNightIntensity = (hours: number): number => {
  // Peak darkness at midnight (0:00), lightest at noon (12:00)
  if (hours >= DAY_START_HOUR && hours < DUSK_START_HOUR) {
    // Full day - no darkness
    return 0;
  } else if (hours >= DUSK_START_HOUR && hours < NIGHT_START_HOUR) {
    // Sunset transition (6 PM - 8 PM)
    const progress = (hours - DUSK_START_HOUR) / (NIGHT_START_HOUR - DUSK_START_HOUR);
    return progress * 0.7; // Gradually darken to 70%
  } else if (hours >= NIGHT_START_HOUR || hours < DAWN_START_HOUR) {
    // Deep night (8 PM - 5 AM)
    if (hours >= NIGHT_START_HOUR) {
      // Evening to midnight
      const hoursToMidnight = 24 - hours;
      const maxHours = 24 - NIGHT_START_HOUR + 0; // 8 PM to midnight
      const progress = (maxHours - hoursToMidnight) / maxHours;
      return 0.7 + (progress * 0.3); // 70% to 100%
    } else {
      // Midnight to dawn
      const progress = hours / DAWN_START_HOUR;
      return 1.0 - (progress * 0.3); // 100% to 70%
    }
  } else {
    // Dawn transition (5 AM - 6 AM)
    const progress = (hours - DAWN_START_HOUR) / (DAY_START_HOUR - DAWN_START_HOUR);
    return 0.7 * (1 - progress); // Lighten from 70% to 0%
  }
};

// Update time state with night calculations
export const updateTimeState = (timeState: TimeState): TimeState => {
  const isNight = calculateIsNight(timeState.hours);
  const nightIntensity = calculateNightIntensity(timeState.hours);
  
  return {
    ...timeState,
    isNight,
    nightIntensity,
  };
};

// Get time period description
export const getTimePeriod = (hours: number): string => {
  if (hours >= 5 && hours < 6) return "Dawn";
  if (hours >= 6 && hours < 12) return "Morning";
  if (hours >= 12 && hours < 18) return "Afternoon";
  if (hours >= 18 && hours < 20) return "Dusk";
  if (hours >= 20 || hours < 5) return "Night";
  return "Day";
};

// Check if time is within a range (handles overnight ranges)
export const isTimeInRange = (currentHour: number, startHour: number, endHour: number): boolean => {
  if (startHour <= endHour) {
    // Same day range (e.g., 9 AM to 5 PM)
    return currentHour >= startHour && currentHour <= endHour;
  } else {
    // Overnight range (e.g., 8 PM to 6 AM)
    return currentHour >= startHour || currentHour <= endHour;
  }
};