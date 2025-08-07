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
import {
  CELL_SIZE,
  STARTING_COINS,
  STARTING_HOUR,
  STARTING_MINUTE,
  STARTING_PARSNIP_SEEDS,
  STARTING_POTATO_SEEDS,
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
      crops: 0,
      coins: STARTING_COINS,
    },
    currentScene: "exterior",
    gameTime: {
      hours: STARTING_HOUR,
      minutes: STARTING_MINUTE,
      totalMinutes: STARTING_HOUR * 60 + STARTING_MINUTE,
    },
    npcs: [createMaryNPC()],
    activeDialogue: null,
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

  // Setup input handling
  useInput(
    setKeys,
    setDebugMode,
    handleToolSelect,
    handleGameAction,
    gameState
  );

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
    </div>
  );
}
