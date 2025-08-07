# Night Farming - Development Log

This document tracks the development progress of Night Farming, a browser-based farming simulation game inspired by Stardew Valley, built with Next.js, React, and TypeScript.

## Project Overview

Night Farming is a simple farming simulation prototype that serves as the foundation for a future horror-themed farming game. The current implementation focuses on core farming mechanics and smooth gameplay, with plans to gradually introduce horror elements over time.

## Current Features

### 🌍 Game World
- **30x20 tile world** with varied terrain types
- **House structure** with walls, floor, and door in the top-left area  
- **Water feature** (pond) on the right side of the map
- **Trees** scattered around the world edges for natural boundaries
- **10x10 farmable area** in the center (brown soil) where crops can be grown
- **Grass terrain** fills the remaining areas

### 🎮 Player System
- **Smooth pixel-based movement** at 60 FPS instead of grid snapping
- **WASD/Arrow key controls** with hold-to-move functionality
- **Directional facing system** - player remembers last movement direction
- **Collision detection** prevents walking through solid terrain (walls, water, trees)
- **Responsive movement** with proper animation states

### 📷 Camera System
- **Dynamic camera following** that smoothly tracks the player
- **Boundary-aware camera** that stops at world edges to prevent showing empty space
- **Full-screen rendering** that adapts to any browser window size
- **Optimized tile rendering** - only renders visible tiles plus buffer for performance

### 🚜 Farming Mechanics
- **4 tools**: Hoe (🔨), Seeds (🌱), Watering Can (💧), Harvest Hand (✋)
- **Complete farming cycle**: Till soil → Plant seeds → Water crops → Harvest
- **Target-ahead action system** - tools affect the tile in front of the player
- **Crop growth system** - parsnips grow automatically every 3 seconds when watered
- **4-stage crop progression**: Seedling → Young Plant → Mature → Harvestable
- **Farming restrictions** - can only farm in the designated brown soil area

### 💾 Game State Management
- **Inventory system** tracks seeds, harvested crops, and coins
- **Real-time crop growth** with automatic progression
- **Persistent tool selection** with keyboard shortcuts (1-4)
- **Economic system** - earn 50 coins per harvested crop

### 🎨 User Interface
- **Overlay-based UI** positioned on top of the game world
- **Inventory display** showing current resources
- **Tool selection panel** with visual feedback for active tool
- **Controls help panel** for easy reference
- **Semi-transparent panels** with backdrop blur for visual clarity

### 🔧 Debug System
- **F3 toggle** for debug mode
- **Visual collision boundaries** with color-coded overlays:
  - 🟥 Red: House walls
  - 🟦 Blue: Water areas  
  - 🟫 Brown: Trees
- **Real-time debug info** showing player position, facing direction, movement state
- **Terrain type display** for current player location
- **Grid and pixel coordinate tracking**

## Technical Implementation

### Architecture
- **Next.js 15.4.6** with React 19.1.0 and TypeScript 5
- **Tailwind CSS 4** for styling with utility classes
- **Custom game loop** running at 60 FPS using `setInterval`
- **State management** with React hooks (useState, useEffect, useCallback)

### Performance Optimizations
- **Viewport culling** - only renders visible world tiles
- **Dynamic tile calculation** based on screen size and camera position  
- **Optimized collision detection** with early bounds checking
- **Smooth camera interpolation** to reduce jarring movements
- **SSR-safe window access** for proper Next.js compatibility

### Key Systems

#### Movement System
- Pixel-based coordinates alongside grid coordinates for smooth movement
- Continuous movement while keys are held down
- Direction-based facing system for contextual actions
- Collision detection prevents movement into solid terrain

#### Collision Detection
- Grid-based solid terrain checking (walls, water, trees)
- Real-time collision validation before movement
- Safety fallback system to prevent players getting stuck in solid terrain
- Debug visualization for collision boundaries

#### Camera System  
- Smooth interpolated following of player movement
- Boundary clamping to prevent showing areas outside the game world
- Dynamic viewport sizing based on browser window dimensions
- Efficient tile culling for performance

#### World Generation
- Procedural placement of houses, water features, and trees
- Designated farming areas separate from decorative terrain
- Logical world layout with natural boundaries

## Development History

### Phase 1: Basic Setup
- Created Next.js project with TypeScript and Tailwind
- Implemented basic grid-based farming game with 10x10 farm
- Added player movement, tools, and crop growing mechanics

### Phase 2: Enhanced Movement
- Replaced grid-snapping with smooth pixel-based movement
- Added 60 FPS game loop for responsive controls
- Implemented facing direction tracking
- Created target-ahead action system

### Phase 3: World Expansion  
- Expanded from 10x10 farm to 30x20 world
- Added house, water features, and trees around the farm
- Implemented camera system with smooth following
- Made game fill entire browser viewport

### Phase 4: Collision & Polish
- Added comprehensive collision detection system
- Implemented debug visualization with F3 toggle
- Created overlay-based UI system
- Added real-time debug information panel

## Future Roadmap

### Immediate Improvements
- Add more crop types with different growth times
- Implement tool durability and upgrades  
- Add day/night cycle system
- Create save/load functionality

### Horror Elements (Future)
- Mysterious crop failures during certain nights
- Strange sounds and visual effects
- Unexplained changes to the farm layout
- Gradual introduction of supernatural elements

### Gameplay Expansion  
- Multiple farm areas to unlock
- NPC characters and dialogue system
- Seasonal weather effects
- Market system for selling crops

## Technical Notes

### Running the Project
```bash
npm run dev    # Development server
npm run build  # Production build  
npm run start  # Production server
npm run lint   # ESLint checking
```

### Key Files
- `pages/index.tsx` - Main game component with all systems
- `styles/globals.css` - Global styles and Tailwind imports
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

### Debug Controls
- **F3** - Toggle debug mode to show collision boundaries and player info
- **1-4** - Select farming tools
- **WASD/Arrows** - Move player
- **Space** - Use selected tool on tile in front of player

The game successfully demonstrates smooth 2D gameplay with proper collision detection, responsive controls, and a solid foundation for future expansion into horror elements.