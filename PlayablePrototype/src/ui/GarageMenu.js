// Supercar Customization Garage: 360° vehicle inspection, paint swatches, and performance stats

export class GarageMenu {
  constructor(supercar, audioManager) {
    this.supercar = supercar;
    this.audioManager = audioManager;
    this.modalRoot = document.getElementById('garage-modal');

    this.onTestDriveCallback = null;
    this.onCloseCallback = null;

    this.initDOM();
  }

  initDOM() {
    // Swatches
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const hex = parseInt(e.target.dataset.color, 16);
        this.supercar.setPaintColor(hex);
        this.audioManager.playUIBeep(560);
      });
    });

    // Spoiler Select
    const selectSpoiler = document.getElementById('select-spoiler');
    if (selectSpoiler) {
      selectSpoiler.addEventListener('change', (e) => {
        this.supercar.setSpoilerType(e.target.value);
        this.audioManager.playUIBeep(480);
      });
    }

    // Test Drive Button
    const btnTestDrive = document.getElementById('btn-garage-drive');
    if (btnTestDrive) {
      btnTestDrive.addEventListener('click', () => {
        this.audioManager.playUIBeep(720);
        this.hide();
        if (this.onTestDriveCallback) this.onTestDriveCallback();
      });
    }

    // Close Button
    const btnClose = document.getElementById('btn-garage-close');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.audioManager.playUIBeep(420);
        this.hide();
        if (this.onCloseCallback) this.onCloseCallback();
      });
    }
  }

  show() {
    if (this.modalRoot) this.modalRoot.classList.remove('hidden');
  }

  hide() {
    if (this.modalRoot) this.modalRoot.classList.add('hidden');
  }
}
