// ============================================
// Super Mario Demo - Main Game
// ============================================

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    
    this.input = new InputManager();
    this.sprites = new SpriteRenderer();
    this.camera = new Camera();
    this.ui = new GameUI();
    this.sound = new SoundManager();
    
    this.level = null;
    this.mario = null;
    this.physics = null;
    
    this.effects = []; // Coin effects, particles, score popups
    this.state = GAME_STATE.TITLE;
    this.frameCount = 0;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDt = 1000 / CONFIG.FPS;
    
    this.deathPauseTimer = 0;
    this.levelClearTimer = 0;
    this.gameOverTimer = 0;
    
    this.flagEntity = null; // Visual flag on the pole
  }

  init() {
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;
    
    this.loadLevel();
  }

  loadLevel() {
    this.level = createLevel1();
    this.mario = new Mario(this.level.spawnX, this.level.spawnY);
    this.physics = new PhysicsEngine(this.level);
    this.camera.init(this.level.width, this.level.height);
    this.camera.reset();
    this.ui.reset();
    this.effects = [];
    this.deathPauseTimer = 0;
    this.levelClearTimer = 0;
    
    // Create flag entity
    this.flagEntity = {
      x: this.level.flagX * CONFIG.TILE_SIZE - 10,
      y: this.level.flagY * CONFIG.TILE_SIZE + 8,
      baseY: this.level.flagY * CONFIG.TILE_SIZE + 8,
      lowered: false,
    };
    
    // Setup Mario head-hit callback
    this.mario.headHitCallback = (tx, ty, tile) => {
      this.onBlockHit(tx, ty, tile);
    };
  }

  resetLevel() {
    const lives = this.mario.lives;
    const score = this.mario.score;
    const coins = this.mario.coins;
    
    this.loadLevel();
    this.mario.lives = lives;
    this.mario.score = score;
    this.mario.coins = coins;
    this.state = GAME_STATE.PLAYING;
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(time) {
    const dt = time - this.lastTime;
    this.lastTime = time;
    
    this.accumulator += dt;
    
    // Fixed timestep for physics
    while (this.accumulator >= this.fixedDt) {
      this.input.update();
      this.update(this.fixedDt / 1000);
      this.accumulator -= this.fixedDt;
      this.frameCount++;
    }
    
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    switch (this.state) {
      case GAME_STATE.TITLE:
        if (this.input.start) {
          this.sound.init();
          this.state = GAME_STATE.PLAYING;
        }
        break;

      case GAME_STATE.PLAYING:
        this.updatePlaying(dt);
        break;

      case GAME_STATE.DYING:
        this.updateDying(dt);
        break;

      case GAME_STATE.LEVEL_CLEAR:
        this.updateLevelClear(dt);
        break;

      case GAME_STATE.GAME_OVER:
        this.gameOverTimer++;
        if (this.gameOverTimer > 180 && this.input.start) {
          this.mario.lives = 3;
          this.mario.score = 0;
          this.mario.coins = 0;
          this.loadLevel();
          this.state = GAME_STATE.TITLE;
        }
        break;

      case GAME_STATE.PAUSED:
        if (this.input.pause) {
          this.state = GAME_STATE.PLAYING;
          this.sound.pause();
        }
        break;
    }
  }

  updatePlaying(dt) {
    // Pause
    if (this.input.pause) {
      this.state = GAME_STATE.PAUSED;
      this.sound.pause();
      return;
    }

    // Update Mario
    this.mario.update(this.input, this.physics);
    
    // Update enemies
    for (const entity of this.level.entities) {
      // Activate enemies when they come on screen
      if (!entity.active && entity.activate) {
        const screenX = entity.x - this.camera.x;
        if (screenX < CONFIG.CANVAS_WIDTH / CONFIG.SCALE + 32 && screenX > -32) {
          entity.activate();
        }
      }
      
      if (entity.update && entity.active !== false) {
        entity.update(this.physics);
      }
    }
    
    // Update effects
    for (const effect of this.effects) {
      effect.update();
    }
    this.effects = this.effects.filter(e => !e.removed);
    
    // Remove dead entities
    this.level.entities = this.level.entities.filter(e => !e.removed);
    
    // Update level bumps
    this.level.updateBumps();
    
    // Collision: Mario vs enemies
    this.checkEnemyCollisions();
    
    // Collision: Mario vs items
    this.checkItemCollisions();
    
    // Collision: Mario vs flag
    this.checkFlagCollision();
    
    // Update camera
    this.camera.follow(this.mario);
    
    // Update UI timer
    this.ui.update(dt);
    
    // Time out
    if (this.ui.timer <= 0 && !this.mario.isDead) {
      this.mario.die();
      this.sound.die();
      this.state = GAME_STATE.DYING;
      this.deathPauseTimer = 0;
    }
    
    // Mario death
    if (this.mario.isDead) {
      this.sound.die();
      this.state = GAME_STATE.DYING;
      this.deathPauseTimer = 0;
    }
  }

  updateDying(dt) {
    this.mario.update(this.input, this.physics);
    this.deathPauseTimer++;
    
    if (this.deathPauseTimer > 180) { // ~3 seconds
      if (this.mario.lives <= 0) {
        this.state = GAME_STATE.GAME_OVER;
        this.gameOverTimer = 0;
      } else {
        this.resetLevel();
      }
    }
  }

  updateLevelClear(dt) {
    this.mario.update(this.input, this.physics);
    this.levelClearTimer++;
    
    // Lower flag
    if (this.flagEntity && !this.flagEntity.lowered) {
      this.flagEntity.y += 2;
      const maxY = 12 * CONFIG.TILE_SIZE;
      if (this.flagEntity.y >= maxY) {
        this.flagEntity.y = maxY;
        this.flagEntity.lowered = true;
      }
    }
    
    // Count down timer to score
    if (this.levelClearTimer > 120 && this.ui.timer > 0) {
      this.ui.timer -= 2;
      this.mario.score += 100;
      if (this.frameCount % 4 === 0) {
        this.sound.coin();
      }
    }
    
    // Castle reached
    if (this.mario.x > 177 * CONFIG.TILE_SIZE) {
      this.mario.vx = 0;
      this.mario.animState = 'stand';
    }
  }

  // ---- COLLISION HANDLERS ----

  checkEnemyCollisions() {
    if (this.mario.isDead || this.mario.isInvincible || this.mario.isGrowing) return;
    
    const marioBox = { x: this.mario.x, y: this.mario.y, w: this.mario.w, h: this.mario.h };
    
    for (const entity of this.level.entities) {
      if (entity instanceof Goomba && entity.alive && entity.active && !entity.squished) {
        const enemyBox = { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
        
        if (this.physics.aabbOverlap(marioBox, enemyBox)) {
          // Check if stomping (Mario falling onto enemy)
          if (this.mario.vy > 0 && this.mario.y + this.mario.h - entity.y < 10) {
            // Stomp!
            entity.stomp();
            this.mario.vy = CONFIG.ENEMY.STOMP_BOUNCE;
            this.mario.score += 100;
            this.sound.stomp();
            this.effects.push(new ScorePopup(entity.x, entity.y - 8, 100));
          } else {
            // Mario takes damage
            this.mario.die();
            if (this.mario.isDead) {
              this.sound.die();
              this.state = GAME_STATE.DYING;
              this.deathPauseTimer = 0;
            }
          }
        }
      }
    }
  }

  checkItemCollisions() {
    if (this.mario.isDead) return;
    
    const marioBox = { x: this.mario.x, y: this.mario.y, w: this.mario.w, h: this.mario.h };
    
    for (const entity of this.level.entities) {
      if (entity.removed) continue;
      
      if (entity instanceof Mushroom && !entity.rising) {
        const itemBox = { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
        if (this.physics.aabbOverlap(marioBox, itemBox)) {
          entity.collect();
          this.mario.grow();
          this.mario.score += 1000;
          this.sound.grow();
          this.effects.push(new ScorePopup(entity.x, entity.y - 8, 1000));
        }
      }
      
      if (entity instanceof StaticCoin) {
        const itemBox = { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
        if (this.physics.aabbOverlap(marioBox, itemBox)) {
          entity.collect();
          this.mario.coins++;
          this.mario.score += 200;
          this.sound.coin();
          this.effects.push(new ScorePopup(entity.x, entity.y - 8, 200));
        }
      }
    }
  }

  checkFlagCollision() {
    if (this.mario.levelClear || this.mario.isDead) return;
    
    const flagX = this.level.flagX * CONFIG.TILE_SIZE;
    
    if (this.mario.x + this.mario.w >= flagX && this.mario.x <= flagX + 16) {
      // Hit the flag pole!
      this.mario.levelClear = true;
      this.mario.vx = 0;
      this.mario.vy = 0;
      this.mario.x = flagX - 4;
      
      // Calculate flag slide distance
      const poleBottom = 12 * CONFIG.TILE_SIZE;
      this.mario.flagSlideY = poleBottom - this.mario.y - this.mario.h;
      
      // Score based on height
      const heightRatio = 1 - (this.mario.y / (12 * CONFIG.TILE_SIZE));
      const flagScore = Math.floor(heightRatio * 5000 / 100) * 100;
      this.mario.score += flagScore;
      
      this.state = GAME_STATE.LEVEL_CLEAR;
      this.levelClearTimer = 0;
      this.sound.flagpole();
      
      this.effects.push(new ScorePopup(this.mario.x, this.mario.y - 16, flagScore));
    }
  }

  onBlockHit(tx, ty, tile) {
    if (tile === TILES.QUESTION) {
      const key = `${tx},${ty}`;
      const content = this.level.blockContents[key] || 'coin';
      
      // Change to empty block
      this.level.setTile(tx, ty, TILES.QUESTION_EMPTY);
      this.level.bumpBlock(tx, ty);
      
      if (content === 'coin') {
        this.mario.coins++;
        this.mario.score += 200;
        this.sound.coin();
        this.effects.push(new CoinEffect(tx * CONFIG.TILE_SIZE, (ty - 1) * CONFIG.TILE_SIZE));
        this.effects.push(new ScorePopup(tx * CONFIG.TILE_SIZE, (ty - 2) * CONFIG.TILE_SIZE, 200));
      } else if (content === 'mushroom') {
        // Spawn mushroom
        const mushroom = new Mushroom(tx * CONFIG.TILE_SIZE + 1, ty * CONFIG.TILE_SIZE);
        this.level.entities.push(mushroom);
        this.sound.powerup();
      }
    } else if (tile === TILES.BRICK) {
      if (this.mario.state !== MARIO_STATE.SMALL) {
        // Break brick
        this.level.setTile(tx, ty, TILES.EMPTY);
        this.sound.brickBreak();
        this.mario.score += 50;
        
        // Spawn particles
        const bx = tx * CONFIG.TILE_SIZE;
        const by = ty * CONFIG.TILE_SIZE;
        this.effects.push(new BrickParticle(bx, by, -2, -5));
        this.effects.push(new BrickParticle(bx + 8, by, 2, -5));
        this.effects.push(new BrickParticle(bx, by + 8, -1.5, -3));
        this.effects.push(new BrickParticle(bx + 8, by + 8, 1.5, -3));
      } else {
        // Just bump
        this.level.bumpBlock(tx, ty);
        this.sound.bump();
      }
    }
    
    // Check if enemy is on top of bumped block
    for (const entity of this.level.entities) {
      if (entity instanceof Goomba && entity.alive && !entity.squished) {
        const etx = Math.floor((entity.x + entity.w / 2) / CONFIG.TILE_SIZE);
        const ety = Math.floor((entity.y + entity.h) / CONFIG.TILE_SIZE);
        if (etx === tx && ety === ty) {
          // Kill enemy from below!
          entity.alive = false;
          entity.vy = -5;
          entity.removed = true;
          this.mario.score += 100;
          this.effects.push(new ScorePopup(entity.x, entity.y - 8, 100));
          this.sound.stomp();
        }
      }
    }
  }

  // ---- RENDER ----

  render() {
    const ctx = this.ctx;
    const scale = CONFIG.SCALE;
    
    // Clear
    ctx.fillStyle = COLORS.SKY;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    ctx.save();
    // We'll do manual scaling per element since we're mixing world and screen coords
    
    if (this.state !== GAME_STATE.GAME_OVER) {
      // Render scenery (behind tiles)
      this.level.renderScenery(ctx, this.camera, this.sprites);
      
      // Render tiles
      this.level.render(ctx, this.camera, this.sprites, this.frameCount);
      
      // Render flag
      if (this.flagEntity) {
        const fx = Math.round((this.flagEntity.x - this.camera.x) * scale);
        const fy = Math.round((this.flagEntity.y - this.camera.y) * scale);
        ctx.save();
        ctx.translate(fx, fy);
        ctx.scale(scale, scale);
        this.sprites.drawFlag(ctx);
        ctx.restore();
      }
      
      // Render entities
      for (const entity of this.level.entities) {
        if (entity.render) {
          entity.render(ctx, this.camera, this.sprites, this.frameCount);
        }
      }
      
      // Render Mario
      this.mario.render(ctx, this.camera, this.sprites, this.frameCount);
      
      // Render effects
      for (const effect of this.effects) {
        effect.render(ctx, this.camera, this.sprites, this.frameCount);
      }
      
      // HUD
      this.ui.render(ctx, this.mario);
    }
    
    // State overlays
    switch (this.state) {
      case GAME_STATE.TITLE:
        this.ui.renderTitle(ctx);
        break;
      case GAME_STATE.GAME_OVER:
        this.ui.renderGameOver(ctx, this.mario);
        break;
      case GAME_STATE.PAUSED:
        this.ui.renderPause(ctx);
        break;
      case GAME_STATE.LEVEL_CLEAR:
        if (this.levelClearTimer > 60) {
          this.ui.renderLevelClear(ctx, this.mario);
        }
        break;
    }
    
    ctx.restore();
  }
}

// ---- BOOT ----
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.init();
  game.start();
});
