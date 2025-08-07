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

  // Add base tools
  BASE_TOOLS.forEach((tool, index) => {
    toolbar.push({
      ...tool,
      key: (index + 1).toString(),
    });
  });

  // Add seed tools based on inventory
  Object.entries(gameState.inventory.seeds).forEach(
    ([seedType, count], index) => {
      const config = SEED_CONFIGS[seedType as SeedType];
      toolbar.push({
        id: seedType,
        icon: config.emoji,
        name: `${config.name} Seeds`,
        key: (BASE_TOOLS.length + index + 1).toString(),
        count: count,
        disabled: count === 0,
      });
    }
  );

  return toolbar;
};
