// ============================================
// Super Mario Demo - Physics Engine
// ============================================

class PhysicsEngine {
  constructor(level) {
    this.level = level;
  }

  // Get tile at world pixel coordinates
  getTileAt(worldX, worldY) {
    const tx = Math.floor(worldX / CONFIG.TILE_SIZE);
    const ty = Math.floor(worldY / CONFIG.TILE_SIZE);
    return this.level.getTile(tx, ty);
  }

  // Check if a tile is solid
  isSolid(tileType) {
    return [
      TILES.GROUND, TILES.BRICK, TILES.QUESTION, TILES.QUESTION_EMPTY,
      TILES.PIPE_TL, TILES.PIPE_TR, TILES.PIPE_BL, TILES.PIPE_BR,
      TILES.BLOCK, TILES.CASTLE_BLOCK, TILES.CASTLE_TOP,
      TILES.CASTLE_DOOR, TILES.CASTLE_WINDOW,
    ].includes(tileType);
  }

  // AABB collision check
  aabbOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  // Resolve entity vs tilemap collision
  resolveEntityTilemap(entity) {
    const ts = CONFIG.TILE_SIZE;
    
    // Apply gravity
    entity.vy += CONFIG.GRAVITY;
    if (entity.vy > CONFIG.MAX_FALL_SPEED) entity.vy = CONFIG.MAX_FALL_SPEED;
    
    // Move X first
    entity.x += entity.vx;
    this.resolveX(entity, ts);
    
    // Then move Y
    entity.y += entity.vy;
    this.resolveY(entity, ts);
  }

  resolveX(entity, ts) {
    const left = Math.floor(entity.x / ts);
    const right = Math.floor((entity.x + entity.w - 1) / ts);
    const top = Math.floor(entity.y / ts);
    const bottom = Math.floor((entity.y + entity.h - 1) / ts);

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const tile = this.level.getTile(tx, ty);
        if (this.isSolid(tile)) {
          if (entity.vx > 0) {
            // Moving right - push left
            entity.x = tx * ts - entity.w;
            entity.vx = 0;
          } else if (entity.vx < 0) {
            // Moving left - push right
            entity.x = (tx + 1) * ts;
            entity.vx = 0;
          }
          if (entity.onWallHit) entity.onWallHit();
        }
      }
    }
  }

  resolveY(entity, ts) {
    const left = Math.floor(entity.x / ts);
    const right = Math.floor((entity.x + entity.w - 1) / ts);
    const top = Math.floor(entity.y / ts);
    const bottom = Math.floor((entity.y + entity.h - 1) / ts);

    entity.onGround = false;

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const tile = this.level.getTile(tx, ty);
        if (this.isSolid(tile)) {
          if (entity.vy > 0) {
            // Landing on top
            entity.y = ty * ts - entity.h;
            entity.vy = 0;
            entity.onGround = true;
          } else if (entity.vy < 0) {
            // Hitting from below
            entity.y = (ty + 1) * ts;
            entity.vy = 0;
            if (entity.onHeadHit) entity.onHeadHit(tx, ty, tile);
          }
        }
      }
    }
  }

  // Check if entity is on the ground (for coyote time etc)
  checkGround(entity) {
    const ts = CONFIG.TILE_SIZE;
    const left = Math.floor(entity.x / ts);
    const right = Math.floor((entity.x + entity.w - 1) / ts);
    const below = Math.floor((entity.y + entity.h + 1) / ts);

    for (let tx = left; tx <= right; tx++) {
      if (this.isSolid(this.level.getTile(tx, below))) {
        return true;
      }
    }
    return false;
  }
}
