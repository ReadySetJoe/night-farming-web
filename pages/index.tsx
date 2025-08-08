import { useState, useEffect, useCallback } from "react";
import { GameState, KeyState, ViewportSize, ToolType } from "../lib/types";
import { createWorld } from "../lib/world";
import { createMaryNPC } from "../lib/npcs";
import {
  handleAction,
  getTargetPosition,
  isTargetActionable,
} from "../lib/gameLogic";
import { useGameLoop } from "../hooks/useGameLoop";
import { useInput } from "../hooks/useInput";
import { useGameTime } from "../hooks/useGameTime";
import { GameWorld } from "../components/GameWorld";
import { GameUI } from "../components/GameUI";
import { HorrorOverlay } from "../components/HorrorOverlay";
import { SaveDialog } from "../components/SaveDialog";
import { StaminaBar } from "../components/StaminaBar";
import {
  saveGame,
  loadGame,
  hasSaveGame,
  applySaveData,
} from "../lib/saveSystem";
import {
  CELL_SIZE,
  STARTING_COINS,
  STARTING_HOUR,
  STARTING_MINUTE,
  STARTING_PARSNIP_SEEDS,
  STARTING_POTATO_SEEDS,
  STARTING_WOOD,
  MAX_STAMINA,
} from "../lib/constants";

export default function NightFarming() {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 4,
      y: 4,
      pixelX: 4 * CELL_SIZE,
      pixelY: 4 * CELL_SIZE,
      facing: "down",
      isMoving: false,
      stamina: MAX_STAMINA,
      maxStamina: MAX_STAMINA,
      isResting: false,
    },
    camera: {
      x: 4 * CELL_SIZE,
      y: 4 * CELL_SIZE,
    },
    world: createWorld(),
    selectedTool: "hoe",
    inventory: {
      seeds: {
        parsnip: STARTING_PARSNIP_SEEDS,
        potato: STARTING_POTATO_SEEDS,
      },
      crops: {
        parsnip: 0,
        potato: 0,
      },
      coins: STARTING_COINS,
      wood: STARTING_WOOD,
    },
    currentScene: "exterior",
    gameTime: {
      hours: STARTING_HOUR,
      minutes: STARTING_MINUTE,
      totalMinutes: STARTING_HOUR * 60 + STARTING_MINUTE,
      day: 1,
    },
    npcs: [createMaryNPC()],
    activeDialogue: null,
    horrorEvent: null,
    droppedItems: [],
    treeHealth: new Map(),
    savePrompt: null,
  });

  const [keys, setKeys] = useState<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 1200,
    height: 800,
  });

  const [debugMode, setDebugMode] = useState(false);

  // Handlers
  const handleToolSelect = useCallback((tool: ToolType) => {
    setGameState(prev => ({ ...prev, selectedTool: tool }));
  }, []);

  const handleGameAction = useCallback(() => {
    setGameState(prev => handleAction(prev));
  }, []);

  const handleSave = useCallback(() => {
    // Save the current state (saveGame increments the day internally)
    saveGame(gameState);

    // Reset time, increment day, restore stamina, and move player away from bed
    setGameState(prev => {
      const prevDay = prev.gameTime?.day || 1;
      const newDay = prevDay + 1;

      // Move player down one tile from bed to avoid retriggering save
      const newPlayerY = prev.player.y + 1;

      return {
        ...prev,
        gameTime: {
          hours: STARTING_HOUR,
          minutes: STARTING_MINUTE,
          totalMinutes: STARTING_HOUR * 60 + STARTING_MINUTE,
          day: newDay,
        },
        player: {
          ...prev.player,
          y: newPlayerY,
          pixelY: newPlayerY * CELL_SIZE,
          stamina: prev.player.maxStamina, // Restore stamina to full when sleeping
        },
        camera: {
          ...prev.camera,
          y: newPlayerY * CELL_SIZE,
        },
        savePrompt: null,
      };
    });
  }, [gameState]);

  const handleCancelSave = useCallback(() => {
    setGameState(prev => {
      // Move player down one tile from bed to avoid retriggering save
      const newPlayerY = prev.player.y + 1;

      return {
        ...prev,
        player: {
          ...prev.player,
          y: newPlayerY,
          pixelY: newPlayerY * CELL_SIZE,
        },
        camera: {
          ...prev.camera,
          y: newPlayerY * CELL_SIZE,
        },
        savePrompt: null,
      };
    });
  }, []);

  // Setup input handling
  useInput(
    setKeys,
    setDebugMode,
    handleToolSelect,
    handleGameAction,
    gameState
  );

  // Load saved game on startup
  useEffect(() => {
    if (hasSaveGame()) {
      const saveData = loadGame();
      if (saveData) {
        setGameState(prev => applySaveData(prev, saveData));
      }
    }
  }, []);

  // Setup viewport size tracking
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  // Setup game loops
  useGameLoop(keys, setGameState);
  useGameTime(setGameState);

  // Get target position for highlighting
  const targetPos = getTargetPosition(gameState.player);
  const isActionable = isTargetActionable(
    targetPos.x,
    targetPos.y,
    gameState.selectedTool,
    gameState.world,
    gameState.inventory
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden relative">
      <GameWorld
        gameState={gameState}
        viewportSize={viewportSize}
        debugMode={debugMode}
        targetPos={targetPos}
        isActionable={isActionable}
      />

      <GameUI
        gameState={gameState}
        debugMode={debugMode}
        targetPos={targetPos}
        isActionable={isActionable}
        onToolSelect={handleToolSelect}
      />

      <HorrorOverlay horrorEvent={gameState.horrorEvent} />

      <StaminaBar
        stamina={gameState.player.stamina}
        maxStamina={gameState.player.maxStamina}
        isResting={false}
      />

      <SaveDialog
        gameState={gameState}
        onSave={handleSave}
        onCancel={handleCancelSave}
      />
    </div>
  );
}
