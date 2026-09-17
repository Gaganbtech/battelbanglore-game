// Main Menu, Settings modal, and Pause Menu controller
import { GameModeState } from '../core/GameState.js';

export class MainMenu {
  constructor(gameState, audioManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;

    // Elements
    this.menuRoot = document.getElementById('main-menu');
    this.settingsModal = document.getElementById('settings-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.districtMapModal = document.getElementById('district-map-modal');

    this.onStartGame = null;
    this.onResumeGame = null;
    this.onQuitToMenu = null;

    this.initEvents();
  }

  initEvents() {
    // Play Button
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.audioManager.init();
        this.audioManager.playUIBeep(640);
        this.hideMenu();
        if (this.onStartGame) this.onStartGame();
      });
    }

    // Settings Button
    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        this.audioManager.playUIBeep(520);
        this.showSettings();
      });
    }

    // Exit Button
    const btnExit = document.getElementById('btn-exit');
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        this.audioManager.playUIBeep(350);
        alert('Thank you for exploring Bengaluru: Last City (Phase 1 Prototype).');
      });
    }

    // Settings Save Button
    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        this.audioManager.playUIBeep(600);
        this.saveSettings();
        this.hideSettings();
      });
    }

    // Settings Sliders & Inputs
    const sliderSens = document.getElementById('slider-mouse-sens');
    const labelSens = document.getElementById('label-mouse-sens');
    if (sliderSens) {
      sliderSens.addEventListener('input', (e) => {
        this.gameState.mouseSensitivity = parseFloat(e.target.value);
        if (labelSens) labelSens.innerText = `${e.target.value}x`;
      });
    }

    const sliderFov = document.getElementById('slider-fov');
    const labelFov = document.getElementById('label-fov');
    if (sliderFov) {
      sliderFov.addEventListener('input', (e) => {
        this.gameState.fov = parseInt(e.target.value);
        if (labelFov) labelFov.innerText = `${e.target.value}°`;
      });
    }

    const sliderVol = document.getElementById('slider-volume');
    const labelVol = document.getElementById('label-volume');
    if (sliderVol) {
      sliderVol.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.gameState.masterVolume = val / 100;
        this.audioManager.setMasterVolume(this.gameState.masterVolume);
        if (labelVol) labelVol.innerText = `${val}%`;
      });
    }

    // Pause Menu Buttons
    const btnResume = document.getElementById('btn-pause-resume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        this.audioManager.playUIBeep(580);
        this.hidePauseMenu();
        if (this.onResumeGame) this.onResumeGame();
      });
    }

    const btnPauseSettings = document.getElementById('btn-pause-settings');
    if (btnPauseSettings) {
      btnPauseSettings.addEventListener('click', () => {
        this.audioManager.playUIBeep(520);
        this.hidePauseMenu();
        this.showSettings();
      });
    }

    const btnPauseQuit = document.getElementById('btn-pause-quit');
    if (btnPauseQuit) {
      btnPauseQuit.addEventListener('click', () => {
        this.audioManager.playUIBeep(400);
        this.hidePauseMenu();
        this.showMenu();
        if (this.onQuitToMenu) this.onQuitToMenu();
      });
    }

    // Map Close Button
    const btnCloseMap = document.getElementById('btn-close-map');
    if (btnCloseMap) {
      btnCloseMap.addEventListener('click', () => {
        this.audioManager.playUIBeep(500);
        this.hideWorldMap();
      });
    }
  }

  showMenu() {
    if (this.menuRoot) {
      this.menuRoot.classList.remove('hidden');
    }
    this.gameState.setState(GameModeState.MAIN_MENU);
  }

  hideMenu() {
    if (this.menuRoot) {
      this.menuRoot.classList.add('hidden');
    }
  }

  showSettings() {
    if (this.settingsModal) this.settingsModal.classList.remove('hidden');
  }

  hideSettings() {
    if (this.settingsModal) this.settingsModal.classList.add('hidden');
  }

  saveSettings() {
    const selGraphics = document.getElementById('select-graphics');
    if (selGraphics) {
      this.gameState.graphicsQuality = selGraphics.value;
    }
  }

  showPauseMenu() {
    if (this.pauseModal) this.pauseModal.classList.remove('hidden');
    this.gameState.setState(GameModeState.PAUSED);
  }

  hidePauseMenu() {
    if (this.pauseModal) this.pauseModal.classList.add('hidden');
    this.gameState.setState(GameModeState.PLAYING);
  }

  showWorldMap() {
    if (this.districtMapModal) this.districtMapModal.classList.remove('hidden');
    this.gameState.setState(GameModeState.MAP_OPEN);
  }

  hideWorldMap() {
    if (this.districtMapModal) this.districtMapModal.classList.add('hidden');
    this.gameState.setState(GameModeState.PLAYING);
  }
}
