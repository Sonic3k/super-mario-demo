// ============================================
// Super Mario Demo - Sprite Generator
// ============================================
// Generates all pixel art textures procedurally for Phaser

class SpriteGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateAll() {
    this.generateTileset();
    this.generateMarioSmall();
    this.generateMarioBig();
    this.generateGoomba();
    this.generateCoin();
    this.generateMushroom();
    this.generateFlag();
  }

  // Utility: draw pixel grid onto a canvas context
  drawPixels(ctx, grid, colorMap, ox = 0, oy = 0) {
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const c = row[x];
        if (c === '.' || c === ' ') continue;
        const color = colorMap[c];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(ox + x, oy + y, 1, 1);
      }
    }
  }

  // ---- TILESET ----
  generateTileset() {
    // 16x16 tiles, 14 tiles in a row
    const tileCount = 14;
    const ts = 16;
    const canvas = document.createElement('canvas');
    canvas.width = ts * tileCount;
    canvas.height = ts;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 0: Ground
    this.drawGroundTile(ctx, 0, 0);
    // 1: Brick
    this.drawBrickTile(ctx, ts, 0);
    // 2: Question block
    this.drawQuestionBlock(ctx, ts * 2, 0);
    // 3: Empty question block
    this.drawEmptyBlock(ctx, ts * 3, 0);
    // 4: Solid block
    this.drawGroundTile(ctx, ts * 4, 0);
    // 5: Pipe top-left
    this.drawPipePart(ctx, ts * 5, 0, 'tl');
    // 6: Pipe top-right
    this.drawPipePart(ctx, ts * 6, 0, 'tr');
    // 7: Pipe body-left
    this.drawPipePart(ctx, ts * 7, 0, 'bl');
    // 8: Pipe body-right
    this.drawPipePart(ctx, ts * 8, 0, 'br');
    // 9: Flag pole
    this.drawFlagPole(ctx, ts * 9, 0);
    // 10: Flag top (ball)
    this.drawFlagTop(ctx, ts * 10, 0);
    // 11: Castle block
    this.drawCastleBlock(ctx, ts * 11, 0);
    // 12: Castle top
    this.drawCastleTop(ctx, ts * 12, 0);
    // 13: Castle door
    this.drawCastleDoor(ctx, ts * 13, 0);

    this.scene.textures.addCanvas('tileset', canvas);
  }

  drawGroundTile(ctx, x, y) {
    ctx.fillStyle = '#C84C0C';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#A03800';
    ctx.fillRect(x, y, 16, 1);
    ctx.fillRect(x, y, 1, 16);
    ctx.fillStyle = '#E8A060';
    ctx.fillRect(x + 1, y + 1, 6, 6);
    ctx.fillRect(x + 9, y + 9, 6, 6);
    ctx.fillStyle = '#A03800';
    ctx.fillRect(x + 1, y + 7, 7, 1);
    ctx.fillRect(x + 7, y + 1, 1, 7);
    ctx.fillRect(x + 9, y + 15, 7, 1);
    ctx.fillRect(x + 15, y + 9, 1, 7);
  }

  drawBrickTile(ctx, x, y) {
    ctx.fillStyle = '#C84C0C';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#6B3400';
    ctx.fillRect(x, y + 3, 16, 1);
    ctx.fillRect(x, y + 7, 16, 1);
    ctx.fillRect(x, y + 11, 16, 1);
    ctx.fillRect(x, y + 15, 16, 1);
    ctx.fillRect(x + 7, y, 1, 4);
    ctx.fillRect(x + 3, y + 4, 1, 4);
    ctx.fillRect(x + 11, y + 4, 1, 4);
    ctx.fillRect(x + 7, y + 8, 1, 4);
    ctx.fillRect(x + 3, y + 12, 1, 4);
    ctx.fillRect(x + 11, y + 12, 1, 4);
    ctx.fillStyle = '#E8A060';
    ctx.fillRect(x, y, 7, 1);
    ctx.fillRect(x, y, 1, 3);
    ctx.fillRect(x + 8, y + 4, 3, 1);
    ctx.fillRect(x + 8, y + 4, 1, 3);
    ctx.fillRect(x, y + 8, 7, 1);
    ctx.fillRect(x, y + 8, 1, 3);
    ctx.fillRect(x + 8, y + 12, 3, 1);
    ctx.fillRect(x + 8, y + 12, 1, 3);
  }

  drawQuestionBlock(ctx, x, y) {
    ctx.fillStyle = '#F8B800';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#6B3400';
    ctx.fillRect(x, y, 16, 1);
    ctx.fillRect(x, y + 15, 16, 1);
    ctx.fillRect(x, y, 1, 16);
    ctx.fillRect(x + 15, y, 1, 16);
    ctx.fillStyle = '#C88400';
    ctx.fillRect(x + 1, y + 14, 14, 1);
    ctx.fillRect(x + 14, y + 1, 1, 14);
    ctx.fillStyle = '#F8D878';
    ctx.fillRect(x + 1, y + 1, 14, 1);
    ctx.fillRect(x + 1, y + 1, 1, 14);
    // Question mark
    ctx.fillStyle = '#6B3400';
    ctx.fillRect(x + 5, y + 3, 6, 2);
    ctx.fillRect(x + 9, y + 5, 3, 2);
    ctx.fillRect(x + 7, y + 7, 3, 2);
    ctx.fillRect(x + 7, y + 9, 2, 2);
    ctx.fillRect(x + 7, y + 12, 2, 2);
  }

  drawEmptyBlock(ctx, x, y) {
    ctx.fillStyle = '#C84C0C';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#A03800';
    ctx.fillRect(x, y + 15, 16, 1);
    ctx.fillRect(x + 15, y, 1, 16);
    ctx.fillStyle = '#E8A060';
    ctx.fillRect(x, y, 16, 1);
    ctx.fillRect(x, y, 1, 16);
  }

  drawPipePart(ctx, x, y, part) {
    switch (part) {
      case 'tl':
        ctx.fillStyle = '#005000';
        ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = '#00A800';
        ctx.fillRect(x + 1, y, 14, 16);
        ctx.fillStyle = '#38E038';
        ctx.fillRect(x + 2, y, 4, 16);
        ctx.fillStyle = '#007800';
        ctx.fillRect(x + 12, y, 3, 16);
        break;
      case 'tr':
        ctx.fillStyle = '#005000';
        ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = '#00A800';
        ctx.fillRect(x + 1, y, 14, 16);
        ctx.fillStyle = '#38E038';
        ctx.fillRect(x + 1, y, 3, 16);
        ctx.fillStyle = '#007800';
        ctx.fillRect(x + 11, y, 4, 16);
        break;
      case 'bl':
        ctx.fillStyle = '#00A800';
        ctx.fillRect(x + 2, y, 14, 16);
        ctx.fillStyle = '#005000';
        ctx.fillRect(x + 2, y, 1, 16);
        ctx.fillStyle = '#38E038';
        ctx.fillRect(x + 4, y, 3, 16);
        ctx.fillStyle = '#007800';
        ctx.fillRect(x + 13, y, 2, 16);
        break;
      case 'br':
        ctx.fillStyle = '#00A800';
        ctx.fillRect(x, y, 14, 16);
        ctx.fillStyle = '#005000';
        ctx.fillRect(x + 13, y, 1, 16);
        ctx.fillStyle = '#38E038';
        ctx.fillRect(x + 1, y, 2, 16);
        ctx.fillStyle = '#007800';
        ctx.fillRect(x + 10, y, 3, 16);
        break;
    }
  }

  drawFlagPole(ctx, x, y) {
    ctx.fillStyle = '#888888';
    ctx.fillRect(x + 7, y, 2, 16);
  }

  drawFlagTop(ctx, x, y) {
    ctx.fillStyle = '#888888';
    ctx.fillRect(x + 7, y + 4, 2, 12);
    ctx.fillRect(x + 6, y, 4, 4);
  }

  drawCastleBlock(ctx, x, y) {
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#686868';
    ctx.fillRect(x, y, 16, 1);
    ctx.fillRect(x, y, 1, 16);
    ctx.fillRect(x + 7, y, 1, 16);
    ctx.fillRect(x, y + 7, 16, 1);
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(x + 1, y + 1, 6, 6);
  }

  drawCastleTop(ctx, x, y) {
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(x, y + 4, 16, 12);
    // Battlements
    ctx.fillRect(x, y, 4, 4);
    ctx.fillRect(x + 6, y, 4, 4);
    ctx.fillRect(x + 12, y, 4, 4);
    ctx.fillStyle = '#686868';
    ctx.fillRect(x, y + 4, 16, 1);
  }

  drawCastleDoor(ctx, x, y) {
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 3, y + 2, 10, 14);
    ctx.fillStyle = '#A0A0A0';
    // Arch top
    ctx.fillRect(x + 3, y + 2, 2, 2);
    ctx.fillRect(x + 11, y + 2, 2, 2);
  }

  // ---- MARIO SMALL (spritesheet: 4 frames, 16x16 each) ----
  generateMarioSmall() {
    const w = 16, h = 16, frames = 7; // stand, walk1, walk2, walk3, jump, skid, dead
    const canvas = document.createElement('canvas');
    canvas.width = w * frames;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const C = {
      'R': '#B81C1C', 'B': '#6B3400', 'S': '#F0A060',
      'G': '#C84C0C', '.': null,
    };

    // Frame 0: Stand
    const stand = [
      '....RRRRR...',
      '...RRRRRRR..',
      '...BBBSSBS..',
      '..BSBSSSBS..',
      '..BSBBSSSBBB',
      '...BSSSBBB..',
      '....SSSS....',
      '..RRBRRR....',
      '.RRRBRRRR...',
      'RRRRBBRRR...',
      'SSRBGBGRS...',
      'SSSBBBBSSS..',
      'SSBBBBBBSS..',
      '..BBB.BBB...',
      '.BBB...BBB..',
      'BBB.....BBB.',
    ];
    this.drawPixels(ctx, stand, C, 2, 0);

    // Frame 1-3: Walk
    const walk1 = [
      '....RRRRR...',
      '...RRRRRRR..',
      '...BBBSSBS..',
      '..BSBSSSBS..',
      '..BSBBSSSBBB',
      '...BSSSBBB..',
      '....RRRR....',
      '..RRRBRRR...',
      '.RRRRBRR....',
      '.RRRBBR.....',
      '..SBBGB.....',
      '..SBBBBS....',
      '..BBBBBBS...',
      '...BBB.BB...',
      '....BBB.....',
      '....BBB.....',
    ];
    this.drawPixels(ctx, walk1, C, w + 2, 0);

    const walk2 = [
      '....RRRRR...',
      '...RRRRRRR..',
      '...BBBSSBS..',
      '..BSBSSSBS..',
      '..BSBBSSSBBB',
      '...BSSSBBB..',
      '....SSSS....',
      '..BBRBBR....',
      '.BRRRBRRR...',
      '.BRRRBBRR...',
      '.BBBBBB.....',
      '...BBBBB....',
      '...BBBB.....',
      '..BBB.B.....',
      '..BBB.......',
      '...BB.......',
    ];
    this.drawPixels(ctx, walk2, C, w * 2 + 2, 0);

    const walk3 = [
      '............',
      '....RRRRR...',
      '...RRRRRRR..',
      '...BBBSSBS..',
      '..BSBSSSBS..',
      '..BSBBSSSBBB',
      '...BSSSBBB..',
      '..RRRRRS....',
      '.RRRRRRSSS..',
      '.RRRRBBBBS..',
      '.RSSBRBBS...',
      '..SSBRRB....',
      '..BBBRBB....',
      '.BBB..BBB...',
      '.BBB........',
      '............',
    ];
    this.drawPixels(ctx, walk3, C, w * 3 + 2, 0);

    // Frame 4: Jump
    const jump = [
      '.....BBBBB..',
      '...RRRRRRB..',
      '..RRRRRRR...',
      '..BBBSSBS...',
      '.BSBSSSBS...',
      '.BSBBSSSBBB.',
      '..BSSSBBB...',
      '..RRRRRR....',
      'RRRRRRBRRR..',
      'SSRRRBBRRRR.',
      'SSSRBBGBRR..',
      '.SSBBBBBB...',
      '..BBBBBBB...',
      '..BBB..BBB..',
      '.BBB........',
      '.BB.........',
    ];
    this.drawPixels(ctx, jump, C, w * 4 + 2, 0);

    // Frame 5: Skid (stand reversed - handled by flipX)
    this.drawPixels(ctx, stand, C, w * 5 + 2, 0);

    // Frame 6: Dead
    const dead = [
      '...RRRRR....',
      '..RRRRRRR...',
      '..BBBSSBS...',
      '.BSBSSSBS...',
      '.BSBBSSSBBB.',
      '..BSSSBBB...',
      '...SSSS.....',
      'S.RRRRRR.S..',
      'SSRRRRRRRSS.',
      'SRRRRBBRRRS.',
      '.SRRBBBRRS..',
      '..BBBBBB....',
      '..BBBBBB....',
      '.BBBBBBBB...',
      '.BBB..BBB...',
      'BBB....BBB..',
    ];
    this.drawPixels(ctx, dead, C, w * 6 + 2, 0);

    this.scene.textures.addSpriteSheet('mario-small', canvas, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  // ---- MARIO BIG (spritesheet: 16x32, multiple frames) ----
  generateMarioBig() {
    const w = 16, h = 32, frames = 5; // stand, walk1, walk2, walk3, jump
    const canvas = document.createElement('canvas');
    canvas.width = w * frames;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const C = {
      'R': '#B81C1C', 'B': '#6B3400', 'S': '#F0A060', '.': null,
    };

    // Big Mario Stand
    const bigStand = [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
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
    this.drawPixels(ctx, bigStand, C, 0, 0);

    // Big Mario Walk frames
    const bigWalk1 = [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
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
    ];
    this.drawPixels(ctx, bigWalk1, C, w, 0);

    const bigWalk2 = [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
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
    ];
    this.drawPixels(ctx, bigWalk2, C, w * 2, 0);

    const bigWalk3 = [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
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
    ];
    this.drawPixels(ctx, bigWalk3, C, w * 3, 0);

    // Big Mario Jump
    const bigJump = [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
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
      '................',
    ];
    this.drawPixels(ctx, bigJump, C, w * 4, 0);

    this.scene.textures.addSpriteSheet('mario-big', canvas, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  // ---- GOOMBA (2 walk frames + squished) ----
  generateGoomba() {
    const w = 16, h = 16, frames = 3;
    const canvas = document.createElement('canvas');
    canvas.width = w * frames;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const C = {
      'B': '#C88448', 'D': '#8C5C28', 'L': '#E8C498',
      'W': '#F8F8F8', 'K': '#000000', '.': null,
    };

    const goomba1 = [
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
      'DDDDD......DDDDD',
    ];
    this.drawPixels(ctx, goomba1, C, 0, 0);

    // Walk frame 2 (feet swapped)
    const goomba2 = [
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
      'DDDDD....DDDDD..',
      'DDDDD......DDDDD',
    ];
    this.drawPixels(ctx, goomba2, C, w, 0);

    // Squished
    ctx.fillStyle = '#C88448';
    ctx.fillRect(w * 2, 12, 16, 4);
    ctx.fillStyle = '#E8C498';
    ctx.fillRect(w * 2 + 2, 12, 12, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(w * 2 + 3, 13, 3, 1);
    ctx.fillRect(w * 2 + 10, 13, 3, 1);

    this.scene.textures.addSpriteSheet('goomba', canvas, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  // ---- COIN (4 spin frames) ----
  generateCoin() {
    const w = 16, h = 16, frames = 4;
    const canvas = document.createElement('canvas');
    canvas.width = w * frames;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const widths = [8, 6, 2, 6];
    for (let f = 0; f < frames; f++) {
      const cw = widths[f];
      const cx = w * f + (16 - cw) / 2;
      ctx.fillStyle = '#F8B800';
      ctx.fillRect(cx, 2, cw, 12);
      ctx.fillStyle = '#C88400';
      ctx.fillRect(cx, 2, cw, 1);
      ctx.fillRect(cx, 13, cw, 1);
      ctx.fillRect(cx, 2, 1, 12);
      if (cw > 2) {
        ctx.fillStyle = '#F8D878';
        ctx.fillRect(cx + 1, 3, cw - 2, 10);
        ctx.fillStyle = '#F8B800';
        ctx.fillRect(cx + 2, 4, Math.max(1, cw - 3), 8);
      }
    }

    this.scene.textures.addSpriteSheet('coin', canvas, {
      frameWidth: w,
      frameHeight: h,
    });
  }

  // ---- MUSHROOM ----
  generateMushroom() {
    const w = 16, h = 16;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const C = {
      'R': '#B81C1C', 'W': '#F8F8F8', 'S': '#F0A060',
      'K': '#000000', '.': null,
    };
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
      '..SSKKSSSSKKSS..',
      '..SSKKSSSSKKSS..',
      '..SSSSSSSSSSSS..',
      '...SSSSSSSSSS...',
      '....SSSSSSSS....',
    ];
    this.drawPixels(ctx, grid, C, 0, 0);

    this.scene.textures.addCanvas('mushroom', canvas);
  }

  // ---- FLAG ----
  generateFlag() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#00A800';
    ctx.beginPath();
    ctx.moveTo(2, 1);
    ctx.lineTo(14, 1);
    ctx.lineTo(14, 10);
    ctx.lineTo(2, 6);
    ctx.fill();

    this.scene.textures.addCanvas('flag', canvas);
  }
}
