// CityLifeManager - Master Urban Simulation Coordinator (Phase 4)
// Synchronizes time-of-day traffic, civilian density, transit schedules, and dynamic events.
export class CityLifeManager {
  constructor(dayNightCycle, weatherSystem, trafficSystem, civilianAI, metroSystem, bmtcSystem, dynamicEvents) {
    this.dayNightCycle = dayNightCycle;
    this.weatherSystem = weatherSystem;
    this.trafficSystem = trafficSystem;
    this.civilianAI = civilianAI;
    this.metroSystem = metroSystem;
    this.bmtcSystem = bmtcSystem;
    this.dynamicEvents = dynamicEvents;

    this.simTime = 8.0; // 08:00 AM (Morning rush)
    this.timeScale = 0.05; // Progression speed
  }

  update(delta, playerPosition, hud) {
    this.simTime += delta * this.timeScale;
    if (this.simTime >= 24.0) this.simTime = 0.0;

    const currentMode = this.dayNightCycle ? this.dayNightCycle.currentMode : 'day';
    const currentWeather = this.weatherSystem ? this.weatherSystem.currentWeather : 'clear';

    // Update Civilian AI
    if (this.civilianAI) {
      this.civilianAI.update(delta, playerPosition, currentWeather, currentMode);
    }

    // Update Metro System
    if (this.metroSystem) {
      this.metroSystem.update(delta, { position: playerPosition }, hud);
    }

    // Update Dynamic City Events
    if (this.dynamicEvents) {
      this.dynamicEvents.update(delta);
    }
  }

  getTimeFormatted() {
    const hours = Math.floor(this.simTime);
    const minutes = Math.floor((this.simTime - hours) * 60);
    const padH = String(hours).padStart(2, '0');
    const padM = String(minutes).padStart(2, '0');
    return `${padH}:${padM}`;
  }
}
