export interface Crop {
  type: string;
  stage: number;
  maxStage: number;
  watered: boolean;
  plantedAt: number;
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
  seeds: number;
  crops: number;
  coins: number;
}

export interface GameState {
  player: Player;
  camera: Camera;
  world: (Crop | null | string)[][];
  selectedTool: "hoe" | "seeds" | "watering_can" | "hand";
  inventory: Inventory;
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
export type ToolType = "hoe" | "seeds" | "watering_can" | "hand";