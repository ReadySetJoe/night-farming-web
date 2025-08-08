# World System Documentation

The world system is responsible for generating and managing all game scenes and their layouts.

## Architecture

### Core Files
- `lib/world.ts` - Main world generation functions
- `lib/worldHelpers.ts` - Modular helper functions for world features
- `lib/collision.ts` - Collision detection and terrain validation

### Scene Types
1. **Exterior Farm** (`exterior`) - Main game world (40x30)
2. **House Interior** (`interior`) - Player's house (12x8)
3. **Town Square** (`town_square`) - Central town area (30x25)
4. **Arena** (`arena`) - Combat area (20x15)
5. **Building Interiors**:
   - General Store (`general_store`) - Shop (10x8)
   - Blacksmith (`blacksmith`) - Crafting area (10x8)
   - Cozy House (`cozy_house`) - NPC home (12x10)

## World Generation Process

### Exterior Farm Generation
```typescript
export const createWorld = (): TerrainType[][] => {
  // 1. Create grass base layer
  // 2. Add main features
  // 3. Create exits and pathways
  // 4. Generate farming areas
}
```

**Steps:**
1. **Base Layer**: Fill entire 40x30 grid with grass
2. **House Structure**: 3x4 house with walls, floor, and door
3. **Water Feature**: 6x6 water area in bottom-right
4. **Perimeter Trees**: Forest border around entire world
5. **Arena Exit**: Left-side exit (⚔️) leading to combat arena
6. **Town Exit**: Right-side exit (🌆) leading to town square
7. **Fencing System**: Inner perimeter fence blocking forest access
8. **Pathways**: Brown dirt paths connecting key areas
9. **Farm Area**: 12x12 farmable land in center
10. **Interior Trees**: Scattered decorative trees

### Modular Helper System

The world generation has been refactored into focused helper functions:

- `createHouse()` - Builds the player's house structure
- `createWaterFeature()` - Places water tiles in designated area
- `createPerimeterTrees()` - Creates forest border
- `createArenaExit()` - Sets up left-side arena entrance
- `createTownExit()` - Sets up right-side town entrance
- `createFencing()` - Places protective fence with strategic gaps
- `createPathways()` - Generates navigation paths
- `createFarmArea()` - Clears farmable soil area
- `createInteriorTrees()` - Places scattered atmospheric trees

## Terrain System

### Terrain Types
- **Passable**: `grass`, `path`, `house_floor`, `stone_path`, `exit_*`
- **Solid**: `house_wall`, `water`, `tree`, `fence`, `stone_wall`, furniture
- **Interactive**: `house_door`, `building_door`, `exit_*`, `forge`
- **Special**: `null` (farmable soil)

### Exit System
- **Arena**: `exit_to_arena` tiles (⚔️) on left edge
- **Town**: `exit_to_town` tiles (🌆) on right edge  
- **Farm**: `exit_to_farm` tiles (🚜) in town/arena leading back

## Collision Detection

```typescript
export const checkCollision = (pixelX: number, pixelY: number, world: TerrainType[][]): boolean
```

- Uses actual world dimensions (not hardcoded constants)
- Converts pixel coordinates to grid positions
- Checks terrain solidity via `SOLID_TERRAIN_TYPES` array

## Scene Transitions

Automatic walkthrough transitions occur when player steps on exit tiles:
- `exterior` ↔ `arena` via `exit_to_arena`/`exit_to_farm`
- `exterior` ↔ `town_square` via `exit_to_town`/`exit_to_farm`
- `exterior` ↔ `interior` via spacebar on `house_door`

## Pathways & Navigation

**Strategic Path System:**
- **House → Farm**: Direct vertical + horizontal path
- **Farm → Arena**: Horizontal path to left exit
- **Farm → Town**: Horizontal path to right exit
- **Clearance**: Paths automatically clear blocking terrain

## Design Philosophy

### Anti-Grinding Measures
- **Fence Blocks Forest**: Inner fence prevents access to unlimited trees
- **Limited Interior Trees**: Only ~11 trees inside for early-game resources
- **Perimeter Trees**: Atmospheric but inaccessible

### Player Flow
- **Central Farm Hub**: All paths lead to/from the farming area
- **Natural Navigation**: Brown paths guide player movement
- **Clear Exits**: Distinct exit tiles with recognizable icons
- **No Dead Ends**: Every area has clear entry/exit routes

## Future Considerations

### Expandability
- Modular helper system allows easy feature addition
- Scene system supports unlimited new areas
- Exit system can accommodate more destinations

### Performance
- Efficient world generation using helper functions
- Collision detection optimized for dynamic world sizes
- Minimal terrain state changes during gameplay