// ============================================
// Super Mario Demo - Level Builder
// ============================================

class LevelBuilder {
  /**
   * Build level tilemap data and entity spawn list
   * Returns { mapData: 2D array, entities: [{type, x, y, ...}], blockContents: {} }
   */
  static buildLevel1() {
    const W = 212;
    const H = 15;
    const ts = 16;
    
    // Init empty map
    const map = [];
    for (let y = 0; y < H; y++) {
      map[y] = new Array(W).fill(-1);
    }

    function ground(sx, ex, y = 13) {
      for (let x = sx; x <= ex; x++) {
        for (let r = y; r < H; r++) {
          map[r][x] = TILE.GROUND;
        }
      }
    }

    function pipe(x, height) {
      const topY = 13 - height;
      map[topY][x] = TILE.PIPE_TL;
      map[topY][x + 1] = TILE.PIPE_TR;
      for (let y = topY + 1; y < 13; y++) {
        map[y][x] = TILE.PIPE_BL;
        map[y][x + 1] = TILE.PIPE_BR;
      }
    }

    const blockContents = {};

    function question(x, y, content = 'coin') {
      map[y][x] = TILE.QUESTION;
      blockContents[`${x},${y}`] = content;
    }

    function brick(x, y) {
      map[y][x] = TILE.BRICK;
    }

    function solidBlock(x, y) {
      map[y][x] = TILE.BLOCK;
    }

    // ====== GROUND SEGMENTS ======
    ground(0, 68);
    ground(71, 86);
    ground(89, 152);
    ground(155, W - 1);

    // ====== SECTION 1: Start ======
    question(16, 9, 'coin');
    brick(20, 9);
    question(21, 9, 'mushroom');
    brick(22, 9);
    question(22, 5, 'coin');
    brick(23, 9);

    // ====== SECTION 2: Pipes ======
    pipe(28, 2);
    pipe(38, 3);
    pipe(46, 4);
    pipe(57, 4);

    // ====== SECTION 3: After gap ======
    question(78, 9, 'coin');

    // High brick row
    for (let x = 80; x <= 87; x++) brick(x, 5);

    // ====== SECTION 4: Staircases ======
    for (let i = 0; i < 4; i++)
      for (let j = 0; j <= i; j++)
        solidBlock(91 + i, 12 - j);

    for (let i = 0; i < 4; i++)
      for (let j = 0; j <= (3 - i); j++)
        solidBlock(96 + i, 12 - j);

    // ====== SECTION 5: More blocks ======
    question(106, 9, 'coin');
    question(109, 9, 'coin');
    question(109, 5, 'mushroom');
    question(112, 9, 'coin');

    brick(118, 9);
    brick(119, 5);
    brick(120, 5);
    brick(121, 5);

    brick(128, 5);
    brick(129, 5);
    brick(130, 5);
    question(131, 5, 'coin');

    brick(129, 9);
    brick(130, 9);
    question(130, 9, 'coin');
    brick(131, 9);

    // ====== SECTION 6: More staircases ======
    for (let i = 0; i < 4; i++)
      for (let j = 0; j <= i; j++)
        solidBlock(134 + i, 12 - j);

    for (let i = 0; i < 4; i++)
      for (let j = 0; j <= (3 - i); j++)
        solidBlock(140 + i, 12 - j);

    // ====== SECTION 7: Final staircase ======
    for (let i = 0; i < 8; i++)
      for (let j = 0; j <= i; j++)
        solidBlock(160 + i, 12 - j);

    // ====== FLAG ======
    map[3][169] = TILE.FLAG_TOP;
    for (let y = 4; y < 13; y++) map[y][169] = TILE.FLAG_POLE;

    // ====== CASTLE ======
    for (let x = 175; x <= 180; x++)
      for (let y = 8; y < 13; y++)
        map[y][x] = TILE.CASTLE;

    for (let x = 176; x <= 179; x++) map[7][x] = TILE.CASTLE_TOP;
    map[5][177] = TILE.CASTLE;
    map[5][178] = TILE.CASTLE;
    map[6][177] = TILE.CASTLE;
    map[6][178] = TILE.CASTLE;
    map[11][177] = TILE.CASTLE_DOOR;
    map[11][178] = TILE.CASTLE_DOOR;
    map[12][177] = TILE.CASTLE_DOOR;
    map[12][178] = TILE.CASTLE_DOOR;

    // ====== ENTITIES ======
    const entities = [];

    // Goombas
    const goombas = [
      [22,12],[40,12],[51,12],[52,12],
      [80,4],[82,4],
      [97,12],[98,12],
      [107,12],[111,12],
      [114,12],[115,12],
      [124,12],[125,12],[128,12],
      [145,12],[146,12],
    ];
    for (const [gx, gy] of goombas) {
      entities.push({ type: 'goomba', x: gx * ts + 8, y: gy * ts + 8 });
    }

    // Static coins
    const coins = [
      [73,8],[74,8],[75,8],
      [100,8],[101,8],
    ];
    for (const [cx, cy] of coins) {
      entities.push({ type: 'coin', x: cx * ts + 8, y: cy * ts + 8 });
    }

    return { mapData: map, entities, blockContents, width: W, height: H, flagX: 169, spawnX: 3 * ts, spawnY: 12 * ts };
  }
}
