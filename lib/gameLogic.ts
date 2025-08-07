import { GameState, Player, TargetPosition, Inventory, Crop, TerrainType, ToolType } from "./types";
import { WORLD_WIDTH, WORLD_HEIGHT, FARM_START_X, FARM_START_Y, FARM_SIZE, CROP_SELL_PRICE } from "./constants";

export const getTargetPosition = (player: Player): TargetPosition => {
  let targetX = player.x;
  let targetY = player.y;

  switch (player.facing) {
    case "up":
      targetY = Math.max(0, targetY - 1);
      break;
    case "down":
      targetY = Math.min(WORLD_HEIGHT - 1, targetY + 1);
      break;
    case "left":
      targetX = Math.max(0, targetX - 1);
      break;
    case "right":
      targetX = Math.min(WORLD_WIDTH - 1, targetX + 1);
      break;
  }

  return { x: targetX, y: targetY };
};

export const isTargetActionable = (
  targetX: number,
  targetY: number,
  selectedTool: ToolType,
  world: TerrainType[][],
  inventory: Inventory
): boolean => {
  // Check if target is on farmable land
  const farmX = targetX - FARM_START_X;
  const farmY = targetY - FARM_START_Y;
  const isOnFarm =
    farmX >= 0 && farmX < FARM_SIZE && farmY >= 0 && farmY < FARM_SIZE;

  if (!isOnFarm) return false; // Can't farm outside the farm area

  const currentCell = world[targetY]?.[targetX];

  switch (selectedTool) {
    case "hoe":
      return !currentCell; // Can till empty soil

    case "seeds":
      return currentCell?.type === "tilled" && inventory.seeds > 0; // Can plant on tilled soil if we have seeds

    case "watering_can":
      return (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        !currentCell.watered
      ); // Can water unwatered crops

    case "hand":
      return (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.stage === currentCell.maxStage
      ); // Can harvest mature crops only

    default:
      return false;
  }
};

export const handleAction = (prevState: GameState): GameState => {
  const { player, world, selectedTool, inventory } = prevState;
  const newWorld = world.map(row => [...row]);
  const newInventory = { ...inventory };

  // Calculate target position based on facing direction
  const targetPos = getTargetPosition(player);
  const { x: targetX, y: targetY } = targetPos;

  // Check if target is on farmable land
  const farmX = targetX - FARM_START_X;
  const farmY = targetY - FARM_START_Y;
  const isOnFarm =
    farmX >= 0 && farmX < FARM_SIZE && farmY >= 0 && farmY < FARM_SIZE;

  if (!isOnFarm) return prevState; // Can't farm outside the farm area

  const currentCell = newWorld[targetY][targetX];

  switch (selectedTool) {
    case "hoe":
      if (!currentCell) {
        newWorld[targetY][targetX] = {
          type: "tilled",
          stage: 0,
          maxStage: 0,
          watered: false,
          plantedAt: 0,
        };
      }
      break;

    case "seeds":
      if (currentCell?.type === "tilled" && inventory.seeds > 0) {
        newWorld[targetY][targetX] = {
          type: "parsnip",
          stage: 0,
          maxStage: 3,
          watered: false,
          plantedAt: Date.now(),
        };
        newInventory.seeds--;
      }
      break;

    case "watering_can":
      if (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled"
      ) {
        newWorld[targetY][targetX] = { ...currentCell, watered: true };
      }
      break;

    case "hand":
      if (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.stage === currentCell.maxStage
      ) {
        newInventory.crops++;
        newInventory.coins += CROP_SELL_PRICE;
        newWorld[targetY][targetX] = null;
      }
      break;
  }

  return { ...prevState, world: newWorld, inventory: newInventory };
};

export const getCellDisplay = (cell: TerrainType): string => {
  if (cell === null) return "🟫"; // Farmable soil
  if (typeof cell === "string") {
    switch (cell) {
      case "grass":
        return "🟩";
      case "house_wall":
        return "🧱";
      case "house_floor":
        return "🟫";
      case "house_door":
        return "🚪";
      case "water":
        return "💧";
      case "tree":
        return "🌲";
      default:
        return "❓";
    }
  }
  if (typeof cell === "object") {
    if (cell.type === "tilled") return "🟤";
    if (cell.type === "parsnip") {
      if (cell.stage === 0) return cell.watered ? "💧" : "🌱";
      if (cell.stage === 1) return "🌿";
      if (cell.stage === 2) return "🌾";
      if (cell.stage === 3) return "🥕";
    }
  }
  return "❓";
};

export const formatTerrainForDebug = (terrain: TerrainType): string => {
  if (typeof terrain === "object") {
    return `crop(${terrain?.type})`;
  }
  return terrain || "null";
};