# 🌾 Night Farming

A browser-based farming simulation game with a mysterious twist, built with Next.js, React, TypeScript, and Tailwind CSS.

![Night Farming Screenshot](https://img.shields.io/badge/Status-Ready_for_Combat-green) ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎮 Game Features

### 🚜 Advanced Farming System
- **Multiple Crop Types**: Parsnips (easy) and Potatoes (challenging) with unique watering requirements
- **Progressive Growth**: Crops advance through visual growth stages when properly watered
- **Economic Strategy**: Balance crop difficulty vs profit margins for optimal farming

### ⚡ Stamina Management
- **Daily Energy Resource**: 100 stamina depletes through actions and time passage
- **Strategic Planning**: Choose activities carefully as stamina limits daily actions
- **Sleep to Restore**: Only sleeping in your bed restores stamina and advances days

### 🌍 Multi-Scene World
- **Exterior Farm**: 40x30 main world with house, water features, and farming area
- **Town Square**: Visit NPCs, shop at the general store, explore the blacksmith
- **Combat Arena**: Dedicated arena space for future combat encounters
- **House Interior**: Your personal space with bed for saving and furniture

### 🎒 Physics-Based Items
- **Realistic Item Drops**: Harvested crops and chopped wood "pop out" with physics
- **Magnetic Collection**: Items attract to player when nearby with pickup delays
- **Dynamic Inventory**: 10-slot toolbar expands with collected items

### 💾 Save System
- **Sleep to Save**: Walk onto your bed to save progress and advance to the next day
- **Persistent State**: Game state preserved in browser storage
- **Day Progression**: Time resets to 6:00 AM each morning with full stamina

## 🕹️ Controls

| Control | Action |
|---------|--------|
| **WASD / Arrow Keys** | Move player |
| **Spacebar** | Use selected tool / Interact |
| **1-9, 0** | Select toolbar tools |
| **F3** | Toggle debug mode |

## 🏗️ Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and localStorage
- **Animation**: Custom game loops at 60 FPS

## 📁 Project Structure

```
├── components/          # React components
│   ├── GameWorld.tsx   # Main game rendering
│   ├── GameUI.tsx      # User interface overlay
│   └── StaminaBar.tsx  # Stamina visualization
├── hooks/              # Custom React hooks
│   ├── useGameLoop.ts  # Core game loops
│   ├── useInput.ts     # Input handling
│   └── useGameTime.ts  # Time management
├── lib/                # Game logic and utilities
│   ├── world.ts        # World generation
│   ├── gameLogic.ts    # Core game mechanics
│   ├── types.ts        # TypeScript interfaces
│   └── constants.ts    # Game configuration
├── docs/               # Detailed documentation
│   ├── WORLD_SYSTEM.md # World generation guide
│   ├── FARMING_SYSTEM.md # Farming mechanics
│   └── STAMINA_SYSTEM.md # Stamina management
└── pages/              # Next.js pages
    └── index.tsx       # Main game page
```

## 🎯 Gameplay Guide

### Getting Started
1. **Learn Farming**: Start with parsnips (easy 1-watering crop)
2. **Manage Stamina**: Watch your energy bar and plan activities
3. **Explore World**: Use exits to visit town and discover new areas
4. **Save Progress**: Sleep in your bed when ready to advance days

### Farming Tips
- **Parsnips**: Beginner-friendly, only need 1 watering, sell for 50 coins
- **Potatoes**: Advanced crop, need 3 waterings, sell for 80 coins  
- **Growth Stages**: Crops show visual progress, only advance when fully watered
- **Tool Selection**: Each seed type has its own toolbar tool

### Stamina Strategy
- **Action Costs**: Most farming activities cost 1 stamina, tree chopping costs 3
- **Time Pressure**: Stamina slowly decreases over time (0.1 per 5 seconds)
- **Daily Planning**: ~70-80 farming actions possible per day
- **Rest Timing**: Sleep strategically to maximize daily productivity

## 🔧 Development Features

### Debug Mode (F3)
- View terrain types for each tile
- See collision boundaries and invalid areas
- Monitor crop watering progress
- Display player coordinates and game state

### Performance
- **Viewport Culling**: Only renders visible game tiles
- **Optimized Collision**: Dynamic collision detection based on actual world size
- **Efficient State**: Minimal re-renders with proper React optimization

## 📚 Documentation

Detailed system documentation available in the `/docs` folder:

- **[World System](docs/WORLD_SYSTEM.md)**: World generation, scenes, and navigation
- **[Farming System](docs/FARMING_SYSTEM.md)**: Crops, growth mechanics, and economics  
- **[Stamina System](docs/STAMINA_SYSTEM.md)**: Energy management and daily planning

## 🛣️ Roadmap

### ✅ Completed Features
- Advanced farming system with multiple crop types
- Physics-based item collection with magnetic attraction
- Multi-scene world with seamless transitions  
- Stamina management with daily resource cycles
- Complete save/load system with day progression
- NPC interactions and dialogue system
- Combat arena preparation

### 🚧 Upcoming Features
- **Combat System**: Turn-based or real-time combat in the dedicated arena
- **Horror Elements**: Gradual introduction of mysterious and suspenseful elements
- **Advanced NPCs**: More characters with deeper storylines and quests
- **Crafting System**: Use collected resources to create tools and items
- **Weather System**: Dynamic weather affecting crop growth and gameplay

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! The codebase is designed with clean architecture and comprehensive documentation to support future development.

## 📄 License

This project is for educational and entertainment purposes. Feel free to learn from the code and techniques used.

---

**Happy Farming! 🌱**

*Watch out for things that go bump in the night...* 👻