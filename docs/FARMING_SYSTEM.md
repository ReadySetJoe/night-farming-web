# Farming System Documentation

The farming system implements multi-stage crop growth with progressive watering requirements.

## Architecture

### Core Files
- `lib/game/gameLogic.ts` - Core farming mechanics and action handling
- `lib/game/seeds.ts` - Seed configuration and crop display logic
- `lib/constants.ts` - Crop timing, growth, and economic constants

## Crop System

### Available Crops

**🥕 Parsnip Seeds** (Beginner Crop)
- **Watering Requirement**: 1 total watering
- **Growth Stages**: 4 stages (🌱 → 🌿 → 🌾 → 🥕)
- **Sell Price**: 50 coins
- **Strategy**: Easy introduction to farming mechanics

**🥔 Potato Seeds** (Advanced Crop)
- **Watering Requirement**: 3 total waterings
- **Growth Stages**: 5 stages (🌱 → 🌿 → 🟫 → 🔸 → 🥔)
- **Sell Price**: 80 coins
- **Strategy**: Higher reward for more complex water management

### Growth Mechanics

```typescript
interface Crop {
  type: CropType;
  stage: number;           // Current growth stage (0 to maxStage)
  maxStage: number;        // Final harvestable stage
  watered: boolean;        // Fully watered for current stage?
  plantedAt: number;       // Timestamp of planting
  wateringsReceived: number;    // Current waterings for this stage
  wateringsRequired: number;    // Total waterings needed per stage
}
```

**Progressive Growth System:**
1. **Stage Advancement**: Crops advance stages only when fully watered
2. **Reset Waterings**: Watering counter resets after each stage advance  
3. **Time Gates**: 3-second intervals between potential stage advances
4. **Validation**: Both time AND watering requirements must be met

### Individual Seed Tools

**Dynamic Toolbar System:**
- Each seed type appears as its own selectable tool
- Tools show count badges and disable when empty
- Direct planting: Select seed tool → plant that specific seed type
- Inventory-based: Tools only appear when player owns seeds

## Farming Actions

### 🔨 Hoe (Till Soil)
- **Target**: Empty farmable soil (`null` terrain)
- **Result**: Creates `tilled` soil ready for planting
- **Stamina Cost**: 1 point
- **Limitation**: Only works within farm boundaries (12x12 area)

### 🥕🥔 Plant Seeds (Individual Tools)
- **Target**: Tilled soil (`type: "tilled"`)
- **Requirements**: Must own seeds of selected type
- **Result**: Places crop with initial stage 0, sets watering requirements
- **Stamina Cost**: 1 point per planting
- **Inventory**: Decrements seed count

### 💧 Water Crops
- **Target**: Planted crops needing water (`wateringsReceived < wateringsRequired`)
- **Result**: Increments `wateringsReceived`, sets `watered: true` when sufficient
- **Visual Feedback**: Crops show 💧 indicator when partially watered
- **Stamina Cost**: 1 point per watering
- **Progressive**: Each growth stage requires full watering quota

### ✋ Harvest Crops
- **Target**: Mature crops (`stage === maxStage`)
- **Result**: Drops harvestable items for pickup, clears tile to `null`
- **Physics**: Items "pop out" with small velocity and magnetic collection
- **Stamina Cost**: 1 point per harvest
- **Economics**: Convert to coins via item pickup system

## Item Drop & Collection System

### Physics-Based Drops
```typescript
// Crops drop with small upward velocity
velocityY: -0.1 - Math.random() * 0.05
velocityX: (Math.random() - 0.5) * 0.05

// Collection delays
CROP_PICKUP_DELAY: 500ms  // 0.5 seconds
WOOD_PICKUP_DELAY: 1500ms // 1.5 seconds
```

### Magnetic Collection
- **Range**: 3-tile magnet range, 1.5-tile pickup range
- **Behavior**: Items magnetically attracted when player nearby
- **Timing**: Pickup delay prevents instant collection
- **Integration**: Items added to toolbar inventory system

## Economic System

### Pricing Strategy
- **Parsnips**: 50 coins (simple 1-watering crop)
- **Potatoes**: 80 coins (complex 3-watering crop)  
- **Scaling**: Higher difficulty = higher reward
- **Progression**: Encourages player skill advancement

### Resource Management
- **Starting Resources**: 5 parsnip seeds, 3 potato seeds, 100 coins
- **Expansion Strategy**: Sell crops to buy more seeds
- **Choice Complexity**: Players choose between easy/fast vs difficult/profitable

## Visual Feedback System

### Growth Stage Indicators
Each crop displays appropriate emoji for its current stage:
- **Stage 0**: Seedling (🌱)
- **Mid Stages**: Type-specific growth indicators
- **Final Stage**: Harvestable crop emoji (🥕, 🥔)

### Watering Status
- **Sufficient Water**: Normal crop display
- **Needs Water**: Crop + 💧 indicator overlay
- **Debug Mode**: Shows exact watering progress (e.g., "2/3")

## Timing & Balance

### Growth Timing
```typescript
CROP_GROWTH_INTERVAL: 3000ms // 3 seconds per stage when watered
```

### Stamina Integration
- **All Actions Cost Stamina**: Prevents unlimited farming
- **Strategic Planning**: Players must manage energy throughout day
- **Rest Requirement**: Forces breaks in farming activity

## Design Philosophy

### Progressive Complexity
1. **Tutorial Crop (Parsnips)**: Simple 1-watering system teaches basics
2. **Advanced Crop (Potatoes)**: Complex 3-watering system adds depth
3. **Expansion Ready**: Framework supports unlimited crop varieties

### Player Skill Development
- **Water Management**: Learning to track multiple crops' watering needs  
- **Time Management**: Balancing multiple growth stages simultaneously
- **Economic Planning**: Choosing crop mix based on effort vs reward

### Quality of Life
- **Visual Clarity**: Clear indicators for all crop states
- **Flexible Tools**: Individual seed tools eliminate multi-step selection
- **Magnetic Collection**: Satisfying pickup mechanics without tedium