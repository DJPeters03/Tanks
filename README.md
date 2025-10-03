🕹️ NewTankGame — 2D Tanks
A browser-based 2D tank battle game built with vanilla JavaScript and HTML5 Canvas.
Players face off against AI-controlled tanks, navigate obstacles, and survive across multiple levels with different difficulty curves.
📂 Project Structure
.
├── index.html         # Entry point, UI layout, and canvas
├── js/
│   ├── config.js      # Global configuration & game settings
│   ├── utils.js       # Utility functions (math, randomness, helpers)
│   ├── levels.js      # Level definitions and difficulty curves
│   ├── ai.js          # AI logic (enemy tank movement & behavior)
│   ├── main.js        # Game loop, rendering, and event handling
│   └── entities/      # Core game objects
│       ├── tank.js    # Player & enemy tank logic
│       ├── bullet.js  # Bullet projectile logic
│       └── ammo.js    # Ammo crate logic
🎮 Gameplay
Controls:
WASD → Move your tank
SPACE → Fire (requires ammo)
Objectives:
Destroy enemy tanks
Collect ammo crates to reload
Survive across 10 levels
Environment:
Barriers block shots, requiring strategy
Each level escalates difficulty
Difficulty Modes:
Standard → Balanced gameplay
Ammo-Scarce → Limited ammo drops, forces precision
Swarm → More aggressive enemies
🚀 Getting Started
Clone or download the repository.
Open index.html in any modern browser.
Use the sidebar to Start, Pause, or Reset the game.
No additional dependencies — the game runs entirely in the browser.
🧩 Features
AI-controlled tanks with pathfinding and shooting logic
Configurable levels with increasing difficulty
Dynamic scoring system (levels, lives, score, ammo tracking)
Canvas-based rendering with pixel-art style
Multiple difficulty curves selectable in-game
⚙️ Customization
Modify config.js to tweak global constants (speed, ammo, lives).
Add new levels or patterns in levels.js.
Extend tank.js to add new enemy types or player upgrades.
Adjust ai.js for smarter or harder opponents.
🧑‍💻 Skills Demonstrated
Game loop & rendering with Canvas API
Modular JavaScript design
AI behavior scripting
User input handling
Difficulty scaling and level design
