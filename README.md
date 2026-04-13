# Super Mario Demo

A browser-based Super Mario Bros-style platformer game built with vanilla JavaScript and HTML5 Canvas.

## Play

Open `index.html` in a browser, or deploy as a static site.

## Controls

| Action | Keyboard | Alt |
|--------|----------|-----|
| Move   | Arrow Keys | A/D |
| Jump   | Space | Z |
| Run    | Shift | X |
| Pause  | ESC / P | - |
| Start  | Enter | - |

Mobile touch controls are shown automatically on touch devices.

## Features

- Pixel art sprites drawn programmatically (no external assets needed)
- NES-accurate physics: variable jump height, acceleration, friction, momentum
- World 1-1 inspired level with pipes, bricks, question blocks, enemies
- Goomba enemies with stomp mechanics
- Power-ups: Super Mushroom (grow big, break bricks)
- Coin collection from blocks and floating coins
- Procedural retro sound effects via Web Audio API
- Score system, timer, lives
- Flag pole finish with score calculation
- Camera system (NES-style forward-only scrolling)
- Block bump animations, brick break particles
- Responsive design with mobile touch controls

## Deploy on Railway

This is a static site - just serve the directory. No build step required.

1. Push to GitHub
2. Connect repo to Railway
3. Deploy as static site

## Tech Stack

- Pure JavaScript (ES6+) - no frameworks, no dependencies
- HTML5 Canvas for rendering
- Web Audio API for sound
- CSS3 for UI styling

## Project Structure

```
├── index.html          # Entry point
├── css/
│   └── style.css       # UI styling
├── js/
│   ├── config.js       # Constants & configuration
│   ├── sprites.js      # Pixel art sprite system
│   ├── input.js        # Keyboard/touch input
│   ├── physics.js      # Physics & collision engine
│   ├── entities.js     # Mario, enemies, items
│   ├── level.js        # Level data & rendering
│   ├── camera.js       # Camera system
│   ├── ui.js           # HUD & menus
│   ├── sound.js        # Procedural sound effects
│   └── game.js         # Main game loop
└── README.md
```
