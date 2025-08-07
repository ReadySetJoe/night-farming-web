import { NPC } from "./types";
import { CELL_SIZE } from "./constants";

// Create Mary NPC with meandering movement path through town pathways
export const createMaryNPC = (): NPC => {
  const startX = 12; // Start near town entrance
  const startY = 12;
  
  // Define a meandering path that visits all buildings with pauses
  const meanderingPath = [
    // Start near entrance
    { x: 12, y: 12 }, // Start position
    { x: 10, y: 12 }, // Move toward entrance path
    { x: 8, y: 12 }, // On main path
    { x: 8, y: 10 }, // Approach general store
    { x: 8, y: 9, pauseTime: 180 }, // Pause in front of general store (3 seconds)
    
    // Head to blacksmith via pathways
    { x: 9, y: 8 }, // Move toward central square
    { x: 10, y: 7 }, // On horizontal path
    { x: 15, y: 7 }, // Move along path to blacksmith area
    { x: 15, y: 6 }, // Approach blacksmith
    { x: 15, y: 5, pauseTime: 200 }, // Pause in front of blacksmith (3.3 seconds)
    
    // Head to house via pathways  
    { x: 16, y: 7 }, // Back to horizontal path
    { x: 20, y: 7 }, // Move along path toward house
    { x: 22, y: 8 }, // Approach house
    { x: 22, y: 10, pauseTime: 160 }, // Pause in front of house (2.7 seconds)
    
    // Return via lower path
    { x: 20, y: 13 }, // Move to lower return path
    { x: 18, y: 13 }, // Continue on path
    { x: 16, y: 13 }, // Near fountain area
    { x: 15, y: 13, pauseTime: 120 }, // Brief pause at fountain (2 seconds)
    { x: 14, y: 13 }, // Continue around fountain
    { x: 13, y: 12 }, // Back toward start area
  ];

  return {
    id: "mary",
    name: "Mary",
    x: startX,
    y: startY,
    pixelX: startX * CELL_SIZE,
    pixelY: startY * CELL_SIZE,
    facing: "left",
    isMoving: false,
    emoji: "👩‍🌾",
    dialogue: [
      "Hello there! Welcome to our lovely town square!",
      "I love visiting all the shops here - each one has its own character.",
      "The blacksmith makes the finest tools, and the general store has everything you need.",
      "Sometimes I just like to sit by the fountain and watch the world go by.",
      "This town has been my home for many years - I know every pathway by heart!"
    ],
    currentDialogueIndex: 0,
    movementPath: meanderingPath,
    currentPathIndex: 0,
    moveSpeed: 1.5, // Much slower than player for meandering feel
    scene: "town_square",
    pauseTimer: 0,
    isPaused: false
  };
};

// Get next position in NPC's movement path
export const getNextNPCPosition = (npc: NPC): { x: number; y: number } => {
  const nextIndex = (npc.currentPathIndex + 1) % npc.movementPath.length;
  return npc.movementPath[nextIndex];
};

// Calculate facing direction based on movement
export const getNPCFacing = (fromX: number, fromY: number, toX: number, toY: number): "up" | "down" | "left" | "right" => {
  if (toX > fromX) return "right";
  if (toX < fromX) return "left";
  if (toY > fromY) return "down";
  if (toY < fromY) return "up";
  return "right"; // Default
};

// Get distance between two points
export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// Check if player is close enough to interact with NPC
export const canInteractWithNPC = (playerX: number, playerY: number, npc: NPC): boolean => {
  const distance = getDistance(playerX, playerY, npc.x, npc.y);
  return distance <= 1.5; // Within 1.5 tiles
};

// Get next dialogue line for NPC
export const getNextDialogue = (npc: NPC): string => {
  const dialogue = npc.dialogue[npc.currentDialogueIndex];
  return dialogue;
};

// Advance NPC dialogue to next line
export const advanceDialogue = (npc: NPC): NPC => {
  return {
    ...npc,
    currentDialogueIndex: (npc.currentDialogueIndex + 1) % npc.dialogue.length
  };
};