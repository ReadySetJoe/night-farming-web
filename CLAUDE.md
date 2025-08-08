# Night Farming - Game Development Progress

## Project Overview

Night Farming is a browser-based farming simulation game inspired by Stardew Valley, built with Next.js, React, TypeScript, and Tailwind CSS. The game features a top-down farming experience with smooth movement, collision detection, stamina management, physics-based item collection, save system, and multiple connected scenes including a dedicated combat arena. The architecture is designed for gradual introduction of horror elements.

## Current System Status ✅

### ⚡ Stamina System (COMPLETE)
- **Daily Resource Management**: 100 stamina max, depletes with actions and time
- **Action Costs**: Farming (1), Tree chopping (3), with stamina gates preventing overuse
- **Time Decay**: Gradual stamina loss (0.1 per 5 seconds) creates time pressure
- **Sleep Recovery**: Only sleeping in bed restores stamina to full and advances day
- **Visual Feedback**: Color-coded stamina bar with exhaustion warnings

### 🎯 Physics-Based Item System (COMPLETE)
- **Item Drops**: Crops and wood items "pop out" with realistic physics
- **Magnetic Collection**: Items attracted to player when in range with pickup delays
- **Pickup Timing**: Wood (1.5s delay), Crops (0.5s delay) prevents instant collection
- **Toolbar Integration**: All collected items go directly to expanded toolbar inventory

### 🏠 Multi-Scene World System (COMPLETE)
- **Exterior Farm** (40x30): Main farming world with house, water, trees, and paths
- **House Interior** (12x8): Player's home with bed, furniture, save functionality
- **Town Square** (30x25): Central hub with buildings, NPCs, fountain, pathways
- **Arena** (20x15): Combat-ready arena with stone walls and torch decorations
- **Building Interiors**: General Store, Blacksmith, Cozy House (each with unique layouts)
- **Seamless Transitions**: Walkthrough exits between all connected areas

### 🌾 Advanced Farming System (COMPLETE)
- **Multi-Stage Crops**: Parsnips (1 watering), Potatoes (3 waterings) with visual growth
- **Individual Seed Tools**: Each seed type is its own selectable toolbar tool
- **Progressive Watering**: Crops advance stages only when watering requirements met
- **Economic Balance**: Higher difficulty crops yield better profits (50 vs 80 coins)
- **Dynamic Pricing**: Strategic crop selection based on effort vs reward

### 💾 Save System (COMPLETE)
- **Bed Interaction**: Walk onto bed to trigger save prompt
- **Day Advancement**: Sleeping increments day counter and resets time to 6:00 AM
- **State Persistence**: Complete game state saved to localStorage
- **Scene Recovery**: Exterior world properly backed up during house visits
- **Auto-Load**: Saved games automatically restore on page refresh

### 🏃‍♂️ Movement & Physics (COMPLETE)
- **Smooth Pixel Movement**: 60 FPS movement with grid-to-pixel transitions
- **Dynamic Collision**: Collision detection adapts to different world sizes
- **Scene-Aware Navigation**: Movement constraints adjust per scene
- **Player Facing**: Character orientation affects action targeting
- **Camera Following**: Smooth camera tracking with boundary clamping

### 🎮 UI & Controls (COMPLETE)
- **Dynamic Toolbar**: 10-slot expandable toolbar (keys 1-0) with count badges
- **Tool Management**: Base tools + inventory items automatically populate slots
- **Visual States**: Disabled tools, selection highlights, count indicators
- **Time Display**: Game clock with day counter in top-right corner
- **Debug Mode**: F3 toggle for terrain type visualization and collision boundaries

### 👥 NPC System (COMPLETE)
- **Smooth NPC Movement**: Pixel-perfect pathfinding along predefined routes
- **Interactive Dialogue**: Spacebar interactions with modal dialogue system
- **Scene-Aware**: NPCs exist in specific scenes with location-based dialogue
- **Pathfinding**: Mary NPC visits all town buildings with natural pauses
- **Atmospheric AI**: Meandering movement creates living world feeling

## Technical Architecture

### 📁 Cleaned & Refactored Codebase
- **Modular World Generation**: Large functions broken into focused helpers
- **Organized File Structure**: Clear separation of concerns across lib files
- **Helper Functions**: `worldHelpers.ts` contains reusable world generation utilities
- **Type Safety**: Comprehensive TypeScript interfaces for all game systems
- **Performance Optimized**: Efficient collision detection and render culling

### 🗂️ File Organization
```
/lib/
  constants.ts     - Game configuration and balance constants
  types.ts         - TypeScript interfaces for all game systems
  world.ts         - Main world generation with modular approach
  worldHelpers.ts  - Reusable world generation utilities
  gameLogic.ts     - Core game mechanics and action handling
  collision.ts     - Collision detection with dynamic world sizing
  seeds.ts         - Seed configuration and crop display logic
  toolbar.ts       - Dynamic toolbar generation system
  npcs.ts          - NPC behavior and dialogue management
  saveSystem.ts    - Complete save/load functionality
  horror.ts        - Horror event system (foundation)

/hooks/
  useGameLoop.ts   - Main game loops (movement, NPCs, crops, stamina)
  useInput.ts      - Keyboard input handling with dynamic tool selection
  useGameTime.ts   - Game clock progression system

/components/
  GameWorld.tsx    - World rendering with scene management
  GameUI.tsx       - UI overlay with toolbar and debug info
  StaminaBar.tsx   - Stamina visualization with color coding
  SaveDialog.tsx   - Sleep/save interaction modal
  HorrorOverlay.tsx - Horror event visual effects
```

### 📚 Documentation System
- **`docs/WORLD_SYSTEM.md`**: Complete world generation documentation
- **`docs/FARMING_SYSTEM.md`**: Farming mechanics and crop system guide
- **`docs/STAMINA_SYSTEM.md`**: Stamina management and balance documentation
- **Code Comments**: Comprehensive inline documentation for complex systems

## Current Scene Layout

### 🚜 Exterior Farm
- **40x30 world** with perimeter forest atmosphere
- **⚔️ Arena Exit** (left): 3-tile opening to combat arena
- **🌆 Town Exit** (right): 3-tile opening to town square  
- **12x12 Farm Area**: Central farmable land with brown path connections
- **Player House**: 3x4 structure with spacebar door interaction
- **Decorative Elements**: Water feature, scattered trees, protective fencing

### ⚔️ Arena (NEW!)
- **20x15 combat space** with stone floor and perimeter walls
- **Corner Braziers**: Atmospheric torch decorations using forge emojis
- **🚜 Return Exit** (right): 3-tile return to exterior farm
- **Combat Ready**: Designed for future combat system implementation

### 🏘️ Town Square  
- **30x25 central hub** with cobblestone paths and fountain centerpiece
- **General Store**: Shopping interface with shelves and counter
- **Blacksmith**: Forge interaction and anvil for crafting
- **Cozy House**: Mary's home with kitchen and living areas
- **🚜 Farm Exit** (left): Return path to exterior farm

### 🏠 House Interior
- **12x8 personal space** with furniture and bed interaction
- **🛏️ Sleep System**: Walk onto bed to trigger save/day advancement
- **Storage & Decor**: Table, chest, and homey atmosphere
- **🚪 Exit Door**: Spacebar interaction to return to exterior

## Ready for Combat Implementation

### ✅ Prerequisites Complete
- **Arena Scene**: Dedicated combat space with appropriate atmosphere
- **Scene Transitions**: Seamless arena access via left-side farm exit
- **Stamina System**: Energy management perfect for combat costs
- **Physics System**: Item drops ready for loot/reward mechanics
- **UI Framework**: Toolbar system can accommodate combat tools/abilities
- **Save System**: Progress persistence supports combat consequences

### 🎯 Combat System Foundation
- **Scene Isolation**: Arena provides contained space for combat encounters
- **Resource Management**: Stamina system naturally limits combat activities
- **Reward Integration**: Physics-based drops work for combat loot
- **Tool Expansion**: Existing toolbar accommodates weapons/combat items
- **State Persistence**: Save system preserves combat-related progress

## Development Philosophy

### 🧹 Code Quality Focus
- **Modular Architecture**: Systems designed for easy expansion and testing
- **Type Safety**: Comprehensive TypeScript prevents runtime errors  
- **Performance Conscious**: Efficient algorithms and memory management
- **Documentation Driven**: Extensive docs support future development
- **Refactoring Priority**: Clean, maintainable code over quick implementations

### 🎮 Player Experience Design
- **Progressive Complexity**: Systems start simple, add depth gradually
- **Visual Clarity**: Clear feedback for all game states and interactions
- **Intuitive Controls**: Direct tool selection and natural navigation
- **Strategic Depth**: Meaningful choices in stamina, crops, and time management
- **Quality of Life**: Magnetic collection, auto-save prompts, smart UI

### 🔮 Horror Integration Readiness
- **Atmospheric Foundation**: Dark themes, isolated settings, mysterious elements
- **System Flexibility**: All core systems designed to support horror mechanics
- **Gradual Introduction**: Architecture supports subtle horror element integration
- **Player Psychology**: Stamina pressure and time management create natural tension

## Getting Started

```bash
npm install
npm run dev
```

**Controls:**
- **WASD/Arrow Keys**: Player movement
- **Spacebar**: Use selected tool / Interact with doors/NPCs  
- **1-0**: Select tools from toolbar
- **F3**: Toggle debug mode

**Game Flow:**
1. **Farm**: Plant seeds, water crops, harvest for coins
2. **Explore**: Visit town, talk to NPCs, discover new areas
3. **Manage**: Balance stamina between activities and time pressure
4. **Save**: Sleep in bed to save progress and advance to next day
5. **Combat**: Enter arena (left exit) when combat system is implemented

## Next: Combat System Implementation

The codebase is now clean, well-documented, and ready for combat system development. All foundational systems are complete and tested, providing a solid base for adding combat mechanics to the dedicated arena space.