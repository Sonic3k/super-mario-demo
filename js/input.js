// ============================================
// Super Mario Demo - Input System
// ============================================

class InputManager {
  constructor() {
    this.keys = {};
    this.keysPressed = {}; // Just pressed this frame
    this.keysReleased = {}; // Just released this frame
    this.previousKeys = {};
    
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyZ', 'KeyX', 'ShiftLeft', 'Enter', 'Escape'].includes(e.code)) {
        e.preventDefault();
      }
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Lose focus = release all
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  update() {
    this.keysPressed = {};
    this.keysReleased = {};
    
    for (const key in this.keys) {
      if (this.keys[key] && !this.previousKeys[key]) {
        this.keysPressed[key] = true;
      }
      if (!this.keys[key] && this.previousKeys[key]) {
        this.keysReleased[key] = true;
      }
    }
    for (const key in this.previousKeys) {
      if (!this.keys[key] && this.previousKeys[key]) {
        this.keysReleased[key] = true;
      }
    }
    
    this.previousKeys = { ...this.keys };
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isPressed(code) {
    return !!this.keysPressed[code];
  }

  isReleased(code) {
    return !!this.keysReleased[code];
  }

  // Convenience methods
  get left() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); }
  get right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
  get up() { return this.isDown('ArrowUp') || this.isDown('KeyW'); }
  get down() { return this.isDown('ArrowDown') || this.isDown('KeyS'); }
  get jump() { return this.isDown('Space') || this.isDown('KeyZ'); }
  get jumpPressed() { return this.isPressed('Space') || this.isPressed('KeyZ'); }
  get jumpReleased() { return this.isReleased('Space') || this.isReleased('KeyZ'); }
  get run() { return this.isDown('ShiftLeft') || this.isDown('KeyX'); }
  get start() { return this.isPressed('Enter'); }
  get pause() { return this.isPressed('Escape') || this.isPressed('KeyP'); }
}
