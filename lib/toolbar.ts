import { BASE_TOOLS } from "./constants";
import { SEED_CONFIGS } from "./seeds";
import { GameState, SeedType } from "./types";

export interface ToolbarItem {
  id: string;
  icon: string;
  name: string;
  key: string;
  count?: number;
  disabled?: boolean;
}

export const generateToolbar = (gameState: GameState): ToolbarItem[] => {
  const toolbar: ToolbarItem[] = [];
  let currentSlot = 1;

  // Add base tools
  BASE_TOOLS.forEach(tool => {
    toolbar.push({
      ...tool,
      key: currentSlot.toString(),
    });
    currentSlot++;
  });

  // Add seed tools based on inventory
  Object.entries(gameState.inventory.seeds).forEach(
    ([seedType, count]) => {
      if (currentSlot > 10) return; // Max 10 slots (1-9, 0)
      const config = SEED_CONFIGS[seedType as SeedType];
      toolbar.push({
        id: seedType,
        icon: config.emoji,
        name: `${config.name} Seeds`,
        key: currentSlot === 10 ? "0" : currentSlot.toString(),
        count: count,
        disabled: count === 0,
      });
      currentSlot++;
    }
  );

  // Add harvested crops to toolbar
  Object.entries(gameState.inventory.crops).forEach(
    ([cropType, count]) => {
      if (count > 0 && currentSlot <= 10) {
        const config = SEED_CONFIGS[cropType as SeedType];
        toolbar.push({
          id: `${cropType}_crop`,
          icon: cropType === "parsnip" ? "🥕" : "🥔",
          name: config.name,
          key: currentSlot === 10 ? "0" : currentSlot.toString(),
          count: count,
          disabled: false,
        });
        currentSlot++;
      }
    }
  );

  // Add materials (wood, etc.) to toolbar
  if (gameState.inventory.wood > 0 && currentSlot <= 10) {
    toolbar.push({
      id: "wood",
      icon: "🪵",
      name: "Wood",
      key: currentSlot === 10 ? "0" : currentSlot.toString(),
      count: gameState.inventory.wood,
      disabled: false,
    });
    currentSlot++;
  }

  // Fill remaining slots with empty slots if needed (optional, for visual consistency)
  while (currentSlot <= 10 && toolbar.length < 10) {
    toolbar.push({
      id: `empty_${currentSlot}`,
      icon: "➖",
      name: "Empty",
      key: currentSlot === 10 ? "0" : currentSlot.toString(),
      disabled: true,
    });
    currentSlot++;
  }

  return toolbar;
};
