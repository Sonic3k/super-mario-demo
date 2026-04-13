// ============================================
// Super Mario Demo - Entities
// ============================================

// ---- MARIO ----
class Mario {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 12;
    this.h = 16;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1; // 1 = right, -1 = left
    this.state = MARIO_STATE.SMALL; // small, big, fire
    this.animState = 'stand'; // stand, walk, jump, skid, dead
    this.animFrame = 0;
    this.animTimer = 0;
    this.jumpHoldTimer = 0;
    this.isJumping = false;
    this.isDead = false;
    this.isInvincible = false;
    this.invincibleTimer = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.deathTimer = 0;
    this.levelClear = false;
    this.flagSlideY = 0;
    this.pipeEntering = false;
    
    // Growing animation
    this.isGrowing = false;
    this.growTimer = 0;
    this.growFlashRate = 4;
  }

  update(input, physics) {
    if (this.isDead) {
      this.updateDead();
      return;
    }
    
    if (this.levelClear) {
      this.updateLevelClear();
      return;
    }

    if (this.isGrowing) {
      this.growTimer--;
      if (this.growTimer <= 0) {
        this.isGrowing = false;
      }
      return; // Freeze during growth animation
    }

    if (this.isInvincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
      }
    }

    // Horizontal movement
    const accel = input.run ? CONFIG.MARIO.RUN_ACCEL : CONFIG.MARIO.WALK_ACCEL;
    const maxSpeed = input.run ? CONFIG.MARIO.RUN_MAX_SPEED : CONFIG.MARIO.WALK_MAX_SPEED;
    
    let isSkidding = false;

    if (input.right) {
      if (this.vx < 0 && this.onGround) isSkidding = true;
      this.vx += accel;
      if (this.vx > maxSpeed) this.vx = maxSpeed;
      this.facing = 1;
    } else if (input.left) {
      if (this.vx > 0 && this.onGround) isSkidding = true;
      this.vx -= accel;
      if (this.vx < -maxSpeed) this.vx = -maxSpeed;
      this.facing = -1;
    } else {
      // Friction
      const friction = this.onGround ? CONFIG.MARIO.FRICTION_GROUND : CONFIG.MARIO.FRICTION_AIR;
      if (Math.abs(this.vx) < friction) {
        this.vx = 0;
      } else {
        this.vx -= Math.sign(this.vx) * friction;
      }
    }

    // Jump
    if (input.jumpPressed && this.onGround) {
      // Variable jump height based on speed (like NES)
      const speedBonus = Math.abs(this.vx) * CONFIG.MARIO.JUMP_SPEED_BOOST;
      this.vy = CONFIG.MARIO.JUMP_FORCE - speedBonus;
      this.isJumping = true;
      this.jumpHoldTimer = CONFIG.MARIO.JUMP_HOLD_FRAMES;
      this.onGround = false;
    }

    // Hold jump for higher
    if (input.jump && this.isJumping && this.jumpHoldTimer > 0) {
      this.vy += CONFIG.MARIO.JUMP_HOLD_FORCE;
      this.jumpHoldTimer--;
    }

    if (input.jumpReleased || this.vy >= 0) {
      this.isJumping = false;
      this.jumpHoldTimer = 0;
    }

    // Physics
    physics.resolveEntityTilemap(this);

    // Prevent going left of camera
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }

    // Fall death
    if (this.y > physics.level.height * CONFIG.TILE_SIZE + 32) {
      this.die();
    }

    // Animation state
    if (!this.onGround) {
      this.animState = 'jump';
    } else if (isSkidding) {
      this.animState = 'skid';
    } else if (Math.abs(this.vx) > 0.1) {
      this.animState = 'walk';
      this.animTimer++;
      if (this.animTimer >= CONFIG.ANIM.WALK_SPEED) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      this.animState = 'stand';
      this.animFrame = 0;
      this.animTimer = 0;
    }
  }

  updateDead() {
    this.deathTimer++;
    if (this.deathTimer < CONFIG.ANIM.DEATH_RISE) {
      this.vy = -4;
    } else {
      this.vy += CONFIG.GRAVITY;
    }
    this.y += this.vy;
    this.animState = 'dead';
  }

  updateLevelClear() {
    // Slide down flag pole
    if (this.flagSlideY > 0) {
      this.y += 2;
      this.flagSlideY -= 2;
      if (this.flagSlideY <= 0) {
        this.flagSlideY = 0;
        // Walk towards castle
        this.vx = CONFIG.MARIO.WALK_MAX_SPEED;
        this.facing = 1;
        this.animState = 'walk';
      }
    } else if (this.levelClear) {
      // Walking to castle
      this.animTimer++;
      if (this.animTimer >= CONFIG.ANIM.WALK_SPEED) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
      this.x += this.vx;
      this.vy += CONFIG.GRAVITY;
      if (this.vy > CONFIG.MAX_FALL_SPEED) this.vy = CONFIG.MAX_FALL_SPEED;
      this.y += this.vy;
      
      // Simple ground check
      const groundY = (Math.floor(this.y / CONFIG.TILE_SIZE) + 1) * CONFIG.TILE_SIZE;
      if (this.vy > 0) {
        // Just keep on ground level  
        const levelGround = (12) * CONFIG.TILE_SIZE; // Row 12 typically
        if (this.y + this.h > levelGround) {
          this.y = levelGround - this.h;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }
  }

  die() {
    if (this.isDead) return;
    
    if (this.state !== MARIO_STATE.SMALL) {
      // Shrink instead of die
      this.state = MARIO_STATE.SMALL;
      this.h = 16;
      this.isInvincible = true;
      this.invincibleTimer = CONFIG.MARIO.INVINCIBLE_FRAMES;
      return;
    }
    
    this.isDead = true;
    this.vy = 0;
    this.vx = 0;
    this.deathTimer = 0;
    this.animState = 'dead';
    this.lives--;
  }

  grow() {
    if (this.state === MARIO_STATE.SMALL) {
      this.state = MARIO_STATE.BIG;
      this.y -= 16; // Grow upward
      this.h = 32;
      this.isGrowing = true;
      this.growTimer = 48; // ~0.8 seconds freeze
    }
  }

  // Called when Mario hits a block from below
  onHeadHit(tx, ty, tile) {
    if (this.headHitCallback) {
      this.headHitCallback(tx, ty, tile);
    }
  }

  render(ctx, camera, sprites, frameCount) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    
    // Invincibility flash
    if (this.isInvincible && !this.isDead) {
      if (Math.floor(frameCount / CONFIG.ANIM.INVINCIBLE_FLASH) % 2 === 0) return;
    }

    // Growing flash
    if (this.isGrowing) {
      const flashPhase = Math.floor(this.growTimer / this.growFlashRate) % 2;
      // Alternate between small and big sprite
      if (flashPhase === 0) {
        const sprite = sprites.getMarioSprite(this.animState, this.animFrame, this.facing, this.state);
        ctx.drawImage(sprite, screenX - 2, screenY, 12 * CONFIG.SCALE, 16 * CONFIG.SCALE);
      } else {
        const sprite = sprites.getBigMarioSprite(this.animState, this.animFrame, this.facing);
        ctx.drawImage(sprite, screenX - 4, screenY - 8, 16 * CONFIG.SCALE, 20 * CONFIG.SCALE);
      }
      return;
    }

    if (this.state === MARIO_STATE.SMALL || this.isDead) {
      const sprite = sprites.getMarioSprite(this.animState, this.animFrame, this.facing, this.state);
      ctx.drawImage(sprite, screenX - 2, screenY, 12 * CONFIG.SCALE, 16 * CONFIG.SCALE);
    } else {
      const sprite = sprites.getBigMarioSprite(this.animState, this.animFrame, this.facing);
      ctx.drawImage(sprite, screenX - 4, screenY, 16 * CONFIG.SCALE, 20 * CONFIG.SCALE);
    }
  }
}

// ---- GOOMBA ----
class Goomba {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 14;
    this.h = 14;
    this.vx = -CONFIG.ENEMY.GOOMBA_SPEED;
    this.vy = 0;
    this.onGround = false;
    this.alive = true;
    this.squished = false;
    this.squishedTimer = 0;
    this.active = false; // Only activate when on screen
    this.removed = false;
  }

  activate() {
    this.active = true;
  }

  update(physics) {
    if (!this.active || this.removed) return;
    
    if (this.squished) {
      this.squishedTimer++;
      if (this.squishedTimer > 30) {
        this.removed = true;
      }
      return;
    }

    if (!this.alive) return;

    physics.resolveEntityTilemap(this);

    // Fall off screen
    if (this.y > physics.level.height * CONFIG.TILE_SIZE + 32) {
      this.removed = true;
    }
  }

  onWallHit() {
    this.vx = -this.vx;
  }

  stomp() {
    this.squished = true;
    this.alive = false;
    this.vx = 0;
    this.h = 8;
    this.y += 6;
  }

  render(ctx, camera, sprites, frameCount) {
    if (this.removed) return;
    
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    
    const sprite = sprites.getGoombaSrite(frameCount, this.squished);
    
    if (this.squished) {
      ctx.drawImage(sprite, screenX - 1, screenY + 4, 16 * CONFIG.SCALE, 16 * CONFIG.SCALE);
    } else {
      ctx.drawImage(sprite, screenX - 1, screenY - 1, 16 * CONFIG.SCALE, 16 * CONFIG.SCALE);
    }
  }
}

// ---- MUSHROOM ITEM ----
class Mushroom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 14;
    this.h = 14;
    this.vx = CONFIG.ITEMS.MUSHROOM_SPEED;
    this.vy = 0;
    this.onGround = false;
    this.alive = true;
    this.removed = false;
    this.rising = true;
    this.riseStartY = y;
    this.riseTarget = y - CONFIG.TILE_SIZE;
  }

  update(physics) {
    if (this.removed) return;

    if (this.rising) {
      this.y -= 1;
      if (this.y <= this.riseTarget) {
        this.y = this.riseTarget;
        this.rising = false;
      }
      return;
    }

    physics.resolveEntityTilemap(this);

    if (this.y > physics.level.height * CONFIG.TILE_SIZE + 32) {
      this.removed = true;
    }
  }

  onWallHit() {
    this.vx = -this.vx;
  }

  collect() {
    this.removed = true;
  }

  render(ctx, camera, sprites) {
    if (this.removed) return;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    const sprite = sprites.getMushroomSprite();
    ctx.drawImage(sprite, screenX - 1, screenY - 1, 16 * CONFIG.SCALE, 16 * CONFIG.SCALE);
  }
}

// ---- COIN EFFECT (from block) ----
class CoinEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = CONFIG.ITEMS.COIN_RISE_SPEED;
    this.timer = 0;
    this.removed = false;
  }

  update() {
    this.timer++;
    this.y += this.vy;
    this.vy += 0.3;
    if (this.timer > 30) {
      this.removed = true;
    }
  }

  render(ctx, camera, sprites, frameCount) {
    if (this.removed) return;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    const sprite = sprites.getCoinSprite(frameCount);
    ctx.drawImage(sprite, screenX, screenY, 16 * CONFIG.SCALE, 16 * CONFIG.SCALE);
  }
}

// ---- SCORE POPUP ----
class ScorePopup {
  constructor(x, y, score) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.timer = 0;
    this.removed = false;
  }

  update() {
    this.timer++;
    this.y -= 1;
    if (this.timer > 30) this.removed = true;
  }

  render(ctx, camera) {
    if (this.removed) return;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = '8px monospace';
    ctx.fillText(this.score.toString(), screenX, screenY);
  }
}

// ---- BRICK PARTICLES ----
class BrickParticle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.timer = 0;
    this.removed = false;
  }

  update() {
    this.timer++;
    this.x += this.vx;
    this.y += this.vy;
    this.vy += CONFIG.GRAVITY;
    if (this.timer > 60) this.removed = true;
  }

  render(ctx, camera) {
    if (this.removed) return;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    ctx.fillStyle = COLORS.BRICK_RED;
    ctx.fillRect(screenX, screenY, 8, 8);
    ctx.fillStyle = COLORS.BRICK_DARK;
    ctx.fillRect(screenX, screenY, 8, 1);
    ctx.fillRect(screenX + 3, screenY, 1, 8);
  }
}

// ---- STATIC COIN (collectible in level) ----
class StaticCoin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 14;
    this.removed = false;
  }

  collect() {
    this.removed = true;
  }

  render(ctx, camera, sprites, frameCount) {
    if (this.removed) return;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    const sprite = sprites.getCoinSprite(frameCount);
    ctx.drawImage(sprite, screenX - 3, screenY - 1, 16 * CONFIG.SCALE, 16 * CONFIG.SCALE);
  }
}
