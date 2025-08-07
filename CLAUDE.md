# Night Farming - Game Development Progress

## Project Overview

Night Farming is a browser-based farming simulation game inspired by Stardew Valley, built with Next.js, React, TypeScript, and Tailwind CSS. The game features a top-down farming experience with smooth movement, collision detection, and a planned gradual introduction of horror elements.

## Current Features

### Core Game Mechanics

- **Advanced Farming System**: Multiple seed types with unique watering requirements and growth patterns
- **Individual Seed Tools**: Each seed type functions as its own selectable tool
- **Progressive Watering**: Different crops require different amounts of water to grow
- **Dynamic Pricing**: Crops sell for different amounts based on their difficulty to grow
- **Time Management**: Game clock system affecting crop growth timing

### Movement & Physics

- **Smooth Pixel Movement**: 60 FPS movement system that transitions smoothly between grid positions
- **Collision Detection**: Impassable terrain (water, walls, trees, doors) with debug visualization
- **Player Facing**: Character faces the direction of last movement for intuitive farming actions
- **Target-Ahead Actions**: Farming actions target the tile in front of the player based on facing direction

### World & Camera

- **Enclosed Farm Settlement**: 40x30 tile world completely surrounded by protective fencing (🔸)
- **Forest Atmosphere**: Dense trees just inside the perimeter create a wilderness feeling
- **Compact Farm Area**: 12x12 farmable area for focused, manageable cultivation
- **Repositioned Water Feature**: Water (💧) moved to bottom-right corner for better layout balance
- **Guided Pathways**: Brown dirt paths (🟫) connect key areas for natural navigation
  - **House → Farm**: Direct path from front door to farm center
  - **Farm → Town**: Horizontal path leading to the fence opening
- **Fence Opening Exit**: Natural gap in right-side fencing leads to town (no walls needed)
- **Camera System**: Follows player smoothly, clamped to world boundaries
- **Viewport Culling**: Only renders visible tiles for performance
- **Scene Transitions**: Seamless movement between exterior farm and interior house

### Advanced Crop System

#### Multiple Seed Types

- **🥕 Parsnip Seeds**:
  - Easy beginner crop requiring only 1 watering total
  - 3 growth stages: 🌱 → 🌿 → 🌾 → 🥕
  - Sells for 50 coins
  - Grows quickly with minimal care

- **🥔 Potato Seeds**:
  - Advanced crop requiring 3 waterings total
  - 4 growth stages: 🌱 → 🌿 → 🟫 → 🔸 → 🥔
  - Sells for 80 coins (higher reward for difficulty)
  - Requires careful water management

#### Sophisticated Watering Mechanics

- **Watering Tracking**: Each crop individually tracks waterings received vs required
- **Stage-Based Requirements**: Crops must be fully watered before advancing to next growth stage
- **Visual Feedback**: Partially watered crops show 💧 indicator
- **Reset System**: Watering counters reset after each growth stage advance
- **Progressive Growth**: Only fully watered crops can advance stages over time

### UI & Interface Evolution

#### Dynamic Toolbar System

- **Individual Seed Tools**: Each seed type appears as its own tool slot
- **Smart Tool Generation**: Toolbar dynamically generates based on current inventory
- **Automatic Key Mapping**: Number keys (1-5+) automatically map to available tools
- **Visual States**: Tools show count badges, disable when empty, highlight when selected
- **Extensible Design**: Easy to add new tools/seeds that automatically get toolbar slots

#### Enhanced UI Layout

- **Bottom-Center Toolbar**: Large, prominent tool selection with enhanced styling
- **Top-Right Time Panel**: Game clock (6:00 AM start) with coins display
- **Tool Organization**: Base tools first (Hoe, Water, Harvest), then available seeds
- **Count Badges**: Seed tools show remaining quantity with stylized counters
- **Disabled States**: Empty seed tools gray out and become unclickable

### Scene System & NPCs

- **Multi-Scene World**: Three connected areas - farm exterior, house interior, and town square
- **Walkthrough Transitions**: Automatic scene changes by walking through exit tiles (no spacebar needed)
- **Town Square**: 30x25 town area with buildings, fountain, and cobblestone paths
- **Improved Exit System**: Simple, intuitive entrance points
  - **Farm → Town**: 3-tile fence opening on right edge (🌆 tiles) - walk through the gap
  - **Town → Farm**: 3-tile exit on far left edge (🚜 tiles) - maximum separation for clarity
- **Natural Pathways**: Brown paths lead directly to fence openings
- **House Interior**: Smaller interior space with furniture, centered with black void background
- **Door Interactions**: Use spacebar on doors to enter/exit house (house only)

#### NPC System

- **Smooth NPC Movement**: NPCs move with pixel-perfect movement similar to player
- **Meandering AI**: Mary follows town pathways, visiting each building with natural pauses
- **Building Visits**: Mary stops in front of each building (3+ second pauses) before continuing
- **Pathway Navigation**: NPCs use the brown pathway system to navigate naturally
- **Variable Movement**: Slower speed (1.5px/frame) creates relaxed, contemplative feel
- **Dialogue System**: Interactive conversations with spacebar activation
- **Mary Character**: Friendly town resident (👩‍🌾) with location-aware dialogue
- **Interaction Range**: Walk within 1.5 tiles of NPCs to interact
- **Modal Dialogue**: Full-screen dialogue boxes with NPC portraits and continue prompts

### Time Management

- **Game Clock**: Starts at 6:00 AM, advances 10 minutes every 5 seconds real-time
- **12-Hour Format**: Displays with AM/PM for natural time reading
- **Growth Timing**: Crops grow based on game time intervals (3 seconds per stage when watered)
- **Visual Integration**: Clock prominently displayed with enhanced padding

## Technical Architecture

### Enhanced File Structure

```
/lib/
  constants.ts    - Game configuration, base tools, timing constants
  types.ts        - Advanced TypeScript interfaces with seed/crop types
  world.ts        - World generation and house interior creation
  collision.ts    - Collision detection with door collision support
  gameLogic.ts    - Core farming mechanics with multi-seed support
  seeds.ts        - Seed configuration system and crop display logic
  toolbar.ts      - Dynamic toolbar generation system

/hooks/
  useGameLoop.ts  - Movement, camera, and advanced crop growth loops
  useInput.ts     - Dynamic keyboard input with toolbar-aware shortcuts
  useGameTime.ts  - Game clock system with 10-minute increments

/components/
  GameWorld.tsx   - World rendering with interior/exterior scene support
  GameUI.tsx      - Advanced UI with dynamic toolbar and time display

pages/index.tsx   - Main game orchestration with enhanced state management
```

### Advanced Systems

- **Dynamic Tool Management**: Tools auto-generate based on inventory state
- **Multi-Stage Crop Growth**: Complex watering requirements and growth validation
- **Scene Management**: Proper interior/exterior world state handling
- **Time Progression**: Integrated clock system affecting game mechanics

## Current Toolbar Layout (Dynamic)

1. 🔨 **Hoe** (Key: 1) - Till farmable soil
2. 💧 **Water** (Key: 2) - Water planted crops (progressive system)
3. ✋ **Harvest** (Key: 3) - Collect mature crops for coins
4. 🥕 **Parsnip Seeds** (Key: 4) - Plant easy-growing parsnips (5 starting)
5. 🥔 **Potato Seeds** (Key: 5) - Plant advanced potatoes (3 starting)

_Note: Toolbar automatically adjusts when seeds run out or new types are added_

## Recent Major Updates

### Individual Seed Tool System

Completely redesigned the planting system:

- **Removed Generic "Seeds" Tool**: No more universal planting tool
- **Individual Seed Selection**: Each seed type is now its own selectable tool
- **Direct Planting**: Select parsnip tool → plant parsnips, select potato tool → plant potatoes
- **Inventory-Based Availability**: Seeds only appear as tools when you have them
- **Future-Ready Architecture**: Built for planned user-customizable toolbar organization

### Advanced Watering Requirements

- **Parsnips**: Simple 1-watering system for beginners
- **Potatoes**: Complex 3-watering system requiring planning and resource management
- **Progressive Growth**: Crops won't advance until watering requirements are met
- **Visual Feedback**: Clear indicators for watering progress and completion

### Enhanced User Experience

- **Larger UI Elements**: More prominent toolbar and time display
- **Better Visual Hierarchy**: Clear separation between tools and inventory
- **Intuitive Controls**: Direct tool selection without multi-step processes
- **Professional Styling**: Enhanced borders, shadows, and hover effects

## Development Philosophy

### Code Quality & Architecture

- **TypeScript-First**: Comprehensive type safety prevents runtime errors
- **Modular Design**: Clean separation enables easy feature addition
- **Performance-Conscious**: Efficient rendering and state management
- **Extensible Foundation**: Built to support complex future features

### User Experience Focus

- **Intuitive Controls**: Direct tool selection mirrors professional game UX
- **Visual Clarity**: Clear feedback for all game states and interactions
- **Progressive Complexity**: Simple parsnips introduce farming, potatoes add depth
- **Responsive Design**: Toolbar and UI adapt to different screen sizes

### Future Roadmap Preparation

- **Horror Integration Ready**: Architecture supports gradual suspense introduction
- **Customizable Toolbar**: Foundation laid for drag-and-drop tool organization
- **Expandable Crop System**: Easy configuration for unlimited seed varieties
- **Advanced Mechanics**: Framework ready for seasons, weather, NPCs

## Technical Debt & Considerations

- **Performance**: Consider virtualization for very large farms
- **Save System**: Architecture ready for persistent game state
- **Mobile Adaptation**: Touch controls could be added to existing input system
- **Accessibility**: Consider adding screen reader support and keyboard navigation hints

## Getting Started

```bash
npm install
npm run dev
```

Game runs at `http://localhost:3000` with full-screen farming experience.

### Controls

- **WASD/Arrow Keys**: Move player
- **Spacebar**: Use selected tool or interact with doors
- **1-5**: Select tools (Hoe, Water, Harvest, Parsnip Seeds, Potato Seeds)
- **F3**: Toggle debug mode
- **Click**: Select tools from toolbar

### Gameplay Tips

- Start with parsnips (easy 1-watering system)
- Progress to potatoes for higher profits (3-watering requirement)
- Water crops multiple times before they'll grow to next stage
- Enter house via spacebar on front door
- Debug mode shows collision boundaries and watering progress
