// ============================================
// Super Mario Demo - Game Scene (Phaser 3)
// ============================================

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.sound_mgr = new SoundManager();
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.levelTime = GAME_CONFIG.LEVEL_TIME;
    this.marioState = 'small'; // small, big
    this.isDead = false;
    this.isLevelClear = false;
    this.blockContents = {};
    this.bumpTweens = {};
    this.flagX = 0;
    this.isGrowing = false;
    this.invincible = false;
  }

  preload() {
    // All textures generated in create()
  }

  create() {
    // Generate all sprites
    const gen = new SpriteGenerator(this);
    gen.generateAll();

    // Init sound
    this.sound_mgr.init();

    // Build level
    const levelData = LevelBuilder.buildLevel1();
    this.blockContents = levelData.blockContents;
    this.flagX = levelData.flagX;

    // Create tilemap from data
    const mapData = levelData.mapData;
    const tileMap = this.make.tilemap({
      data: mapData,
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = tileMap.addTilesetImage('tileset', 'tileset', 16, 16, 0, 0);
    this.groundLayer = tileMap.createLayer(0, tileset, 0, 0);
    this.groundLayer.setScale(GAME_CONFIG.SCALE);

    // Set collisions on solid tiles
    this.groundLayer.setCollision([
      TILE.GROUND, TILE.BRICK, TILE.QUESTION, TILE.QUESTION_EMPTY,
      TILE.BLOCK, TILE.PIPE_TL, TILE.PIPE_TR, TILE.PIPE_BL, TILE.PIPE_BR,
      TILE.CASTLE, TILE.CASTLE_TOP, TILE.CASTLE_DOOR,
    ]);

    // Background color
    this.cameras.main.setBackgroundColor(GAME_CONFIG.COLORS.SKY);

    // Create animations
    this.createAnimations();

    // Create Mario
    const spawnX = levelData.spawnX * GAME_CONFIG.SCALE;
    const spawnY = levelData.spawnY * GAME_CONFIG.SCALE;
    this.mario = this.physics.add.sprite(spawnX, spawnY, 'mario-small', 0);
    this.mario.setScale(GAME_CONFIG.SCALE);
    this.mario.setOrigin(0.5, 1);
    this.mario.body.setSize(12, 15);
    this.mario.body.setOffset(2, 1);
    this.mario.body.setMaxVelocityY(GAME_CONFIG.PHYSICS.MAX_FALL);
    this.mario.setDepth(10);

    // Mario vs ground
    this.physics.add.collider(this.mario, this.groundLayer, null, null, this);

    // Create enemy group
    this.goombas = this.physics.add.group();
    this.mushrooms = this.physics.add.group();
    this.staticCoins = this.physics.add.group();

    // Spawn entities
    for (const ent of levelData.entities) {
      const ex = ent.x * GAME_CONFIG.SCALE;
      const ey = ent.y * GAME_CONFIG.SCALE;
      if (ent.type === 'goomba') {
        const g = this.goombas.create(ex, ey, 'goomba', 0);
        g.setScale(GAME_CONFIG.SCALE);
        g.setOrigin(0.5, 1);
        g.body.setSize(14, 14);
        g.body.setOffset(1, 2);
        g.setVelocityX(-GAME_CONFIG.PHYSICS.GOOMBA_SPEED * GAME_CONFIG.SCALE);
        g.body.setBounceX(1);
        g.isActive = false;
        g.play('goomba-walk');
      } else if (ent.type === 'coin') {
        const c = this.staticCoins.create(ex, ey, 'coin', 0);
        c.setScale(GAME_CONFIG.SCALE);
        c.setOrigin(0.5, 0.5);
        c.body.setSize(10, 14);
        c.body.setOffset(3, 1);
        c.body.setAllowGravity(false);
        c.play('coin-spin');
      }
    }

    // Goomba vs ground
    this.physics.add.collider(this.goombas, this.groundLayer);

    // Mario vs goombas
    this.physics.add.overlap(this.mario, this.goombas, this.onMarioGoomba, null, this);

    // Mario vs static coins
    this.physics.add.overlap(this.mario, this.staticCoins, this.onMarioCoin, null, this);

    // Mario vs mushrooms
    this.physics.add.collider(this.mushrooms, this.groundLayer);
    this.physics.add.overlap(this.mario, this.mushrooms, this.onMarioMushroom, null, this);

    // Setup camera
    this.cameras.main.setBounds(0, 0, levelData.width * 16 * GAME_CONFIG.SCALE, levelData.height * 16 * GAME_CONFIG.SCALE);
    this.cameras.main.startFollow(this.mario, true, 0.15, 0);
    // NES-style: dead zone so camera doesn't go back left easily
    this.cameras.main.setDeadzone(100, GAME_CONFIG.HEIGHT);

    // Setup flag sprite
    this.flag = this.add.image(this.flagX * 16 * GAME_CONFIG.SCALE - 10 * GAME_CONFIG.SCALE, 4 * 16 * GAME_CONFIG.SCALE, 'flag');
    this.flag.setScale(GAME_CONFIG.SCALE);
    this.flag.setOrigin(0, 0);
    this.flag.setDepth(5);

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyZ = this.input.keyboard.addKey('Z');
    this.keyX = this.input.keyboard.addKey('X');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');
    this.keyW = this.input.keyboard.addKey('W');
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Jump tracking
    this.jumpTimer = 0;
    this.isJumping = false;
    this.wasOnGround = false;
    this.spawnPoint = { x: spawnX, y: spawnY };

    // Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isDead && !this.isLevelClear && this.gameStarted) {
          this.levelTime--;
          if (this.levelTime <= 0) {
            this.mariodie();
          }
        }
      },
      loop: true,
    });

    // HUD (fixed to camera)
    this.hud = this.add.container(0, 0).setScrollFactor(0).setDepth(100);
    this.scoreText = this.add.text(24, 12, 'MARIO\n000000', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
      lineSpacing: 4,
    }).setScrollFactor(0);
    this.coinText = this.add.text(200, 26, '×00', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
    }).setScrollFactor(0);
    this.worldText = this.add.text(340, 12, 'WORLD\n  1-1', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
      lineSpacing: 4,
    }).setScrollFactor(0);
    this.timeText = this.add.text(500, 12, 'TIME\n 400', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
      lineSpacing: 4,
    }).setScrollFactor(0);

    // Coin icon
    this.coinIcon = this.add.rectangle(190, 32, 8, 10, 0xF8B800).setScrollFactor(0);

    // Title overlay
    this.gameStarted = false;
    this.titleGroup = this.add.container(0, 0).setScrollFactor(0).setDepth(200);
    
    const overlay = this.add.rectangle(400, 240, 800, 480, 0x000000, 0.7);
    const title1 = this.add.text(400, 140, 'SUPER MARIO', {
      fontFamily: 'monospace', fontSize: '40px', color: '#B81C1C', fontStyle: 'bold',
    }).setOrigin(0.5);
    const title2 = this.add.text(400, 185, 'DEMO', {
      fontFamily: 'monospace', fontSize: '30px', color: '#F8B800', fontStyle: 'bold',
    }).setOrigin(0.5);
    const startText = this.add.text(400, 300, 'Press ENTER to Start', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
    }).setOrigin(0.5);
    const controlText = this.add.text(400, 360, 'Arrows/WASD: Move | Space/Z: Jump | Shift/X: Run', {
      fontFamily: 'monospace', fontSize: '11px', color: '#888',
    }).setOrigin(0.5);
    
    this.titleGroup.add([overlay, title1, title2, startText, controlText]);

    // Scenery (background)
    this.createScenery(levelData);

    // Handle tile collision from below (head hits)
    this.physics.world.on('tilecollision', (gameObject, tile) => {
      // Not reliable - use manual check in update
    });
  }

  createAnimations() {
    // Mario small
    this.anims.create({ key: 'mario-stand', frames: [{ key: 'mario-small', frame: 0 }], frameRate: 1 });
    this.anims.create({ key: 'mario-walk', frames: this.anims.generateFrameNumbers('mario-small', { start: 1, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'mario-jump', frames: [{ key: 'mario-small', frame: 4 }], frameRate: 1 });
    this.anims.create({ key: 'mario-dead', frames: [{ key: 'mario-small', frame: 6 }], frameRate: 1 });

    // Mario big
    this.anims.create({ key: 'mario-big-stand', frames: [{ key: 'mario-big', frame: 0 }], frameRate: 1 });
    this.anims.create({ key: 'mario-big-walk', frames: this.anims.generateFrameNumbers('mario-big', { start: 1, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'mario-big-jump', frames: [{ key: 'mario-big', frame: 4 }], frameRate: 1 });

    // Goomba
    this.anims.create({ key: 'goomba-walk', frames: this.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: 'goomba-squish', frames: [{ key: 'goomba', frame: 2 }], frameRate: 1 });

    // Coin
    this.anims.create({ key: 'coin-spin', frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
  }

  createScenery(levelData) {
    // Clouds, hills, bushes drawn as simple shapes behind tiles
    const g = this.add.graphics();
    g.setDepth(-10);
    const s = GAME_CONFIG.SCALE;

    // Clouds
    const clouds = [
      [8,2,2],[19,1,3],[36,2,2],[56,1,3],[67,2,2],
      [88,1,2],[108,2,3],[128,1,2],[148,2,3],[168,1,2],
    ];
    g.fillStyle(0xF8F8F8, 1);
    for (const [tx, ty, w] of clouds) {
      const cx = tx * 16 * s;
      const cy = ty * 16 * s;
      const tw = w * 16 * s;
      g.fillCircle(cx + tw * 0.3, cy + 8 * s, 7 * s);
      g.fillCircle(cx + tw * 0.5, cy + 5 * s, 9 * s);
      g.fillCircle(cx + tw * 0.7, cy + 8 * s, 7 * s);
      g.fillRect(cx + 4 * s, cy + 8 * s, tw - 8 * s, 8 * s);
    }

    // Hills
    g.fillStyle(0x58A828, 1);
    const hills = [
      [0, 10, 4], [16, 11, 2], [48, 10, 4], [64, 11, 2],
      [96, 10, 4], [144, 10, 3],
    ];
    for (const [tx, ty, w] of hills) {
      const hx = tx * 16 * s;
      const hy = ty * 16 * s;
      const hw = w * 16 * s;
      const hh = w * 12 * s;
      g.fillTriangle(hx, hy + hh, hx + hw / 2, hy, hx + hw, hy + hh);
    }

    // Bushes
    g.fillStyle(0x00A800, 1);
    const bushes = [
      [11, 12.2, 3], [23, 12.5, 2], [41, 12.2, 3],
      [59, 12.5, 2], [71, 12.2, 3], [103, 12.5, 2], [135, 12.5, 2],
    ];
    for (const [tx, ty, w] of bushes) {
      const bx = tx * 16 * s;
      const by = ty * 16 * s;
      const bw = w * 16 * s;
      g.fillCircle(bx + bw / 2, by + 4 * s, bw / 2 - 2 * s);
      g.fillRect(bx + 2 * s, by + 4 * s, bw - 4 * s, 6 * s);
    }
  }

  update(time, delta) {
    if (!this.gameStarted) {
      if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
        this.gameStarted = true;
        this.titleGroup.setVisible(false);
        this.sound_mgr.init();
      }
      return;
    }

    if (this.isDead || this.isLevelClear || this.isGrowing) {
      this.updateHUD();
      return;
    }

    // Input
    const left = this.cursors.left.isDown || this.keyA.isDown;
    const right = this.cursors.right.isDown || this.keyD.isDown;
    const jumpDown = this.cursors.space.isDown || this.keyZ.isDown || this.cursors.up.isDown || this.keyW.isDown;
    const jumpJust = Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keyZ) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keyW);
    const run = this.keyShift.isDown || this.keyX.isDown;

    const P = GAME_CONFIG.PHYSICS;
    const maxSpeed = (run ? P.MARIO_RUN_SPEED : P.MARIO_WALK_SPEED) * GAME_CONFIG.SCALE;
    const accel = P.MARIO_ACCEL * GAME_CONFIG.SCALE;
    const drag = P.MARIO_DRAG * GAME_CONFIG.SCALE;

    const onGround = this.mario.body.blocked.down;

    // Horizontal movement
    if (right) {
      this.mario.body.setAccelerationX(accel);
      this.mario.setFlipX(false);
    } else if (left) {
      this.mario.body.setAccelerationX(-accel);
      this.mario.setFlipX(true);
    } else {
      this.mario.body.setAccelerationX(0);
      this.mario.body.setDragX(drag);
    }

    // Clamp speed
    if (this.mario.body.velocity.x > maxSpeed) this.mario.body.velocity.x = maxSpeed;
    if (this.mario.body.velocity.x < -maxSpeed) this.mario.body.velocity.x = -maxSpeed;

    // Jump
    if (jumpJust && onGround) {
      const speedBonus = Math.abs(this.mario.body.velocity.x) * P.MARIO_JUMP_SPEED_BONUS;
      this.mario.setVelocityY((P.MARIO_JUMP - speedBonus) * GAME_CONFIG.SCALE);
      this.isJumping = true;
      this.jumpTimer = 0;
      this.sound_mgr.jump();
    }

    // Variable jump height (hold to go higher)
    if (jumpDown && this.isJumping && this.jumpTimer < P.MARIO_JUMP_MAX_HOLD) {
      this.mario.body.velocity.y += P.MARIO_JUMP_HOLD * GAME_CONFIG.SCALE * (delta / 1000);
      this.jumpTimer += delta;
    }

    if (!jumpDown || this.mario.body.velocity.y >= 0) {
      this.isJumping = false;
    }

    if (onGround && this.mario.body.velocity.y >= 0) {
      this.isJumping = false;
    }

    // Check head hit (block from below)
    if (this.mario.body.blocked.up && this.mario.body.velocity.y <= 0) {
      this.checkHeadHit();
    }

    // Animations
    const prefix = this.marioState === 'big' ? 'mario-big-' : 'mario-';
    if (!onGround) {
      this.mario.play(prefix + 'jump', true);
    } else if (Math.abs(this.mario.body.velocity.x) > 10) {
      this.mario.play(prefix + 'walk', true);
      // Adjust walk animation speed based on velocity
      const speed = Math.abs(this.mario.body.velocity.x);
      this.mario.anims.timeScale = Math.max(0.5, speed / (P.MARIO_WALK_SPEED * GAME_CONFIG.SCALE));
    } else {
      this.mario.play(prefix + 'stand', true);
    }

    // Prevent going off left edge of camera
    const camLeft = this.cameras.main.scrollX;
    if (this.mario.x - this.mario.body.halfWidth < camLeft) {
      this.mario.x = camLeft + this.mario.body.halfWidth;
      this.mario.body.velocity.x = 0;
    }

    // Fall death
    if (this.mario.y > 15 * 16 * GAME_CONFIG.SCALE + 64) {
      this.mariodie();
    }

    // Activate goombas near camera
    const camRight = camLeft + GAME_CONFIG.WIDTH + 100;
    this.goombas.getChildren().forEach(g => {
      if (!g.isActive && g.x > camLeft - 50 && g.x < camRight) {
        g.isActive = true;
      }
      if (!g.isActive) {
        g.body.moves = false;
      } else {
        g.body.moves = true;
      }
    });

    // Check flag collision
    if (!this.isLevelClear) {
      const flagWorldX = this.flagX * 16 * GAME_CONFIG.SCALE;
      if (this.mario.x >= flagWorldX - 8 * GAME_CONFIG.SCALE && this.mario.x <= flagWorldX + 16 * GAME_CONFIG.SCALE) {
        this.triggerLevelClear();
      }
    }

    // Invincible flash
    if (this.invincible) {
      this.mario.setAlpha(Math.floor(time / 60) % 2 === 0 ? 0.3 : 1);
    }

    this.updateHUD();
    this.wasOnGround = onGround;
  }

  checkHeadHit() {
    const ts = 16 * GAME_CONFIG.SCALE;
    // Check tile above Mario's head
    const headX = this.mario.x;
    const headY = this.mario.y - this.mario.body.height - 4;

    const tile = this.groundLayer.getTileAtWorldXY(headX, headY);
    if (!tile) return;

    const key = `${tile.x},${tile.y}`;
    if (tile.index === TILE.QUESTION) {
      const content = this.blockContents[key] || 'coin';
      
      // Change to empty block
      tile.index = TILE.QUESTION_EMPTY;
      this.groundLayer.layer.data[tile.y][tile.x].index = TILE.QUESTION_EMPTY;

      // Bump animation
      this.bumpTile(tile);

      if (content === 'coin') {
        this.coins++;
        this.score += 200;
        this.sound_mgr.coin();
        this.spawnCoinEffect(tile.x * ts, (tile.y - 1) * ts);
        this.showScore(tile.x * ts + ts / 2, (tile.y - 1) * ts, 200);
      } else if (content === 'mushroom') {
        this.spawnMushroom(tile.x * ts + ts / 2, tile.y * ts);
        this.sound_mgr.powerup();
      }
    } else if (tile.index === TILE.BRICK) {
      if (this.marioState === 'big') {
        // Break brick
        tile.index = -1;
        this.groundLayer.layer.data[tile.y][tile.x].index = -1;
        this.groundLayer.layer.data[tile.y][tile.x].collides = false;
        tile.setCollision(false);
        this.sound_mgr.breakSound();
        this.score += 50;
        this.spawnBrickParticles(tile.x * ts + ts / 2, tile.y * ts + ts / 2);
      } else {
        this.bumpTile(tile);
        this.sound_mgr.bump();
      }
    }
  }

  bumpTile(tile) {
    const ts = 16 * GAME_CONFIG.SCALE;
    // Phaser tween the tile's y offset
    // We can't directly tween tile y, so we use a workaround:
    // Create a temporary sprite over the tile, hide the tile, animate sprite, then restore
    const worldX = tile.x * ts;
    const worldY = tile.y * ts;
    
    const tempSprite = this.add.image(worldX, worldY, 'tileset', tile.index);
    tempSprite.setScale(GAME_CONFIG.SCALE);
    tempSprite.setOrigin(0, 0);
    tempSprite.setDepth(5);

    // Briefly hide original
    const origIndex = tile.index;

    this.tweens.add({
      targets: tempSprite,
      y: worldY - 8 * GAME_CONFIG.SCALE,
      duration: 80,
      yoyo: true,
      ease: 'Power1',
      onComplete: () => {
        tempSprite.destroy();
        // Ensure the tile still shows the correct index
        this.groundLayer.layer.data[tile.y][tile.x].index = origIndex;
      },
    });
  }

  spawnCoinEffect(x, y) {
    const coin = this.add.sprite(x + 16, y, 'coin', 0);
    coin.setScale(GAME_CONFIG.SCALE);
    coin.play('coin-spin');
    
    this.tweens.add({
      targets: coin,
      y: y - 48 * GAME_CONFIG.SCALE,
      duration: 300,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => coin.destroy(),
    });
  }

  spawnMushroom(x, y) {
    const ts = 16 * GAME_CONFIG.SCALE;
    const m = this.mushrooms.create(x, y - ts, 'mushroom');
    m.setScale(GAME_CONFIG.SCALE);
    m.setOrigin(0.5, 1);
    m.body.setSize(14, 14);
    m.body.setOffset(1, 1);
    m.body.setBounceX(1);

    // Rise from block animation
    m.body.setAllowGravity(false);
    m.body.setVelocity(0, 0);
    
    this.tweens.add({
      targets: m,
      y: m.y - ts,
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        m.body.setAllowGravity(true);
        m.setVelocityX(GAME_CONFIG.PHYSICS.MUSHROOM_SPEED * GAME_CONFIG.SCALE);
      },
    });
  }

  spawnBrickParticles(x, y) {
    const vels = [
      [-150, -400], [150, -400], [-100, -300], [100, -300],
    ];
    for (const [vx, vy] of vels) {
      const p = this.add.rectangle(x, y, 8 * GAME_CONFIG.SCALE, 8 * GAME_CONFIG.SCALE, 0xC84C0C);
      p.setDepth(20);
      this.tweens.add({
        targets: p,
        x: p.x + vx,
        y: p.y + vy,
        duration: 100,
        ease: 'Linear',
        onComplete: () => {
          // Let it fall
          this.tweens.add({
            targets: p,
            y: p.y + 800,
            duration: 800,
            ease: 'Quad.easeIn',
            onComplete: () => p.destroy(),
          });
        },
      });
    }
  }

  showScore(x, y, points) {
    const text = this.add.text(x, y, points.toString(), {
      fontFamily: 'monospace', fontSize: '12px', color: '#fff',
    }).setOrigin(0.5).setDepth(50);
    
    this.tweens.add({
      targets: text,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => text.destroy(),
    });
  }

  onMarioGoomba(mario, goomba) {
    if (this.isDead || this.isGrowing) return;
    if (!goomba.isActive || !goomba.active) return;
    
    // Check if stomping
    if (mario.body.velocity.y > 0 && mario.body.bottom - goomba.body.top < 16 * GAME_CONFIG.SCALE) {
      // Stomp!
      goomba.play('goomba-squish');
      goomba.body.setVelocity(0, 0);
      goomba.body.setAllowGravity(false);
      goomba.body.moves = false;
      
      mario.setVelocityY(GAME_CONFIG.PHYSICS.STOMP_BOUNCE * GAME_CONFIG.SCALE);
      this.score += 100;
      this.sound_mgr.stomp();
      this.showScore(goomba.x, goomba.y - 20, 100);
      
      this.time.delayedCall(500, () => {
        if (goomba && goomba.active) goomba.destroy();
      });
    } else if (!this.invincible) {
      // Take damage
      this.marioDamage();
    }
  }

  onMarioCoin(mario, coin) {
    coin.destroy();
    this.coins++;
    this.score += 200;
    this.sound_mgr.coin();
    this.showScore(coin.x, coin.y - 20, 200);
  }

  onMarioMushroom(mario, mushroom) {
    mushroom.destroy();
    this.score += 1000;
    this.showScore(mushroom.x, mushroom.y - 20, 1000);
    
    if (this.marioState === 'small') {
      this.growMario();
    }
  }

  growMario() {
    this.marioState = 'big';
    this.isGrowing = true;
    this.mario.body.setVelocity(0, 0);
    this.mario.body.setAllowGravity(false);
    this.sound_mgr.powerup();

    // Flash between small and big
    let flashCount = 0;
    const flashInterval = this.time.addEvent({
      delay: 80,
      repeat: 11,
      callback: () => {
        flashCount++;
        if (flashCount % 2 === 0) {
          this.mario.setTexture('mario-big', 0);
          this.mario.body.setSize(14, 30);
          this.mario.body.setOffset(1, 2);
        } else {
          this.mario.setTexture('mario-small', 0);
          this.mario.body.setSize(12, 15);
          this.mario.body.setOffset(2, 1);
        }
      },
    });

    this.time.delayedCall(960, () => {
      this.mario.setTexture('mario-big', 0);
      this.mario.body.setSize(14, 30);
      this.mario.body.setOffset(1, 2);
      this.mario.body.setAllowGravity(true);
      this.isGrowing = false;
      this.mario.play('mario-big-stand');
    });
  }

  marioDamage() {
    if (this.invincible || this.isGrowing) return;
    
    if (this.marioState === 'big') {
      // Shrink
      this.marioState = 'small';
      this.mario.setTexture('mario-small', 0);
      this.mario.body.setSize(12, 15);
      this.mario.body.setOffset(2, 1);
      this.invincible = true;
      this.sound_mgr.bump();
      
      this.time.delayedCall(2000, () => {
        this.invincible = false;
        this.mario.setAlpha(1);
      });
    } else {
      this.mariodie();
    }
  }

  mariodie() {
    if (this.isDead) return;
    this.isDead = true;
    this.lives--;
    this.sound_mgr.die();
    
    this.mario.play('mario-dead');
    this.mario.body.setAllowGravity(false);
    this.mario.body.setVelocity(0, 0);
    this.mario.setDepth(100);
    
    // Classic death: pause, rise, then fall
    this.time.delayedCall(400, () => {
      this.mario.body.setAllowGravity(true);
      this.mario.setVelocityY(-400 * GAME_CONFIG.SCALE);
      this.physics.world.colliders.getActive()
        .filter(c => c.object1 === this.mario || c.object2 === this.mario)
        .forEach(c => c.active = false);
    });

    this.time.delayedCall(3000, () => {
      if (this.lives <= 0) {
        this.showGameOver();
      } else {
        this.scene.restart();
      }
    });
  }

  showGameOver() {
    const overlay = this.add.rectangle(400, 240, 800, 480, 0x000000, 1).setScrollFactor(0).setDepth(200);
    const text = this.add.text(400, 220, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '32px', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    const sub = this.add.text(400, 280, 'Press ENTER to Retry', {
      fontFamily: 'monospace', fontSize: '14px', color: '#fff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.lives = 3;
      this.score = 0;
      this.coins = 0;
      this.scene.restart();
    });
  }

  triggerLevelClear() {
    this.isLevelClear = true;
    this.mario.body.setVelocityX(0);
    this.mario.body.setAccelerationX(0);
    this.sound_mgr.flagpole();
    
    // Score based on height
    const poleTop = 3 * 16 * GAME_CONFIG.SCALE;
    const poleBottom = 12 * 16 * GAME_CONFIG.SCALE;
    const marioY = Math.max(poleTop, Math.min(this.mario.y, poleBottom));
    const ratio = 1 - ((marioY - poleTop) / (poleBottom - poleTop));
    const flagScore = Math.round(ratio * 5000 / 100) * 100;
    this.score += flagScore;
    this.showScore(this.mario.x, this.mario.y - 40, flagScore);

    // Lower flag
    this.tweens.add({
      targets: this.flag,
      y: 12 * 16 * GAME_CONFIG.SCALE,
      duration: 800,
      ease: 'Linear',
    });

    // Mario slides down pole then walks right
    this.mario.body.setAllowGravity(false);
    this.tweens.add({
      targets: this.mario,
      y: 12 * 16 * GAME_CONFIG.SCALE,
      duration: 800,
      ease: 'Linear',
      onComplete: () => {
        this.mario.body.setAllowGravity(true);
        this.mario.setFlipX(false);
        
        const prefix = this.marioState === 'big' ? 'mario-big-' : 'mario-';
        this.mario.play(prefix + 'walk');
        this.mario.setVelocityX(GAME_CONFIG.PHYSICS.MARIO_WALK_SPEED * GAME_CONFIG.SCALE);

        // Count down timer
        this.time.addEvent({
          delay: 30,
          repeat: Math.ceil(this.levelTime),
          callback: () => {
            if (this.levelTime > 0) {
              this.levelTime -= 2;
              this.score += 100;
              if (this.levelTime % 10 === 0) this.sound_mgr.coin();
            }
          },
        });

        // Stop at castle door
        this.time.delayedCall(3000, () => {
          this.mario.body.setVelocity(0, 0);
          this.mario.body.setAccelerationX(0);
          const prefix2 = this.marioState === 'big' ? 'mario-big-' : 'mario-';
          this.mario.play(prefix2 + 'stand');
          
          // Show course clear
          const clearText = this.add.text(400, 100, 'COURSE CLEAR!', {
            fontFamily: 'monospace', fontSize: '24px', color: '#fff', fontStyle: 'bold',
          }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        });
      },
    });
  }

  updateHUD() {
    this.scoreText.setText(`MARIO\n${String(this.score).padStart(6, '0')}`);
    this.coinText.setText(`×${String(this.coins).padStart(2, '0')}`);
    this.timeText.setText(`TIME\n ${String(Math.max(0, Math.ceil(this.levelTime))).padStart(3, '0')}`);
  }
}
