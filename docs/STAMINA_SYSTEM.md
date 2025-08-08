# Stamina System Documentation

The stamina system implements daily energy management requiring strategic planning and rest cycles.

## Architecture

### Core Files
- `lib/constants.ts` - Stamina costs, decay rates, and maximum values
- `hooks/useGameLoop.ts` - Stamina decay over time
- `lib/game/gameLogic.ts` - Action stamina costs and validation
- `components/StaminaBar.tsx` - Visual stamina indicator

## Stamina Mechanics

### Daily Resource Model
```typescript
interface Player {
  stamina: number;        // Current stamina (0-100)
  maxStamina: number;     // Maximum stamina (100)
  isResting: boolean;     // Currently resting (unused in current system)
}
```

**Core Concept**: Stamina is a finite daily resource that depletes through both actions and time passage.

### Stamina Costs

**Farming Actions:**
- **🔨 Hoe**: 1 stamina per till
- **🥕🥔 Plant**: 1 stamina per seed planted  
- **💧 Water**: 1 stamina per watering
- **✋ Harvest**: 1 stamina per crop harvested

**Resource Gathering:**
- **🪓 Tree Chopping**: 3 stamina per chop (most expensive action)

**Design Rationale**: Tree chopping costs more because it's a renewable resource that could be exploited.

### Time-Based Decay

```typescript
STAMINA_DECAY_RATE: 0.1        // Points lost per decay tick
STAMINA_DECAY_INTERVAL: 5000   // 5 seconds between decay ticks
```

**Gradual Depletion**: Players lose 0.1 stamina every 5 seconds (~1.2 stamina/minute), creating time pressure.

## Daily Balance

### Target Activity Level
**~100 Actions Per Day**: With max 100 stamina and 1-point farming actions, players can perform approximately:
- **70-80 farming actions** (accounting for time decay)
- **30-35 tree chops** (if focusing on resource gathering) 
- **Mixed strategy** balancing farming and resource collection

### Stamina Gates
```typescript
// Action validation in gameLogic.ts
if (prevState.player.stamina < STAMINA_COSTS.ACTION_TYPE) {
  return prevState; // Prevent action execution
}
```

**Hard Limits**: Actions cannot be performed without sufficient stamina, enforcing resource management.

## Recovery System

### Sleep-Only Restoration
- **Trigger**: Sleeping in bed (walk onto bed tile)
- **Effect**: Stamina restored to full (100 points)  
- **Day Advancement**: Sleep advances to next day and resets time to 6:00 AM
- **Strategy**: Players must plan when to sleep based on stamina levels

### No Idle Recovery
Unlike many games, standing still does NOT restore stamina - only sleep provides recovery.

## Visual Feedback

### StaminaBar Component
```typescript
const getBarColor = () => {
  if (percentage > 60) return "bg-green-500";   // Healthy
  if (percentage > 30) return "bg-yellow-500";  // Cautious  
  return "bg-red-500";                          // Exhausted
};
```

**Color-Coded Feedback:**
- **Green (60%+)**: Safe operating range
- **Yellow (30-60%)**: Moderate concern, plan rest
- **Red (≤30%)**: Critical, immediate rest needed

**Status Indicators:**
- **"Exhausted!" (≤20 stamina)**: Warning when critically low
- **Numerical Display**: Exact stamina count (e.g., "45 / 100")

## Strategic Gameplay

### Daily Planning
1. **Morning Activities**: High-energy tasks like tree chopping
2. **Mid-Day Farming**: Moderate stamina farming activities  
3. **Evening Decisions**: Choose between sleep or push limits
4. **Emergency Management**: Conserving stamina for essential tasks

### Resource Optimization
- **Efficiency Focus**: Plan actions to minimize stamina waste
- **Timing Management**: Balance time decay with action costs
- **Sleep Timing**: Strategic rest to maximize daily productivity

## Balance Philosophy

### Meaningful Choices
- **Action Prioritization**: Force players to choose most important activities
- **Risk/Reward**: Push stamina limits for more progress vs safe early sleep
- **Long-term Planning**: Multi-day strategies for major projects

### Anti-Grinding
- **Daily Limits**: Prevent infinite resource gathering sessions
- **Time Pressure**: Gradual decay creates urgency
- **Strategic Depth**: Adds resource management layer beyond basic farming

## Integration with Other Systems

### Save System
- **Sleep Trigger**: Stamina restoration tied to day advancement
- **Persistence**: Stamina state saved and restored with game state
- **Reset Mechanics**: New day always starts with full stamina

### Horror Elements (Future)
- **Stress Effects**: Horror events could affect stamina recovery
- **Night Penalties**: Staying awake too late might increase decay
- **Atmosphere**: Fatigue adds to psychological pressure

## Technical Implementation

### Validation Layer
```typescript
// Before every action
if (player.stamina < requiredStamina) {
  return currentState; // Block action
}

// After successful action  
player.stamina = Math.max(0, player.stamina - staminaCost);
```

### Decay Loop
```typescript
// In useGameLoop.ts
setInterval(() => {
  if (player.stamina > 0) {
    player.stamina = Math.max(0, player.stamina - STAMINA_DECAY_RATE);
  }
}, STAMINA_DECAY_INTERVAL);
```

## Future Considerations

### Potential Expansions
- **Tools**: Better tools cost less stamina
- **Food System**: Consumables provide temporary stamina boost
- **Skills**: Player abilities reduce action costs over time
- **Weather**: Environmental effects on stamina consumption
- **Difficulty Modes**: Adjustable decay rates and maximum stamina