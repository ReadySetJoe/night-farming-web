export type SeedType = "parsnip" | "potato";
export type CropType = SeedType | "tilled";

export interface Crop {
  type: CropType;
  stage: number;
  maxStage: number;
  watered: boolean;
  plantedAt: number;
  wateringsReceived: number;
  wateringsRequired: number;
}

export interface Player {
  x: number;
  y: number;
  pixelX: number;
  pixelY: number;
  facing: "up" | "down" | "left" | "right";
  isMoving: boolean;
  stamina: number;
  maxStamina: number;
  isResting: boolean;
  health: number;
  maxHealth: number;
  invulnerable: boolean;
  invulnerabilityTimer: number;
  isSwinging: boolean;
  swingTimer: number;
}

export interface Camera {
  x: number;
  y: number;
}

export interface Inventory {
  seeds: {
    parsnip: number;
    potato: number;
  };
  crops: {
    parsnip: number;
    potato: number;
  };
  coins: number;
  wood: number;
  selectedSeed?: SeedType;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  pixelX: number;
  pixelY: number;
  facing: "up" | "down" | "left" | "right";
  isMoving: boolean;
  emoji: string;
  dialogue: string[];
  currentDialogueIndex: number;
  movementPath: { x: number; y: number; pauseTime?: number }[];
  currentPathIndex: number;
  moveSpeed: number;
  scene:
    | "exterior"
    | "interior"
    | "town_square"
    | "general_store"
    | "blacksmith"
    | "cozy_house"
    | "arena";
  pauseTimer: number;
  isPaused: boolean;
}

export interface HorrorEvent {
  id: string;
  type: "forge_nightmare";
  isActive: boolean;
  startTime: number;
  duration: number;
  intensity: number;
}

export interface GameState {
  player: Player;
  camera: Camera;
  world: (Crop | null | string)[][];
  selectedTool: ToolType;
  inventory: Inventory;
  currentScene:
    | "exterior"
    | "interior"
    | "town_square"
    | "general_store"
    | "blacksmith"
    | "cozy_house"
    | "arena";
  gameTime: {
    hours: number;
    minutes: number;
    totalMinutes: number;
    day: number;
  };
  npcs: NPC[];
  enemies: Enemy[];
  activeDialogue: {
    npcId: string;
    text: string;
    isActive: boolean;
  } | null;
  horrorEvent: HorrorEvent | null;
  droppedItems: DroppedItem[];
  treeHealth: Map<string, TreeData>;
  savePrompt: {
    isActive: boolean;
  } | null;
}

export interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface TargetPosition {
  x: number;
  y: number;
}

export type TerrainType = Crop | null | string;
export type ToolType = "hoe" | "watering_can" | "hand" | "axe" | "sword" | "wood" | "parsnip_crop" | "potato_crop" | SeedType | string;

export interface SeedConfig {
  name: string;
  emoji: string;
  maxStage: number;
  wateringsRequired: number;
  sellPrice: number;
  growthEmojis: string[];
}

export type ItemType = "wood" | "parsnip" | "potato";

export interface DroppedItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  createdAt: number;
}

export interface TreeData {
  health: number;
  maxHealth: number;
}

export interface Enemy {
  id: string;
  type: "slime" | "bat" | "skeleton";
  x: number;
  y: number;
  pixelX: number;
  pixelY: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  lastDamageTime: number;
  scene: string;
  facing: "up" | "down" | "left" | "right";
  isMoving: boolean;
  // AI behavior properties
  targetX?: number;
  targetY?: number;
  behaviorTimer: number;
  currentBehavior: "chase" | "wander" | "pause";
  // Knockback properties
  isKnockedBack: boolean;
  knockbackVelocityX: number;
  knockbackVelocityY: number;
  knockbackTimer: number;
}
