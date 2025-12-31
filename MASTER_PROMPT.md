# The Master "Ashta Chamma" One-Shot Prompt

Copy and paste the text below into a new project to recreate this exact game with all its polish, bilingual rules, and YouTube Playables optimization.

---

### PROMPT START

Create a high-fidelity, polished version of the classic Indian board game **Ashta Chamma (అష్టా చమ్మా)** using **React, Vite, Tailwind CSS, and Framer Motion**. The game must be optimized for **YouTube Playables**, mobile-first (Portrait mode), and feature a "Royal Marble" aesthetic.

#### 1. Core Game Rules & Logic
- **Board**: A 5x5 grid with a specific path for each player starting from their outer-middle "Base".
- **Players**: Support for 2 and 4 players.
- **Roll**: Use 4 tamarind seeds (Kavidi) logic:
    - 0 faces up = 4 (Bonus Turn)
    - 1 face up = 1
    - 2 faces up = 2
    - 3 faces up = 3
    - 4 faces up = 8 (Bonus Turn)
- **Movement**: 
    - Players must roll a 4 or 8 to unlock a pawn from the base.
    - Pawns move in a clockwise loop on the outer ring, then enter the inner ring.
    - **Crucial**: A player **CANNOT** enter the inner ring (God's House) until they have "killed" (captured) at least one opponent's pawn.
- **Capturing**: Landing on the same square as an opponent (outside Safe Zones) sends them back to their base.
- **Safe Zones**: Mark cells with an "X" where no captures can occur.

#### 2. Visual Aesthetic ("Royal Marble" Theme)
- **Board**: Use a cream/marble texture (`#fdf5e6`) with a wooden frame border (`#8b4513`).
- **Cells**: Subtle inset shadows for a tiled look. Safe zones should have a distinct "X" and light pink/lavender tint.
- **Pawns**: High-quality PNG assets or stylized SVGs for Jade Green, Sapphire Blue, Amber Yellow, and Ruby Red.
- **Typography**: Use Telugu script for the main title ("అష్టా చమ్మా") with a smaller English subtitle ("Ashta Chamma").
- **Animations**: Use Framer Motion for pawn movement, dice rolling, and modal transitions. Add a "Screen Shake" effect on kills and win.

#### 3. UI/UX & Features
- **Responsive Layout**: Entire game must fit on one screen without scrolling on mobile.
- **Bilingual Rules**: A "How to Play" modal in both **Telugu** and **English**.
- **Move Highlighting**: When a dice is rolled, highlight the specific cells where the current player's pawns can move.
- **Sound System**: Include a `soundManager` for dice rolls, moves, captures, and victory.
- **Menu**: A clean landing page to select 2 or 4 players.
- **Debug Indicators**: Ensure the game state is robust and visible during play (current turn, rolls remaining).

#### 4. Technical Requirements & Deployment
- **YouTube Playables Prep**:
    - Ensure `index.html` has no external dependencies (bundle everything).
    - Add a `YOUTUBE_PLAYABLES_GUIDE.md` explaining how to upload the `dist` zip.
- **Code Structure**:
    - Modularize components: `GameBoard`, `Pawn`, `PlayerPanel`, `DiceControl`, `GameRules`.
    - Use a custom hook `useGameState` to manage complex game logic (turns, kills, pathing).
- **Developer Tools**:
    - Include a `.vscode/launch.json` for Chrome debugging with source maps.
    - Initialize a local git repository with a clean `.gitignore` (excluding node_modules and builds).

---

### PROMPT END
