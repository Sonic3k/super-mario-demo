// ============================================
// Super Mario Demo - UI / HUD
// ============================================

class GameUI {
  constructor() {
    this.timer = CONFIG.LEVEL_TIME;
    this.timerAccum = 0;
  }

  update(dt) {
    this.timerAccum += dt;
    if (this.timerAccum >= 1) {
      this.timerAccum -= 1;
      this.timer--;
      if (this.timer < 0) this.timer = 0;
    }
  }

  reset() {
    this.timer = CONFIG.LEVEL_TIME;
    this.timerAccum = 0;
  }

  render(ctx, mario) {
    ctx.save();
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = 'bold 16px monospace';
    ctx.textBaseline = 'top';
    
    const y = 12;
    
    // MARIO label + score
    ctx.fillText('MARIO', 24, y);
    ctx.fillText(String(mario.score).padStart(6, '0'), 24, y + 18);
    
    // Coins
    ctx.fillStyle = COLORS.COIN_YELLOW;
    ctx.fillRect(160, y + 20, 8, 10);
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.fillText(`×${String(mario.coins).padStart(2, '0')}`, 170, y + 18);
    
    // World
    ctx.fillText('WORLD', 320, y);
    ctx.fillText('1-1', 336, y + 18);
    
    // Time
    ctx.fillText('TIME', 480, y);
    ctx.fillText(String(Math.max(0, Math.ceil(this.timer))).padStart(3, '0'), 488, y + 18);
    
    // Lives (bottom left when paused or on title)
    
    ctx.restore();
  }

  renderTitle(ctx) {
    ctx.save();
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = COLORS.MARIO_RED;
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUPER MARIO', CONFIG.CANVAS_WIDTH / 2, 140);
    
    ctx.fillStyle = COLORS.QUESTION_YELLOW;
    ctx.font = 'bold 36px monospace';
    ctx.fillText('DEMO', CONFIG.CANVAS_WIDTH / 2, 190);
    
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = '16px monospace';
    ctx.fillText('Press ENTER to Start', CONFIG.CANVAS_WIDTH / 2, 300);
    
    ctx.fillStyle = '#888888';
    ctx.font = '12px monospace';
    ctx.fillText('Arrow Keys: Move  |  Space: Jump  |  Shift: Run', CONFIG.CANVAS_WIDTH / 2, 360);
    ctx.fillText('A/D: Move  |  Z: Jump  |  X: Run', CONFIG.CANVAS_WIDTH / 2, 380);
    
    ctx.restore();
  }

  renderGameOver(ctx, mario) {
    ctx.save();
    
    ctx.fillStyle = COLORS.UI_BLACK;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 30);
    
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${mario.score}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 20);
    ctx.fillText('Press ENTER to Retry', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 60);
    
    ctx.restore();
  }

  renderLevelClear(ctx, mario) {
    ctx.save();
    
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COURSE CLEAR!', CONFIG.CANVAS_WIDTH / 2, 100);
    
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${mario.score}`, CONFIG.CANVAS_WIDTH / 2, 150);
    ctx.fillText(`Time Bonus: ${Math.ceil(this.timer)} × 50 = ${Math.ceil(this.timer) * 50}`, CONFIG.CANVAS_WIDTH / 2, 180);
    
    ctx.restore();
  }

  renderPause(ctx) {
    ctx.save();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    ctx.fillStyle = COLORS.UI_WHITE;
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    
    ctx.font = '14px monospace';
    ctx.fillText('Press ESC to Resume', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 40);
    
    ctx.restore();
  }
}
