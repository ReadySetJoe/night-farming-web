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
