// Game State machine for Bengaluru: Last City

export const GameModeState = {
  MAIN_MENU: 'MAIN_MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  MAP_OPEN: 'MAP_OPEN',
  SETTINGS: 'SETTINGS'
};

export class GameState {
  constructor() {
    this.currentState = GameModeState.MAIN_MENU;
    this.previousState = GameModeState.MAIN_MENU;
    this.currentZone = 'Zone A: Central Urban';
    this.isInVehicle = false;
    this.activeVehicle = null;
    
    this.timeOfDay = 'day'; // 'day', 'sunset', 'night'
    this.weather = 'clear'; // 'clear', 'rain'
    
    this.health = 100;
    this.maxHealth = 100;
    this.stamina = 100;
    this.maxStamina = 100;
    
    this.mouseSensitivity = 1.0;
    this.fov = 75;
    this.masterVolume = 0.8;
    this.graphicsQuality = 'high'; // 'high', 'medium', 'low'
  }

  setState(newState) {
    if (this.currentState === newState) return;
    this.previousState = this.currentState;
    this.currentState = newState;
  }

  isPlaying() {
    return this.currentState === GameModeState.PLAYING;
  }
}
