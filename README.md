On-Set Game

Local cross-platform web prototype using Phaser 3 and Vite.

Features

- Top-down movement in a single film-set level
- NPCs with roles and dialog
- Placeholder set props
- Main character sprite animation (idle/run)

Setup

1. Install dependencies: npm install
2. Start dev server: npm run dev
3. Build: npm run build

Controls

- Move: WASD or Arrow keys
- Talk: Space when near an NPC

Notes

- Sprites are loaded from public/character (copied from the png folder).
- Collision map uses public/background/filmset-collision.png (opaque pixels are solid).
- Vite recommends Node 20.19+ or 22.12+.
