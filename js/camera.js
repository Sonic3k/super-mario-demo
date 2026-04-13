// ============================================
// Super Mario Demo - Camera System
// ============================================

class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.levelWidth = 0;
    this.levelHeight = 0;
    this.viewWidth = CONFIG.CANVAS_WIDTH / CONFIG.SCALE;
    this.viewHeight = CONFIG.CANVAS_HEIGHT / CONFIG.SCALE;
    this.leftEdge = 0; // Camera can't go left of this (NES style)
  }

  init(levelWidth, levelHeight) {
    this.levelWidth = levelWidth * CONFIG.TILE_SIZE;
    this.levelHeight = levelHeight * CONFIG.TILE_SIZE;
  }

  follow(entity) {
    // NES-style: camera follows Mario when he passes the center-left threshold
    const leadX = this.viewWidth * CONFIG.CAMERA.LEAD_X;
    
    this.targetX = entity.x - leadX;
    
    // Camera only moves right (NES behavior) unless we want smooth
    // For quality: allow smooth follow but don't go left of leftEdge
    if (this.targetX > this.leftEdge) {
      this.leftEdge = this.targetX;
    }
    this.targetX = this.leftEdge;
    
    // Smooth interpolation
    this.x += (this.targetX - this.x) * 0.15;
    
    // Clamp
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.viewWidth));
    
    // Y: fixed for this level (no vertical scrolling in 1-1)
    this.y = this.levelHeight - this.viewHeight;
    if (this.y < 0) this.y = 0;
  }

  // For death/reset
  reset() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.leftEdge = 0;
  }

  // World to screen conversion
  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x) * CONFIG.SCALE,
      y: (wy - this.y) * CONFIG.SCALE,
    };
  }
}
