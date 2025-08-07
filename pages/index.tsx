import { useState, useEffect, useCallback } from "react";
import { GameState, KeyState, ViewportSize, ToolType } from "../lib/types";
import { createWorld } from "../lib/world";
import { handleAction, getTargetPosition, isTargetActionable } from "../lib/gameLogic";
import { useGameLoop } from "../hooks/useGameLoop";
import { useInput } from "../hooks/useInput";
import { GameWorld } from "../components/GameWorld";
import { GameUI } from "../components/GameUI";
import { 
  FARM_START_X, 
  FARM_START_Y, 
  CELL_SIZE, 
  STARTING_SEEDS, 
  STARTING_COINS 
} from "../lib/constants";

export default function NightFarming() {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: FARM_START_X + 5,
      y: FARM_START_Y + 5,
      pixelX: (FARM_START_X + 5) * CELL_SIZE,
      pixelY: (FARM_START_Y + 5) * CELL_SIZE,
      facing: "down",
      isMoving: false,
    },
    camera: {
      x: (FARM_START_X + 5) * CELL_SIZE,
      y: (FARM_START_Y + 5) * CELL_SIZE,
    },
    world: createWorld(),
    selectedTool: "hoe",
    inventory: { seeds: STARTING_SEEDS, crops: 0, coins: STARTING_COINS },
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
  useInput(setKeys, setDebugMode, handleToolSelect, handleGameAction);

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
