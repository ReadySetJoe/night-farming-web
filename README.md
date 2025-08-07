# 🌙 Night Farming

A browser-based farming simulation game inspired by Stardew Valley, built with Next.js, React, and TypeScript. Night Farming serves as a prototype for a future horror-themed farming experience, but currently focuses on delivering smooth, engaging farming gameplay mechanics.

![Night Farming Screenshot](https://img.shields.io/badge/Status-Prototype-orange) ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎮 Game Features

### Core Gameplay

- **Smooth pixel-based movement** - No grid snapping, 60 FPS responsive controls
- **Complete farming cycle** - Till soil, plant seeds, water crops, harvest for profit
- **Target-ahead actions** - Tools affect the tile you're facing, not standing on
- **Real-time crop growth** - Watch your parsnips grow automatically when watered
- **Economic system** - Earn coins from harvested crops to buy more seeds

### World & Exploration

- **30x20 game world** with house, pond, trees, and farmable areas
- **Dynamic camera system** - Smoothly follows player with intelligent boundaries
- **Collision detection** - Can't walk through walls, water, or trees
- **Full-screen gameplay** - Adapts to any browser window size

### Tools & Inventory

- **4 farming tools**: Hoe, Seeds, Watering Can, Harvest Hand
- **Inventory management** - Track seeds, crops, and coins
- **Quick tool switching** - Use number keys 1-4 for instant tool selection

### Debug & Development

- **F3 debug mode** - Visual collision boundaries and real-time player data
- **Color-coded terrain** - Red walls, blue water, brown trees for easy identification
- **Performance optimized** - Efficient rendering and collision detection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation & Running

```bash
# Clone the repository
git clone <repository-url>
cd night-farming

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

### Build for Production

```bash
npm run build
npm run start
```

## 🎮 How to Play

### Controls

- **WASD** or **Arrow Keys** - Move your farmer around the world
- **Spacebar** - Use your selected tool on the tile in front of you
- **1-4** - Select tools (Hoe, Seeds, Watering Can, Harvest Hand)
- **F3** - Toggle debug mode to see collision boundaries

### Farming Process

1. **Till the soil** - Use the Hoe (1) on brown farmable dirt
2. **Plant seeds** - Use Seeds (2) on tilled soil
3. **Water crops** - Use Watering Can (3) on planted seeds
4. **Wait & watch** - Crops grow automatically every 3 seconds when watered
5. **Harvest** - Use Harvest Hand (4) on fully grown crops for 50 coins each

### World Layout

- **Brown soil area** - The only place you can farm (center of map)
- **House** - Explore the structure in the top-left (walls block movement)
- **Pond** - Water feature on the right side (can't walk on water)
- **Trees** - Scattered around edges (impassable natural boundaries)
- **Grass** - Open areas you can walk through freely

## 🛠️ Technical Details

### Built With

- **Next.js 15.4.6** - React framework with SSR support
- **React 19.1.0** - UI library with hooks-based state management
- **TypeScript 5** - Type safety and better development experience
- **Tailwind CSS 4** - Utility-first CSS framework for styling

### Architecture Highlights

- **60 FPS game loop** using `setInterval` for smooth movement
- **Pixel-perfect collision detection** with grid-based terrain checking
- **Dynamic viewport rendering** - only renders visible tiles for performance
- **SSR-compatible** - Proper handling of browser-only features like `window`
- **Modular game systems** - Separate concerns for movement, camera, collision, farming

### Performance Features

- **Viewport culling** - Only renders tiles visible on screen plus buffer
- **Optimized collision checking** - Early bounds checking and efficient grid lookups
- **Smooth camera interpolation** - Reduces jarring movements during gameplay
- **Dynamic tile calculation** - Adapts render area to any screen size

## 🗺️ Development Roadmap

### Immediate Features

- [ ] Multiple crop types with different growth rates
- [ ] Tool durability and upgrade system
- [ ] Day/night cycle with visual changes
- [ ] Save/load game functionality
- [ ] Sound effects and background music

### Future Horror Elements

The game is designed to gradually introduce horror elements:

- [ ] Mysterious crop failures during certain nights
- [ ] Strange sounds and visual anomalies
- [ ] Unexplained changes to farm layout
- [ ] Supernatural encounters that escalate over time

### Long-term Goals

- [ ] NPC characters and dialogue system
- [ ] Multiple farm areas to unlock and explore
- [ ] Seasonal weather and environmental effects
- [ ] Market system with fluctuating crop prices
- [ ] Multiplayer farming cooperation

## 📝 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Detailed development log and technical implementation notes
- **Game Design** - Core farming mechanics inspired by Stardew Valley
- **Code Structure** - Single-file React component with TypeScript interfaces

## 🤝 Contributing

This is currently a prototype project. Contributions, ideas, and feedback are welcome! Please feel free to:

- Report bugs or gameplay issues
- Suggest new features or improvements
- Submit pull requests with enhancements
- Share ideas for horror elements to add later

## 📄 License

This project is open source. Please check the license file for details.

---

**Night Farming** - Where peaceful farming meets the unknown. Start with simple crops, but stay alert... the night brings more than just darkness to your farm. 🌾🌙
