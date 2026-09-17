// Input Manager for keyboard and mouse look controls

export class InputManager {
  constructor(domElement, gameState) {
    this.domElement = domElement;
    this.gameState = gameState;
    
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      sprint: false,
      crouch: false,
      interact: false,
      toggleMap: false,
      pause: false
    };

    this.mouseDelta = { x: 0, y: 0 };
    this.isPointerLocked = false;

    this.onInteractCallback = null;
    this.onToggleMapCallback = null;
    this.onPauseCallback = null;

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    this.domElement.addEventListener('click', () => {
      if (this.gameState.isPlaying() && !this.isPointerLocked) {
        this.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.domElement);
    });
  }

  requestPointerLock() {
    this.domElement.requestPointerLock();
  }

  exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  handleKeyDown(e) {
    const code = e.code;
    
    if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = true;
    if (code === 'KeyS' || code === 'ArrowDown') this.keys.backward = true;
    if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = true;
    if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = true;
    if (code === 'Space') this.keys.jump = true;
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.keys.sprint = true;
    if (code === 'KeyC') this.keys.crouch = true;

    if (code === 'KeyE') {
      if (this.onInteractCallback) this.onInteractCallback();
    }

    if (code === 'KeyM') {
      if (this.onToggleMapCallback) this.onToggleMapCallback();
    }

    if (code === 'Escape') {
      if (this.onPauseCallback) this.onPauseCallback();
    }
  }

  handleKeyUp(e) {
    const code = e.code;
    if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = false;
    if (code === 'KeyS' || code === 'ArrowDown') this.keys.backward = false;
    if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = false;
    if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = false;
    if (code === 'Space') this.keys.jump = false;
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.keys.sprint = false;
    if (code === 'KeyC') this.keys.crouch = false;
  }

  handleMouseMove(e) {
    if (this.isPointerLocked || e.buttons === 1) {
      this.mouseDelta.x += e.movementX * this.gameState.mouseSensitivity;
      this.mouseDelta.y += e.movementY * this.gameState.mouseSensitivity;
    }
  }

  consumeMouseDelta() {
    const delta = { x: this.mouseDelta.x, y: this.mouseDelta.y };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return delta;
  }
}
