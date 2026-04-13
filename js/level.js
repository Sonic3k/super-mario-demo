// ============================================
// Super Mario Demo - Level System
// ============================================

class Level {
  constructor() {
    this.tiles = [];
    this.width = 0;
    this.height = 0;
    this.entities = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.flagX = 0;
    this.flagY = 0;
    this.scenery = []; // Background decorations
    this.blockContents = {}; // What's inside ? blocks: "tx,ty" -> "coin" | "mushroom"
    this.bumpedBlocks = {}; // Blocks currently animating bump
  }

  getTile(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return TILES.EMPTY;
    return this.tiles[ty][tx];
  }

  setTile(tx, ty, tile) {
    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
      this.tiles[ty][tx] = tile;
    }
  }

  // Bump animation for blocks
  bumpBlock(tx, ty) {
    const key = `${tx},${ty}`;
    this.bumpedBlocks[key] = { tx, ty, timer: CONFIG.ANIM.BLOCK_BUMP, offset: 0 };
  }

  updateBumps() {
    for (const key in this.bumpedBlocks) {
      const bump = this.bumpedBlocks[key];
      bump.timer--;
      // Sine-wave bump
      const progress = 1 - (bump.timer / CONFIG.ANIM.BLOCK_BUMP);
      bump.offset = -Math.sin(progress * Math.PI) * 6;
      if (bump.timer <= 0) {
        delete this.bumpedBlocks[key];
      }
    }
  }

  getBumpOffset(tx, ty) {
    const key = `${tx},${ty}`;
    return this.bumpedBlocks[key]?.offset || 0;
  }

  render(ctx, camera, sprites, frameCount) {
    const ts = CONFIG.TILE_SIZE;
    const scale = CONFIG.SCALE;
    const startTx = Math.max(0, Math.floor(camera.x / ts) - 1);
    const endTx = Math.min(this.width, Math.ceil((camera.x + CONFIG.CANVAS_WIDTH / scale) / ts) + 1);
    const startTy = Math.max(0, Math.floor(camera.y / ts) - 1);
    const endTy = Math.min(this.height, Math.ceil((camera.y + CONFIG.CANVAS_HEIGHT / scale) / ts) + 1);

    for (let ty = startTy; ty < endTy; ty++) {
      for (let tx = startTx; tx < endTx; tx++) {
        const tile = this.tiles[ty][tx];
        if (tile === TILES.EMPTY) continue;
        
        const bumpOff = this.getBumpOffset(tx, ty);
        const screenX = Math.round((tx * ts - camera.x) * scale);
        const screenY = Math.round((ty * ts - camera.y + bumpOff) * scale);
        
        const sprite = sprites.getTileSprite(tile, frameCount);
        if (sprite) {
          ctx.drawImage(sprite, screenX, screenY, ts * scale, ts * scale);
        }
      }
    }
  }

  renderScenery(ctx, camera, sprites) {
    const scale = CONFIG.SCALE;
    for (const item of this.scenery) {
      const screenX = Math.round((item.x - camera.x) * scale);
      const screenY = Math.round((item.y - camera.y) * scale);
      
      if (screenX > CONFIG.CANVAS_WIDTH + 100 || screenX < -200) continue;
      
      const cacheKey = `scenery_${item.type}_${item.width || 1}`;
      
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.scale(scale, scale);
      
      switch (item.type) {
        case 'cloud':
          sprites.drawCloud(ctx, item.width || 2);
          break;
        case 'hill':
          sprites.drawHill(ctx, item.width || 3);
          break;
        case 'bush':
          sprites.drawBush(ctx, item.width || 2);
          break;
      }
      
      ctx.restore();
    }
  }
}

// ---- LEVEL 1-1 DATA ----
function createLevel1() {
  const level = new Level();
  
  // Level dimensions: 210 tiles wide x 15 tiles tall
  level.width = 210;
  level.height = 15;
  level.spawnX = 3 * 16;
  level.spawnY = 11 * 16;

  // Initialize empty
  level.tiles = [];
  for (let y = 0; y < level.height; y++) {
    level.tiles[y] = new Array(level.width).fill(TILES.EMPTY);
  }

  // Helper: fill ground
  function ground(startX, endX, y = 13) {
    for (let x = startX; x <= endX; x++) {
      for (let row = y; row < level.height; row++) {
        level.tiles[row][x] = TILES.GROUND;
      }
    }
  }

  // Helper: place pipe
  function pipe(x, height) {
    const topY = 13 - height;
    level.tiles[topY][x] = TILES.PIPE_TL;
    level.tiles[topY][x + 1] = TILES.PIPE_TR;
    for (let y = topY + 1; y < 13; y++) {
      level.tiles[y][x] = TILES.PIPE_BL;
      level.tiles[y][x + 1] = TILES.PIPE_BR;
    }
  }

  // Helper: place question block
  function question(x, y, content = 'coin') {
    level.tiles[y][x] = TILES.QUESTION;
    level.blockContents[`${x},${y}`] = content;
  }

  // Helper: place brick
  function brick(x, y) {
    level.tiles[y][x] = TILES.BRICK;
  }

  // ====== BUILD LEVEL ======

  // Ground segments (with gaps for pits)
  ground(0, 68);
  ground(71, 86);    // After first pit
  ground(89, 152);   // After second pit  
  ground(155, 209);  // After third pit to end

  // -- Section 1: Start area --
  question(16, 9, 'coin');      // First ? block
  
  brick(20, 9);
  question(21, 9, 'mushroom');  // Mushroom block!
  brick(22, 9);
  question(22, 5, 'coin');      // High ? block
  brick(23, 9);

  // -- Section 2: Pipes --
  pipe(28, 2);
  pipe(38, 3);
  pipe(46, 4);
  pipe(57, 4);

  // -- Section 3: After first gap --
  // Gap at 69-70

  // Floating blocks & bricks
  question(78, 9, 'coin');
  
  // Brick row
  brick(80, 5);
  brick(81, 5);
  brick(82, 5);
  brick(83, 5);
  brick(84, 5);
  brick(85, 5);
  brick(86, 5);
  brick(87, 5);

  // Gap at 87-88

  // -- Section 4: Staircase patterns --
  // Steps up
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level.tiles[12 - j][91 + i] = TILES.BLOCK;
    }
  }
  
  // Steps down
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= (3 - i); j++) {
      level.tiles[12 - j][96 + i] = TILES.BLOCK;
    }
  }

  // More blocks
  question(106, 9, 'coin');
  question(109, 9, 'coin');
  question(109, 5, 'mushroom');
  question(112, 9, 'coin');

  brick(118, 9);
  brick(119, 5);
  brick(120, 5);
  brick(121, 5);

  // Brick row high
  brick(128, 5);
  brick(129, 5);
  brick(130, 5);
  question(131, 5, 'coin');
  
  brick(129, 9);
  brick(130, 9);
  question(130, 9, 'coin');
  brick(131, 9);
  
  // -- Section 5: More staircases --
  // Staircase up
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level.tiles[12 - j][134 + i] = TILES.BLOCK;
    }
  }
  // Small gap area
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= (3 - i); j++) {
      level.tiles[12 - j][140 + i] = TILES.BLOCK;
    }
  }

  // Gap at 153-154

  // -- Section 6: Final staircase to flag --
  // Big staircase
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j <= i; j++) {
      level.tiles[12 - j][160 + i] = TILES.BLOCK;
    }
  }

  // Flag pole at x=169
  level.flagX = 169;
  level.flagY = 3;
  level.tiles[3][169] = TILES.FLAG_TOP;
  for (let y = 4; y < 13; y++) {
    level.tiles[y][169] = TILES.FLAG_POLE;
  }

  // Castle at x=175
  for (let x = 175; x <= 180; x++) {
    for (let y = 8; y < 13; y++) {
      level.tiles[y][x] = TILES.CASTLE_BLOCK;
    }
  }
  // Castle top
  for (let x = 176; x <= 179; x++) {
    level.tiles[7][x] = TILES.CASTLE_TOP;
  }
  // Castle tower
  level.tiles[5][177] = TILES.CASTLE_BLOCK;
  level.tiles[5][178] = TILES.CASTLE_BLOCK;
  level.tiles[6][177] = TILES.CASTLE_BLOCK;
  level.tiles[6][178] = TILES.CASTLE_BLOCK;
  // Door
  level.tiles[11][177] = TILES.CASTLE_DOOR;
  level.tiles[11][178] = TILES.CASTLE_DOOR;
  level.tiles[12][177] = TILES.CASTLE_DOOR;
  level.tiles[12][178] = TILES.CASTLE_DOOR;

  // ====== ENTITIES ======
  level.entities = [];

  // Goombas
  const goombaPositions = [
    [22, 12], [40, 12], [51, 12], [52, 12],
    [80, 4], [82, 4],
    [97, 12], [98, 12],
    [107, 12], [111, 12],
    [114, 12], [115, 12],
    [124, 12], [125, 12],
    [128, 12],
    [145, 12], [146, 12],
  ];

  for (const [gx, gy] of goombaPositions) {
    level.entities.push(new Goomba(gx * 16 + 1, gy * 16 + 2));
  }

  // Static coins (floating)
  const coinPositions = [
    [73, 8], [74, 8], [75, 8],
    [100, 8], [101, 8],
  ];
  for (const [cx, cy] of coinPositions) {
    level.entities.push(new StaticCoin(cx * 16 + 3, cy * 16 + 1));
  }

  // ====== SCENERY ======
  level.scenery = [
    // Clouds
    { type: 'cloud', x: 8 * 16, y: 2 * 16, width: 2 },
    { type: 'cloud', x: 19 * 16, y: 1 * 16, width: 3 },
    { type: 'cloud', x: 36 * 16, y: 2 * 16, width: 2 },
    { type: 'cloud', x: 56 * 16, y: 1 * 16, width: 3 },
    { type: 'cloud', x: 67 * 16, y: 2 * 16, width: 2 },
    { type: 'cloud', x: 88 * 16, y: 1 * 16, width: 2 },
    { type: 'cloud', x: 108 * 16, y: 2 * 16, width: 3 },
    { type: 'cloud', x: 128 * 16, y: 1 * 16, width: 2 },
    { type: 'cloud', x: 148 * 16, y: 2 * 16, width: 3 },
    { type: 'cloud', x: 168 * 16, y: 1 * 16, width: 2 },
    
    // Hills
    { type: 'hill', x: 0, y: 10 * 16, width: 4 },
    { type: 'hill', x: 16 * 16, y: 11 * 16, width: 2 },
    { type: 'hill', x: 48 * 16, y: 10 * 16, width: 4 },
    { type: 'hill', x: 64 * 16, y: 11 * 16, width: 2 },
    { type: 'hill', x: 96 * 16, y: 10 * 16, width: 4 },
    { type: 'hill', x: 144 * 16, y: 10 * 16, width: 3 },
    
    // Bushes
    { type: 'bush', x: 11 * 16, y: 11.5 * 16, width: 3 },
    { type: 'bush', x: 23 * 16, y: 12 * 16, width: 2 },
    { type: 'bush', x: 41 * 16, y: 11.5 * 16, width: 3 },
    { type: 'bush', x: 59 * 16, y: 12 * 16, width: 2 },
    { type: 'bush', x: 71 * 16, y: 11.5 * 16, width: 3 },
    { type: 'bush', x: 103 * 16, y: 12 * 16, width: 2 },
    { type: 'bush', x: 135 * 16, y: 12 * 16, width: 2 },
  ];

  return level;
}
