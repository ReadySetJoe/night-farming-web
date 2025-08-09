import { SeedType, SeedConfig, Crop } from "./types";

export const SEED_CONFIGS: Record<SeedType, SeedConfig> = {
  parsnip: {
    name: "Parsnip",
    emoji: "🟠", // Orange circle for parsnip seeds (vs 🥕 for harvested)
    maxStage: 3,
    wateringsRequired: 1, // Needs 1 watering total
    sellPrice: 50,
    growthEmojis: ["🌱", "🌿", "🌾", "🥕"],
  },
  potato: {
    name: "Potato",
    emoji: "🟤", // Brown circle for potato seeds (vs 🥔 for harvested)
    maxStage: 4,
    wateringsRequired: 3, // Needs 3 waterings total
    sellPrice: 80,
    growthEmojis: ["🌱", "🌿", "🟫", "🔸", "🥔"],
  },
};

export const getSeedConfig = (seedType: SeedType): SeedConfig => {
  return SEED_CONFIGS[seedType];
};

export const getCropDisplay = (crop: Crop): string => {
  if (crop.type === "tilled") return "🟤";

  const config = SEED_CONFIGS[crop.type as SeedType];
  if (!config) return "❓";

  // Handle corrupted crops with progressive corruption visuals
  if (crop.isCorrupted) {
    const corruptionEmojis = ["🟫", "🖤", "💀", "👹"]; // Brown -> Black -> Death -> Evil
    const corruptionIndex = Math.min(crop.corruptionLevel || 0, corruptionEmojis.length - 1);
    return corruptionEmojis[corruptionIndex];
  }

  // Show watered indicator for stage 0 if watered but not fully watered
  if (crop.stage === 0) {
    if (
      crop.wateringsReceived > 0 &&
      crop.wateringsReceived < config.wateringsRequired
    ) {
      return "💧";
    }
  }

  return config.growthEmojis[crop.stage] || "❓";
};

// Check if a crop should become corrupted
export const shouldCorruptCrop = (crop: Crop, horrorLevel: number, corruptionSpread: number): boolean => {
  if (crop.isCorrupted || crop.type === "tilled") return false;
  
  // Higher chance for older crops and higher horror levels
  const ageBonus = Math.min(crop.stage / 4, 0.5); // Max 50% bonus for stage
  const baseChance = 0.01; // 1% base chance
  const horrorMultiplier = 1 + (horrorLevel * 0.2); // +20% per horror level
  
  const corruptionChance = baseChance * horrorMultiplier * corruptionSpread * (1 + ageBonus);
  return Math.random() < corruptionChance;
};

// Corrupt a crop
export const corruptCrop = (crop: Crop): Crop => {
  return {
    ...crop,
    isCorrupted: true,
    corruptionLevel: Math.floor(Math.random() * 3), // Start with 0-2 corruption level
  };
};

// Progress corruption on already corrupted crops
export const progressCorruption = (crop: Crop): Crop => {
  if (!crop.isCorrupted) return crop;
  
  return {
    ...crop,
    corruptionLevel: Math.min((crop.corruptionLevel || 0) + 1, 3), // Max level 3
  };
};
