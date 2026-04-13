// ============================================
// Super Mario Demo - Configuration & Constants
// ============================================

const CONFIG = {
  // Display
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 480,
  TILE_SIZE: 16,
  SCALE: 2, // Render at 2x for crisp pixels
  
  // Physics
  GRAVITY: 0.55,
  MAX_FALL_SPEED: 8,
  
  // Mario physics (tuned to feel like NES Mario)
  MARIO: {
    WALK_ACCEL: 0.12,
    RUN_ACCEL: 0.18,
    WALK_MAX_SPEED: 2.2,
    RUN_MAX_SPEED: 3.5,
    FRICTION_GROUND: 0.15,
    FRICTION_AIR: 0.02,
    JUMP_FORCE: -7.2,
    JUMP_HOLD_FORCE: -0.28,
    JUMP_HOLD_FRAMES: 14,
    JUMP_SPEED_BOOST: 0.3, // Higher speed = higher jump like NES
    INVINCIBLE_FRAMES: 120,
  },
  
  // Enemy physics
  ENEMY: {
    GOOMBA_SPEED: 0.6,
    KOOPA_SPEED: 0.7,
    SHELL_SPEED: 5,
    STOMP_BOUNCE: -5,
  },
  
  // Items
  ITEMS: {
    MUSHROOM_SPEED: 1.5,
    COIN_RISE_SPEED: -5,
    BLOCK_BUMP_HEIGHT: -3,
  },
  
  // Camera
  CAMERA: {
    LEAD_X: 0.4, // Mario position ratio to trigger scroll
    SMOOTH: 0.08,
  },
  
  // Timing
  LEVEL_TIME: 400, // seconds
  FPS: 60,
  
  // Animation frame durations (in game frames)
  ANIM: {
    WALK_SPEED: 6,
    COIN_SPIN: 8,
    BLOCK_BUMP: 12,
    DEATH_RISE: 20,
    DEATH_FALL: 60,
    FLAG_SLIDE: 2,
    INVINCIBLE_FLASH: 3,
  },
};

// Tile types for level data
const TILES = {
  EMPTY: 0,
  GROUND: 1,
  BRICK: 2,
  QUESTION: 3,
  QUESTION_EMPTY: 4,
  PIPE_TL: 5,
  PIPE_TR: 6,
  PIPE_BL: 7,
  PIPE_BR: 8,
  BLOCK: 9,       // Solid decorative block
  BRICK_UNDERGROUND: 10,
  FLAG_POLE: 11,
  FLAG_TOP: 12,
  CASTLE_BLOCK: 13,
  CASTLE_TOP: 14,
  CASTLE_DOOR: 15,
  CASTLE_WINDOW: 16,
  CLOUD_TL: 17,
  CLOUD_TR: 18,
  BUSH_L: 19,
  BUSH_M: 20,
  BUSH_R: 21,
  HILL_BODY: 22,
  HILL_TOP: 23,
  HILL_SPOT: 24,
};

// Entity types
const ENTITY_TYPES = {
  GOOMBA: 'goomba',
  KOOPA: 'koopa',
  MUSHROOM: 'mushroom',
  FIRE_FLOWER: 'fireFlower',
  COIN: 'coin',
  COIN_STATIC: 'coinStatic',
  FLAG: 'flag',
};

// Game states
const GAME_STATE = {
  LOADING: 'loading',
  TITLE: 'title',
  PLAYING: 'playing',
  DYING: 'dying',
  LEVEL_CLEAR: 'levelClear',
  GAME_OVER: 'gameOver',
  PAUSED: 'paused',
};

// Mario states
const MARIO_STATE = {
  SMALL: 'small',
  BIG: 'big',
  FIRE: 'fire',
};

// Colors - NES Mario palette
const COLORS = {
  SKY: '#5C94FC',
  
  // Mario
  MARIO_RED: '#B81C1C',
  MARIO_SKIN: '#F0A060',
  MARIO_BROWN: '#6B3400',
  MARIO_RED_DARK: '#8C1414',
  
  // Fire Mario
  FIRE_WHITE: '#F8F8F8',
  FIRE_RED: '#B81C1C',
  
  // Ground/Bricks
  GROUND_BROWN: '#C84C0C',
  GROUND_DARK: '#A03800',
  GROUND_LIGHT: '#E8A060',
  BRICK_RED: '#C84C0C',
  BRICK_DARK: '#A03800',
  BRICK_LINE: '#6B3400',
  
  // Question block
  QUESTION_YELLOW: '#F8B800',
  QUESTION_DARK: '#C88400',
  QUESTION_OUTLINE: '#6B3400',
  QUESTION_MARK: '#6B3400',
  
  // Pipe
  PIPE_GREEN: '#00A800',
  PIPE_DARK: '#007800',
  PIPE_LIGHT: '#38E038',
  PIPE_OUTLINE: '#005000',
  
  // Goomba
  GOOMBA_BROWN: '#C88448',
  GOOMBA_DARK: '#8C5C28',
  GOOMBA_LIGHT: '#E8C498',
  GOOMBA_WHITE: '#F8F8F8',
  GOOMBA_BLACK: '#000000',
  
  // Koopa
  KOOPA_GREEN: '#00A800',
  KOOPA_DARK: '#005800',
  KOOPA_LIGHT: '#58F898',
  KOOPA_SKIN: '#F0D0B0',
  KOOPA_WHITE: '#F8F8F8',
  
  // Coin
  COIN_YELLOW: '#F8B800',
  COIN_DARK: '#C88400',
  COIN_LIGHT: '#F8D878',
  
  // Mushroom
  MUSHROOM_RED: '#B81C1C',
  MUSHROOM_WHITE: '#F8F8F8',
  MUSHROOM_SKIN: '#F0A060',
  MUSHROOM_DARK: '#6B3400',
  
  // Flag
  FLAG_GREEN: '#00A800',
  FLAG_POLE: '#888888',
  FLAG_BALL: '#888888',
  
  // Castle
  CASTLE_GRAY: '#A0A0A0',
  CASTLE_DARK: '#686868',
  CASTLE_LIGHT: '#D0D0D0',
  
  // Scenery
  CLOUD_WHITE: '#F8F8F8',
  CLOUD_LIGHT: '#D8F0F8',
  BUSH_GREEN: '#00A800',
  BUSH_DARK: '#005800',
  BUSH_LIGHT: '#58F898',
  HILL_GREEN: '#58A828',
  HILL_DARK: '#387818',
  HILL_LIGHT: '#88D050',
  
  // UI
  UI_WHITE: '#F8F8F8',
  UI_BLACK: '#000000',
  
  // Effects
  PARTICLE_BROWN: '#C84C0C',
  PARTICLE_LIGHT: '#E8A060',
};
