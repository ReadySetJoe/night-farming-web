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
  crops: number;
  coins: number;
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
  scene: "exterior" | "interior" | "town_square" | "general_store" | "blacksmith" | "cozy_house";
  pauseTimer: number;
  isPaused: boolean;
}

export interface GameState {
  player: Player;
  camera: Camera;
  world: (Crop | null | string)[][];
  selectedTool: ToolType;
  inventory: Inventory;
  currentScene: "exterior" | "interior" | "town_square" | "general_store" | "blacksmith" | "cozy_house";
  gameTime: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  npcs: NPC[];
  activeDialogue: {
    npcId: string;
    text: string;
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
export type ToolType = "hoe" | "watering_can" | "hand" | SeedType;

export interface SeedConfig {
  name: string;
  emoji: string;
  maxStage: number;
  wateringsRequired: number;
  sellPrice: number;
  growthEmojis: string[];
}