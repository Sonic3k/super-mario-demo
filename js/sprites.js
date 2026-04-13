// ============================================
// Super Mario Demo - Sprite Rendering System
// ============================================
// All sprites drawn pixel-by-pixel for authentic NES look

class SpriteRenderer {
  constructor() {
    this.cache = new Map();
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d');
  }

  // Cache a sprite at given scale
  getCached(key, width, height, drawFn) {
    if (this.cache.has(key)) return this.cache.get(key);
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx);
    this.cache.set(key, canvas);
    return canvas;
  }

  // Draw a pixel grid (each cell = 1 pixel at base, scaled by SCALE)
  drawPixelGrid(ctx, grid, colorMap, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const colorKey = grid[y][x];
        if (colorKey === 0 || colorKey === ' ' || colorKey === '.') continue;
        ctx.fillStyle = colorMap[colorKey];
        ctx.fillRect(offsetX + x, offsetY + y, 1, 1);
      }
    }
  }

  // ---- MARIO SPRITES ----
  
  drawMarioSmallStand(ctx, facing = 1) {
    // 12x16 pixel Mario standing
    const grid = [
      '...RRRRR...',
      '..RRRRRRR..',
      '..BBBSSBS..',
      '.BSBSSSBS..',
      '.BSBBSSSBBB',
      '..BSSSBBB..',
      '...SSSS....',
      '..RRBRRR...',
      '.RRRBRRRR..',
      'RRRRBBRRR..',
      'SSRBGBGRS..',
      'SSSBBBBSSS.',
      'SSBBBBBBSS.',
      '..BBB.BBB..',
      '.BBB...BBB.',
      'BBB.....BBB',
    ];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      'G': COLORS.GROUND_BROWN,
      '.': null,
    };
    
    if (facing === -1) {
      // Flip horizontally
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  drawMarioSmallWalk(ctx, frame, facing = 1) {
    const frames = [
      [ // Walk frame 1
        '...RRRRR...',
        '..RRRRRRR..',
        '..BBBSSBS..',
        '.BSBSSSBS..',
        '.BSBBSSSBBB',
        '..BSSSBBB..',
        '...RRRR....',
        '..RRRBRRR..',
        '.RRRRBRR...',
        '.RRRBBR....',
        '..SBBGB....',
        '..SBBBBS...',
        '..BBBBBBS..',
        '...BBB.BB..',
        '....BBB....',
        '....BBB....',
      ],
      [ // Walk frame 2
        '...RRRRR...',
        '..RRRRRRR..',
        '..BBBSSBS..',
        '.BSBSSSBS..',
        '.BSBBSSSBBB',
        '..BSSSBBB..',
        '...SSSS....',
        '..BBRBBR...',
        '.BRRRBRRR..',
        '.BRRRBBRR..',
        '.BBBBBB....',
        '...BBBBB...',
        '...BBBB....',
        '..BBB.B....',
        '..BBB......',
        '...BB......',
      ],
      [ // Walk frame 3
        '............',
        '...RRRRR...',
        '..RRRRRRR..',
        '..BBBSSBS..',
        '.BSBSSSBS..',
        '.BSBBSSSBBB',
        '..BSSSBBB..',
        '..RRRRRS...',
        '.RRRRRRSSS.',
        '.RRRRBBBBS.',
        '.RSSBRBBS..',
        '..SSBRRB...',
        '..BBBRBB...',
        '.BBB..BBB..',
        '.BBB.......',
        '............',
      ],
    ];
    
    const grid = frames[frame % 3];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      'G': COLORS.GROUND_BROWN,
      '.': null,
    };
    
    if (facing === -1) {
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  drawMarioSmallJump(ctx, facing = 1) {
    const grid = [
      '.....BBBBB.',
      '...RRRRRRB.',
      '..RRRRRRR..',
      '..BBBSSBS..',
      '.BSBSSSBS..',
      '.BSBBSSSBBB',
      '..BSSSBBB..',
      '..RRRRRR...',
      'RRRRRRBRRR.',
      'SSRRRBBRRRR',
      'SSSRBBGBRR.',
      '.SSBBBBBB..',
      '..BBBBBBB..',
      '..BBB..BBB.',
      '.BBB.......',
      '.BB........',
    ];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      'G': COLORS.GROUND_BROWN,
      '.': null,
    };
    
    if (facing === -1) {
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  drawMarioDead(ctx) {
    const grid = [
      '...RRRRR...',
      '..RRRRRRR..',
      '..BBBSSBS..',
      '.BSBSSSBS..',
      '.BSBBSSSBBB',
      '..BSSSBBB..',
      '...SSSS....',
      'S.RRRRRR.S.',
      'SSRRRRRRRSS',
      'SRRRRBBRRRS',
      '.SRRBBBRRS.',
      '..BBBBBB...',
      '..BBBBBB...',
      '.BBBBBBBB..',
      '.BBB..BBB..',
      'BBB....BBB.',
    ];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      'G': COLORS.GROUND_BROWN,
      '.': null,
    };
    this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
  }

  // Get cached Mario sprite
  getMarioSprite(state, animFrame, facing, marioState) {
    const key = `mario_${state}_${animFrame}_${facing}_${marioState}`;
    const s = CONFIG.TILE_SIZE;
    const w = 12;
    const h = 16;
    
    return this.getCached(key, w, h, (ctx) => {
      // For now, all states use small mario sprites
      // Big/Fire mario would need 12x32 sprites
      switch (state) {
        case 'stand':
          this.drawMarioSmallStand(ctx, facing);
          break;
        case 'walk':
          this.drawMarioSmallWalk(ctx, animFrame, facing);
          break;
        case 'jump':
          this.drawMarioSmallJump(ctx, facing);
          break;
        case 'dead':
          this.drawMarioDead(ctx);
          break;
        case 'skid':
          this.drawMarioSmallStand(ctx, -facing); // Face opposite direction when skidding
          break;
        default:
          this.drawMarioSmallStand(ctx, facing);
      }
    });
  }

  // ---- BIG MARIO SPRITES ----
  drawBigMarioStand(ctx, facing = 1) {
    const grid = [
      '....RRRRR.......',
      '...RRRRRRRRR....',
      '...BBBSSBSB.....',
      '..BSBSSSBSBB....',
      '..BSBBBSSSBBB...',
      '..BBSSSSBBB.....',
      '....SSSSSS......',
      '...RRBRRB.......',
      '..RRRBRRRBBB....',
      '..RRRBRRRBBB....',
      '..RRRBBBRRSBB...',
      '....BRBBRB......',
      '....BBBBBBB.....',
      '...BBRBBBRB.....',
      '..BBBRBBBRBB....',
      '..BBBR..RBBB....',
      '....RR..RR......',
      '...BBB..BBB.....',
      '...BBBB.BBBB....',
      '..BBBB..BBBB....',
    ];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      '.': null,
    };
    if (facing === -1) {
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  drawBigMarioWalk(ctx, frame, facing = 1) {
    // Simplified big mario walk - 3 frames
    const frames = [
      [
        '....RRRRR.......',
        '...RRRRRRRRR....',
        '...BBBSSBSB.....',
        '..BSBSSSBSBB....',
        '..BSBBBSSSBBB...',
        '..BBSSSSBBB.....',
        '....SSSSSS......',
        '...RRRRRRR......',
        '..RRRRRRRRRB....',
        '..RRRRRRBRRBB...',
        '..RRRBBBBRSBB...',
        '....BRBBRB......',
        '...BBBBBBB......',
        '...BBRRBBRB.....',
        '..BBBRRBBR......',
        '..BBR..RRR......',
        '....R..BBB......',
        '...BB.BBB.......',
        '...BBBBBB.......',
        '....BBB.........',
      ],
      [
        '....RRRRR.......',
        '...RRRRRRRRR....',
        '...BBBSSBSB.....',
        '..BSBSSSBSBB....',
        '..BSBBBSSSBBB...',
        '..BBSSSSBBB.....',
        '....SSSSSS......',
        '..RRRBRRRR......',
        '.RRRRBRRRR......',
        '.RRRRBBRRR......',
        '.RBBBBBRR.......',
        '...BBBBBBB......',
        '...BBBBBR.......',
        '..BBBRRBBR......',
        '..BBB.RBBR......',
        '......RBB.......',
        '.....BBB........',
        '.....BB.........',
        '.....BBB........',
        '................',
      ],
      [
        '................',
        '....RRRRR.......',
        '...RRRRRRRRR....',
        '...BBBSSBSB.....',
        '..BSBSSSBSBB....',
        '..BSBBBSSSBBB...',
        '..BBSSSSBBB.....',
        '....RRRRRRS.....',
        '..RRRRRRRRSSS...',
        '..RRRRRBBBBSS...',
        '..RRRSSBRBBS....',
        '....SSBRRBBB....',
        '...BBBBRRBBB....',
        '..BBBR..RBBB....',
        '..BBB....BBB....',
        '..BBB...........',
        '................',
        '................',
        '................',
        '................',
      ],
    ];
    const grid = frames[frame % 3];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      '.': null,
    };
    if (facing === -1) {
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  drawBigMarioJump(ctx, facing = 1) {
    const grid = [
      '.....BBBBB......',
      '...RRRRRRRB.....',
      '..RRRRRRRRR.....',
      '..BBBSSBSB......',
      '.BSBSSSBSBB.....',
      '.BSBBBSSSBBB....',
      '..BBSSSSBBB.....',
      '..RRRRRRRR......',
      'RRRRRRRBRRR.....',
      'SSRRRRBBRRRRR...',
      'SSSRRBBBBRRBB...',
      '.SSBBRBBRBBB....',
      '..BBBBBBBBB.....',
      '..BBBBBBB.......',
      '..BBB..BBBB.....',
      '.BBB....BBB.....',
      '.BBB............',
      '.BB.............',
      '................',
      '................',
    ];
    const colors = {
      'R': COLORS.MARIO_RED,
      'B': COLORS.MARIO_BROWN,
      'S': COLORS.MARIO_SKIN,
      '.': null,
    };
    if (facing === -1) {
      const flipped = grid.map(row => row.split('').reverse().join(''));
      this.drawPixelGrid(ctx, flipped.map(r => r.split('')), colors);
    } else {
      this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    }
  }

  getBigMarioSprite(state, animFrame, facing) {
    const key = `bigmario_${state}_${animFrame}_${facing}`;
    return this.getCached(key, 16, 20, (ctx) => {
      switch (state) {
        case 'stand':
          this.drawBigMarioStand(ctx, facing);
          break;
        case 'walk':
          this.drawBigMarioWalk(ctx, animFrame, facing);
          break;
        case 'jump':
          this.drawBigMarioJump(ctx, facing);
          break;
        case 'skid':
          this.drawBigMarioStand(ctx, -facing);
          break;
        default:
          this.drawBigMarioStand(ctx, facing);
      }
    });
  }

  // ---- TILE SPRITES ----

  drawGroundTile(ctx) {
    ctx.fillStyle = COLORS.GROUND_BROWN;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = COLORS.GROUND_DARK;
    ctx.fillRect(0, 0, 16, 1);
    ctx.fillRect(0, 0, 1, 16);
    ctx.fillStyle = COLORS.GROUND_LIGHT;
    ctx.fillRect(1, 1, 6, 6);
    ctx.fillRect(9, 9, 6, 6);
    ctx.fillStyle = COLORS.GROUND_DARK;
    ctx.fillRect(1, 7, 7, 1);
    ctx.fillRect(7, 1, 1, 7);
    ctx.fillRect(9, 15, 7, 1);
    ctx.fillRect(15, 9, 1, 7);
  }

  drawBrickTile(ctx) {
    ctx.fillStyle = COLORS.BRICK_RED;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = COLORS.BRICK_LINE;
    // Horizontal lines
    ctx.fillRect(0, 3, 16, 1);
    ctx.fillRect(0, 7, 16, 1);
    ctx.fillRect(0, 11, 16, 1);
    ctx.fillRect(0, 15, 16, 1);
    // Vertical lines (offset per row)
    ctx.fillRect(7, 0, 1, 4);
    ctx.fillRect(3, 4, 1, 4);
    ctx.fillRect(11, 4, 1, 4);
    ctx.fillRect(7, 8, 1, 4);
    ctx.fillRect(3, 12, 1, 4);
    ctx.fillRect(11, 12, 1, 4);
    // Highlights
    ctx.fillStyle = COLORS.GROUND_LIGHT;
    ctx.fillRect(0, 0, 7, 1);
    ctx.fillRect(0, 0, 1, 3);
    ctx.fillRect(8, 4, 3, 1);
    ctx.fillRect(8, 4, 1, 3);
    ctx.fillRect(0, 8, 7, 1);
    ctx.fillRect(0, 8, 1, 3);
    ctx.fillRect(8, 12, 3, 1);
    ctx.fillRect(8, 12, 1, 3);
  }

  drawQuestionBlock(ctx, frame = 0) {
    const isEmpty = frame === -1;
    
    if (isEmpty) {
      ctx.fillStyle = COLORS.GROUND_BROWN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = COLORS.GROUND_DARK;
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillStyle = COLORS.GROUND_LIGHT;
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 0, 1, 16);
      return;
    }
    
    // Animated ? block
    ctx.fillStyle = COLORS.QUESTION_YELLOW;
    ctx.fillRect(0, 0, 16, 16);
    
    // Border
    ctx.fillStyle = COLORS.QUESTION_OUTLINE;
    ctx.fillRect(0, 0, 16, 1);
    ctx.fillRect(0, 15, 16, 1);
    ctx.fillRect(0, 0, 1, 16);
    ctx.fillRect(15, 0, 1, 16);
    
    // Shadow edges
    ctx.fillStyle = COLORS.QUESTION_DARK;
    ctx.fillRect(1, 14, 14, 1);
    ctx.fillRect(14, 1, 1, 14);
    
    // Highlight
    ctx.fillStyle = '#F8D878';
    ctx.fillRect(1, 1, 14, 1);
    ctx.fillRect(1, 1, 1, 14);
    
    // Question mark (animated shimmer based on frame)
    const shimmer = Math.floor(frame / CONFIG.ANIM.COIN_SPIN) % 4;
    ctx.fillStyle = COLORS.QUESTION_OUTLINE;
    
    if (shimmer < 3) {
      // Normal ?
      ctx.fillRect(5, 3, 6, 2);
      ctx.fillRect(9, 5, 3, 2);
      ctx.fillRect(7, 7, 3, 2);
      ctx.fillRect(7, 9, 2, 2);
      ctx.fillRect(7, 12, 2, 2);
    } else {
      // Shimmer frame - slightly shifted
      ctx.fillRect(6, 3, 5, 2);
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillRect(7, 7, 3, 2);
      ctx.fillRect(7, 9, 2, 2);
      ctx.fillRect(7, 12, 2, 2);
    }
  }

  drawPipe(ctx, part) {
    switch (part) {
      case 'tl':
        ctx.fillStyle = COLORS.PIPE_OUTLINE;
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = COLORS.PIPE_GREEN;
        ctx.fillRect(1, 0, 14, 16);
        ctx.fillStyle = COLORS.PIPE_LIGHT;
        ctx.fillRect(2, 0, 4, 16);
        ctx.fillStyle = COLORS.PIPE_DARK;
        ctx.fillRect(12, 0, 3, 16);
        break;
      case 'tr':
        ctx.fillStyle = COLORS.PIPE_OUTLINE;
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = COLORS.PIPE_GREEN;
        ctx.fillRect(1, 0, 14, 16);
        ctx.fillStyle = COLORS.PIPE_LIGHT;
        ctx.fillRect(1, 0, 3, 16);
        ctx.fillStyle = COLORS.PIPE_DARK;
        ctx.fillRect(11, 0, 4, 16);
        // Top lip
        ctx.fillStyle = COLORS.PIPE_OUTLINE;
        ctx.fillRect(15, 0, 1, 16);
        break;
      case 'bl':
        ctx.fillStyle = COLORS.PIPE_GREEN;
        ctx.fillRect(2, 0, 14, 16);
        ctx.fillStyle = COLORS.PIPE_OUTLINE;
        ctx.fillRect(2, 0, 1, 16);
        ctx.fillStyle = COLORS.PIPE_LIGHT;
        ctx.fillRect(4, 0, 3, 16);
        ctx.fillStyle = COLORS.PIPE_DARK;
        ctx.fillRect(13, 0, 2, 16);
        break;
      case 'br':
        ctx.fillStyle = COLORS.PIPE_GREEN;
        ctx.fillRect(0, 0, 14, 16);
        ctx.fillStyle = COLORS.PIPE_OUTLINE;
        ctx.fillRect(13, 0, 1, 16);
        ctx.fillStyle = COLORS.PIPE_LIGHT;
        ctx.fillRect(1, 0, 2, 16);
        ctx.fillStyle = COLORS.PIPE_DARK;
        ctx.fillRect(10, 0, 3, 16);
        break;
    }
  }

  // ---- ENEMY SPRITES ----

  drawGoomba(ctx, frame = 0) {
    const walkFrame = Math.floor(frame / CONFIG.ANIM.WALK_SPEED) % 2;
    
    const grid = [
      '......BBBB......',
      '....BBBBBBBB....',
      '...BBBBBBBBBB...',
      '..BBBBBBBBBBBB..',
      '..BBBWWBBWWBBB..',
      '..BBBWWBBWWBBB..',
      '.BBBBKWBBKWBBBB.',
      '.BBBBBBBBBBBBB..',
      '.BBBBBBBBBBBBB..',
      '..BBBLLLLLLBBB..',
      '..LLLLLLLLLLLL..',
      '...LLLLLLLLLL...',
      '..BBBBBBBBBBB...',
      '.BBBBBBBBBBBBB..',
      '.BBBBB....BBBBB.',
      'BBBBB......BBBBB',
    ];
    
    const colors = {
      'B': COLORS.GOOMBA_BROWN,
      'W': COLORS.GOOMBA_WHITE,
      'K': COLORS.GOOMBA_BLACK,
      'L': COLORS.GOOMBA_LIGHT,
      '.': null,
    };
    
    this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
    
    // Animate feet
    if (walkFrame === 1) {
      ctx.fillStyle = COLORS.GOOMBA_BROWN;
      ctx.fillRect(1, 14, 5, 2);
      ctx.fillRect(10, 14, 5, 2);
    }
  }

  drawGoombaFlat(ctx) {
    // Squished goomba
    ctx.fillStyle = COLORS.GOOMBA_BROWN;
    ctx.fillRect(0, 12, 16, 4);
    ctx.fillStyle = COLORS.GOOMBA_LIGHT;
    ctx.fillRect(2, 12, 12, 2);
    ctx.fillStyle = COLORS.GOOMBA_BLACK;
    ctx.fillRect(3, 13, 3, 1);
    ctx.fillRect(10, 13, 3, 1);
  }

  getGoombaSrite(frame, squished = false) {
    const key = squished ? 'goomba_flat' : `goomba_${Math.floor(frame / CONFIG.ANIM.WALK_SPEED) % 2}`;
    return this.getCached(key, 16, 16, (ctx) => {
      if (squished) {
        this.drawGoombaFlat(ctx);
      } else {
        this.drawGoomba(ctx, frame);
      }
    });
  }

  // ---- ITEMS ----

  drawCoin(ctx, frame = 0) {
    const phase = Math.floor(frame / CONFIG.ANIM.COIN_SPIN) % 4;
    const widths = [8, 6, 2, 6];
    const w = widths[phase];
    const x = (16 - w) / 2;
    
    ctx.fillStyle = COLORS.COIN_YELLOW;
    ctx.fillRect(x, 2, w, 12);
    ctx.fillStyle = COLORS.COIN_DARK;
    ctx.fillRect(x, 2, w, 1);
    ctx.fillRect(x, 13, w, 1);
    ctx.fillRect(x, 2, 1, 12);
    if (w > 2) {
      ctx.fillStyle = COLORS.COIN_LIGHT;
      ctx.fillRect(x + 1, 3, w - 2, 10);
      ctx.fillStyle = COLORS.COIN_YELLOW;
      ctx.fillRect(x + 2, 4, w - 3, 8);
    }
  }

  getCoinSprite(frame) {
    const key = `coin_${Math.floor(frame / CONFIG.ANIM.COIN_SPIN) % 4}`;
    return this.getCached(key, 16, 16, (ctx) => {
      this.drawCoin(ctx, frame);
    });
  }

  drawMushroom(ctx) {
    // Super mushroom
    const grid = [
      '....RRRRRR......',
      '..RRRRRRRRRR....',
      '.RRRRWWRRWWRR...',
      '.RRRWWWRRWWWRR..',
      'RRRRWWRRRRWWRRR.',
      'RRRRRRRRRRRRRRR.',
      'RRRRRRRRRRRRRRR.',
      '.RRRRRRRRRRRRRR.',
      '..RRRRRRRRRRRR..',
      '....SSSSSSSS....',
      '...SSSSSSSSSS...',
      '..SSBBSSSSBBSS..',
      '..SSBBSSSSBBSS..',
      '..SSSSSSSSSSSS..',
      '...SSSSSSSSSS...',
      '....SSSSSSSS....',
    ];
    const colors = {
      'R': COLORS.MUSHROOM_RED,
      'W': COLORS.MUSHROOM_WHITE,
      'S': COLORS.MUSHROOM_SKIN,
      'B': COLORS.GOOMBA_BLACK,
      '.': null,
    };
    this.drawPixelGrid(ctx, grid.map(r => r.split('')), colors);
  }

  getMushroomSprite() {
    return this.getCached('mushroom', 16, 16, (ctx) => {
      this.drawMushroom(ctx);
    });
  }

  // ---- SCENERY ----
  
  drawCloud(ctx, width) {
    // width in tiles (2 or 3)
    const tw = width * 16;
    ctx.fillStyle = COLORS.CLOUD_WHITE;
    // Top bumps
    ctx.beginPath();
    ctx.arc(tw * 0.3, 8, 7, 0, Math.PI * 2);
    ctx.arc(tw * 0.5, 5, 9, 0, Math.PI * 2);
    ctx.arc(tw * 0.7, 8, 7, 0, Math.PI * 2);
    ctx.fill();
    // Base
    ctx.fillRect(4, 8, tw - 8, 8);
    // Light outline
    ctx.fillStyle = COLORS.CLOUD_LIGHT;
    ctx.fillRect(4, 14, tw - 8, 2);
  }

  drawHill(ctx, width) {
    const tw = width * 16;
    const h = width * 12;
    ctx.fillStyle = COLORS.HILL_GREEN;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(tw / 2, 0);
    ctx.lineTo(tw, h);
    ctx.fill();
    // Spots
    ctx.fillStyle = COLORS.HILL_LIGHT;
    ctx.fillRect(tw / 2 - 2, h * 0.3, 4, 4);
    ctx.fillRect(tw / 2 - 8, h * 0.6, 3, 3);
    ctx.fillRect(tw / 2 + 5, h * 0.5, 3, 3);
  }

  drawBush(ctx, width) {
    const tw = width * 16;
    ctx.fillStyle = COLORS.BUSH_GREEN;
    ctx.beginPath();
    if (width >= 3) {
      ctx.arc(8, 10, 8, 0, Math.PI * 2);
      ctx.arc(tw / 2, 8, 10, 0, Math.PI * 2);
      ctx.arc(tw - 8, 10, 8, 0, Math.PI * 2);
    } else {
      ctx.arc(tw / 2, 8, tw / 2 - 2, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillRect(2, 10, tw - 4, 6);
    
    ctx.fillStyle = COLORS.BUSH_LIGHT;
    ctx.fillRect(tw / 2 - 2, 4, 4, 3);
  }

  // ---- FLAG ----
  drawFlagPole(ctx) {
    ctx.fillStyle = COLORS.FLAG_POLE;
    ctx.fillRect(7, 0, 2, 16);
  }

  drawFlagTop(ctx) {
    ctx.fillStyle = COLORS.FLAG_POLE;
    ctx.fillRect(7, 2, 2, 14);
    // Ball on top
    ctx.fillStyle = COLORS.FLAG_BALL;
    ctx.fillRect(6, 0, 4, 4);
  }

  drawFlag(ctx) {
    ctx.fillStyle = COLORS.FLAG_GREEN;
    ctx.fillRect(0, 0, 12, 10);
    // Triangle cut
    ctx.fillStyle = COLORS.FLAG_GREEN;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(12, 10);
    ctx.lineTo(0, 5);
    ctx.fill();
  }

  // ---- CASTLE ----
  drawCastleBlock(ctx) {
    ctx.fillStyle = COLORS.CASTLE_GRAY;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = COLORS.CASTLE_DARK;
    ctx.fillRect(0, 0, 16, 1);
    ctx.fillRect(0, 0, 1, 16);
    ctx.fillRect(7, 0, 1, 16);
    ctx.fillRect(0, 7, 16, 1);
    ctx.fillStyle = COLORS.CASTLE_LIGHT;
    ctx.fillRect(1, 1, 6, 6);
  }

  // ---- GET TILE SPRITE ----
  getTileSprite(tileType, frame = 0) {
    const key = `tile_${tileType}_${tileType === TILES.QUESTION ? Math.floor(frame / CONFIG.ANIM.COIN_SPIN) % 4 : 0}`;
    return this.getCached(key, 16, 16, (ctx) => {
      switch (tileType) {
        case TILES.GROUND:
          this.drawGroundTile(ctx);
          break;
        case TILES.BRICK:
          this.drawBrickTile(ctx);
          break;
        case TILES.QUESTION:
          this.drawQuestionBlock(ctx, frame);
          break;
        case TILES.QUESTION_EMPTY:
          this.drawQuestionBlock(ctx, -1);
          break;
        case TILES.PIPE_TL:
          this.drawPipe(ctx, 'tl');
          break;
        case TILES.PIPE_TR:
          this.drawPipe(ctx, 'tr');
          break;
        case TILES.PIPE_BL:
          this.drawPipe(ctx, 'bl');
          break;
        case TILES.PIPE_BR:
          this.drawPipe(ctx, 'br');
          break;
        case TILES.BLOCK:
          this.drawGroundTile(ctx);
          break;
        case TILES.FLAG_POLE:
          this.drawFlagPole(ctx);
          break;
        case TILES.FLAG_TOP:
          this.drawFlagTop(ctx);
          break;
        case TILES.CASTLE_BLOCK:
        case TILES.CASTLE_TOP:
        case TILES.CASTLE_DOOR:
        case TILES.CASTLE_WINDOW:
          this.drawCastleBlock(ctx);
          break;
        default:
          break;
      }
    });
  }
}
