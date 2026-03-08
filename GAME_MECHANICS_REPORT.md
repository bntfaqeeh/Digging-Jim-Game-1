# Digging Jim - Game Mechanics Report

## Executive Summary
Digging Jim is a 2D puzzle-platformer game built with HTML5, CSS, and JavaScript. The game features grid-based movement, physics simulation for falling objects, collectible items, and multiple levels with increasing difficulty. Players navigate through dirt-filled levels, collecting diamonds while avoiding hazards.

---

## Core Game Mechanics

### 1. Player Movement System
**Grid-Based Movement**
- Movement occurs on a 32x32 pixel grid (configurable to 50x50)
- Four-directional movement: Up, Down, Left, Right
- Keyboard controls: Arrow keys or WASD
- Movement duration: 80ms per tile for smooth animation
- Viewport follows player when they move beyond screen center

**Movement Rules**
- Player can move through background tiles freely
- Digging through dirt tiles converts them to background (100ms delay)
- Cannot move through solid blocks or walls
- Special tube mechanics for fast travel (see Tube System)

### 2. Entity System

**Entity Types**
1. **Player Character**
   - Animated sprite with directional facing (left/right)
   - Can dig through dirt
   - Collects diamonds
   - Dies on contact with falling rocks/bombs

2. **Rocks (Falling Entities)**
   - Subject to gravity physics
   - Fall when no support beneath
   - Can slide off other rocks/entities
   - Kill player if falling when contact occurs

3. **Diamonds (Collectible)**
   - Subject to gravity physics
   - Can be collected by player for points
   - Default value: 1 point per diamond
   - Fall and slide like rocks

4. **Bombs (Hazards)**
   - Subject to gravity physics
   - Instant death on contact
   - Explode in 3x3 area destroying nearby tiles and entities

**Entity Manager**
- Manages all entities in 2D array structure
- Updates falling physics every 2 frame intervals
- Handles collision detection
- Manages entity transfers between grid positions

### 3. Physics System

**Gravity Mechanics**
- Falling entities check for support every frame
- Entities fall if space below is empty (background tile)
- Falling state tracked to determine if entity is dangerous

**Sliding Physics**
When a falling entity is blocked:
1. Check right side: if clear space right AND below-right → slide right
2. Else check left side: if clear space left AND below-left → slide left
3. Sliding requires both horizontal and diagonal-down spaces to be clear
4. Player position also checked to prevent sliding onto player

**Fall Damage**
- Rocks/bombs only kill player if `isFalling` flag is true
- Contact with stationary rocks is safe
- Falling rocks that hit dirt make sound effect

### 4. Tile System

**Tile Types**
- **Background**: Empty space, freely traversable
- **Block/Wall**: Solid, impassable obstacles
- **Dirt**: Diggable terrain, removed when player moves through
- **Door**: Level exit, opens when player reaches it
- **Tubes (2 types)**:
  - Horizontal tubes (tubeLF): Fast travel left/right (2 tiles)
  - Vertical tubes (tubeUD): Fast travel up/down (2 tiles)

**Tube Mechanics**
- Player moves 2 tiles in one action through tubes
- Can collect diamonds at destination
- Dirt at destination is automatically cleared
- Bombs at destination trigger after tube travel
- Tube sound effect plays during travel

### 5. Level Design System

**Map Structure**
- 2D array representation
- Variable width and height per level
- 4 levels included in base game
- Each level is a JSON array of asset type codes

**Level Progression**
- Complete level by reaching door tile
- Score carries over between levels
- Lives persist across levels
- Completing all levels shows victory screen

### 6. Scoring System

**Points**
- Diamonds: 1 point each (configurable per diamond)
- Score accumulates across levels
- Score persists through deaths (until game over)

**High Score System**
- Scores saved to browser cookies
- Format: `sc-[PlayerName]` = score value
- Top 10 scores displayed on dashboard
- Scores sorted in descending order

### 7. Lives and Failure System

**Lives**
- Start with 3 lives
- Lose 1 life on death
- Game over when lives reach 0

**Death Conditions**
1. Falling rock/bomb hits player
2. Player moves into bomb
3. Player runs out of time
4. Player presses ESC key (quit)

**Death Animation**
- 3x3 explosion effect centered on player
- Clears all tiles and entities in explosion radius
- "Lose" image displayed
- 2-second delay before respawn/game over screen

### 8. Time System

**Timer Mechanics**
- 180 seconds (3 minutes) per level
- Countdown displayed in footer bar
- Timer pauses when game is paused
- Timer stops on level completion or death

**Visual Feedback**
- Normal: Dark gray background (>60s remaining)
- Warning: Orange background (31-60s remaining)
- Critical: Red background (≤30s remaining)
- Time out triggers automatic death

### 9. Game States

**State Management**
1. **Home Screen**: Menu with options (New Game, High Scores, About, Exit)
2. **Playing**: Active gameplay with entity updates
3. **Paused**: Game frozen, "Paused" overlay shown (P key)
4. **Level Complete**: "Continue" or "Close" options
5. **Life Lost**: "Restart" or "Close" options with score/lives display
6. **Game Over**: Final score display, restart or exit
7. **Victory**: All levels complete, final score saved

**Pause System**
- Toggle with P key
- Stops entity manager updates
- Stops timer countdown
- Displays "Paused" overlay
- Resume with P key again

### 10. Audio System

**Sound Effects**
- Player movement through dirt
- Diamond collection
- Rock falling and landing
- Bomb falling
- Tube travel
- Level win
- Death/lose
- Background music on home screen

**Audio Controls**
- Mute/unmute button (🔇/🔊)
- Background music loops at 30% volume
- Starts muted by default
- Sound effects play at default volume

---

## Technical Implementation

### Animation System
- CSS-based sprite animation
- Frame-by-frame movement with easing
- Separate X and Y axis animation tracking
- Callback system for movement completion
- Viewport scrolling synchronized with player movement

### Control System
- Event-driven keyboard input
- Key press state tracking
- Prevents default browser scrolling
- ESC key for emergency quit
- P key for pause toggle

### Rendering System
- DOM-based rendering (not Canvas)
- Dynamic image element creation/removal
- Z-index layering (tiles: 0, entities: 1, effects: 3)
- Grid-based positioning system
- Tile size: 32x32 or 50x50 pixels (configurable)

### Collision Detection
- Grid-based position checking
- Separate checks for tiles and entities
- Player position validation before movement
- Entity-to-entity collision detection
- Tile type validation for movement rules

---

## Game Balance

### Difficulty Progression
- 4 levels with increasing complexity
- More entities and tighter spaces in later levels
- Time limit remains constant (180s per level)
- Lives carry over between levels

### Risk/Reward
- Diamonds often placed near falling rocks
- Tubes provide shortcuts but can lead to danger
- Digging creates paths but may release falling entities
- Time pressure encourages faster, riskier play

---

## Player Strategies

### Optimal Play
1. Survey level before moving
2. Dig paths that avoid triggering rock falls
3. Use tubes for quick escapes
4. Collect diamonds only when safe
5. Watch for sliding rocks from above
6. Manage time efficiently

### Common Hazards
- Rocks sliding unexpectedly after digging
- Bombs hidden in dirt
- Time running out while collecting diamonds
- Getting trapped by falling entities
- Misjudging tube destinations

---

## Conclusion

Digging Jim features a well-balanced combination of puzzle-solving, timing-based challenges, and physics-based hazards. The grid-based movement system combined with real-time falling entity physics creates emergent gameplay where player actions have cascading consequences. The game rewards careful planning while maintaining pressure through the time limit and limited lives system.
