// World dimensions
export const WORLD_WIDTH = 40;
export const WORLD_HEIGHT = 30;

// Farm area configuration
export const FARM_START_X = 10;
export const FARM_START_Y = 10;
export const FARM_SIZE = 12;

// Game rendering settings
export const CELL_SIZE = 48;
export const MOVE_SPEED = 4; // pixels per frame

// Camera settings
export const CAMERA_MOVE_SPEED = 0.1;

// Game timing
export const FPS = 60;
export const CROP_GROWTH_INTERVAL = 3000; // 3 seconds per growth stage
export const TIME_TICK_INTERVAL = 5000; // 5 seconds = 10 minutes in game time
export const STARTING_HOUR = 6; // 6:00 AM
export const STARTING_MINUTE = 0;

// Economy
export const STARTING_COINS = 100;
export const STARTING_PARSNIP_SEEDS = 5;
export const STARTING_POTATO_SEEDS = 3;

// Base tool definitions (seeds will be added dynamically)
export const BASE_TOOLS = [
  { id: "hoe", icon: "🔨", name: "Hoe", key: "1" },
  { id: "watering_can", icon: "💧", name: "Water", key: "2" },
  { id: "hand", icon: "✋", name: "Harvest", key: "3" },
] as const;

// Input keys
export const MOVEMENT_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
  "W",
  "A",
  "S",
  "D",
] as const;

export const GAME_CONTROL_KEYS = [
  ...MOVEMENT_KEYS,
  " ",
  "1",
  "2",
  "3",
  "4",
  "F3",
  "f3",
] as const;

// Solid terrain types for collision detection
export const SOLID_TERRAIN_TYPES = [
  "house_wall",
  "water",
  "tree",
  "house_door",
  "building_wall",
  "building_door",
  "fountain",
  "fence",
  "stone_wall",
  "shop_counter",
  "shop_shelf",
  "anvil",
  "forge",
  "kitchen_counter",
  "bookshelf",
  "display_case",
  "workbench",
  "stove",
] as const;
