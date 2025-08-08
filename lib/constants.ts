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
export const STARTING_WOOD = 0;

// Stamina
export const MAX_STAMINA = 100;
export const STAMINA_COSTS = {
  HOE: 1,
  PLANT: 1,
  WATER: 1,
  HARVEST: 1,
  CHOP: 3,
} as const;
export const STAMINA_DECAY_RATE = 0.1; // Gradual stamina loss per tick
export const STAMINA_DECAY_INTERVAL = 5000; // 5 seconds between decay ticks

// Health & Combat
export const MAX_HEALTH = 100;
export const INVULNERABILITY_DURATION = 1500; // 1.5 seconds of invincibility after taking damage
export const ENEMY_DAMAGE = 10; // Base damage enemies deal to player
export const ENEMY_DAMAGE_COOLDOWN = 1000; // 1 second between enemy attacks

// Sword combat
export const SWORD_DAMAGE = 25; // Damage dealt by sword
export const SWORD_RANGE = CELL_SIZE * 1.5; // Range of sword attack
export const KNOCKBACK_DISTANCE = CELL_SIZE * 2; // How far enemies get knocked back
export const SWORD_SWING_DURATION = 300; // 300ms sword swing animation
export const KNOCKBACK_DURATION = 400; // 400ms knockback animation duration
export const KNOCKBACK_FRICTION = 0.85; // Friction applied to knockback velocity

// Tree chopping
export const TREE_MAX_HEALTH = 3;
export const WOOD_DROP_COUNT = 3;

// Item collection
export const ITEM_PICKUP_RANGE = 1.5;
export const ITEM_MAGNET_RANGE = 3;
export const ITEM_MAGNET_SPEED = 0.15;
export const ITEM_PICKUP_DELAY = 1500; // 1.5 seconds before wood can be picked up
export const CROP_PICKUP_DELAY = 500; // 0.5 seconds before crops can be picked up

// Base tool definitions (seeds will be added dynamically)
export const BASE_TOOLS = [
  { id: "hoe", icon: "🔨", name: "Hoe", key: "1" },
  { id: "watering_can", icon: "💧", name: "Water", key: "2" },
  { id: "hand", icon: "✋", name: "Harvest", key: "3" },
  { id: "axe", icon: "🪓", name: "Axe", key: "4" },
  { id: "sword", icon: "⚔️", name: "Sword", key: "5" },
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
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
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
