// ============================================
// Super Mario Demo - Configuration
// ============================================

const GAME_CONFIG = {
  TILE_SIZE: 16,
  SCALE: 2,
  WIDTH: 800,
  HEIGHT: 480,
  
  PHYSICS: {
    GRAVITY: 900,
    MARIO_WALK_SPEED: 150,
    MARIO_RUN_SPEED: 250,
    MARIO_ACCEL: 600,
    MARIO_DRAG: 500,
    MARIO_JUMP: -330,
    MARIO_JUMP_HOLD: -50,
    MARIO_JUMP_MAX_HOLD: 250, // ms
    MARIO_JUMP_SPEED_BONUS: 0.15, // faster = higher jump
    
    GOOMBA_SPEED: 40,
    MUSHROOM_SPEED: 60,
    STOMP_BOUNCE: -250,
    
    MAX_FALL: 500,
  },
  
  LEVEL_TIME: 400,
  
  COLORS: {
    SKY: 0x5C94FC,
    SKY_CSS: '#5C94FC',
  },
};

// Tile indices matching tilemap
const TILE = {
  EMPTY: -1,
  GROUND: 0,
  BRICK: 1,
  QUESTION: 2,
  QUESTION_EMPTY: 3,
  BLOCK: 4,
  PIPE_TL: 5,
  PIPE_TR: 6,
  PIPE_BL: 7,
  PIPE_BR: 8,
  FLAG_POLE: 9,
  FLAG_TOP: 10,
  CASTLE: 11,
  CASTLE_TOP: 12,
  CASTLE_DOOR: 13,
};
