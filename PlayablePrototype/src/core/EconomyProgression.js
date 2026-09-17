// Economy, Career Progression, and Vehicle Customization State (Phase 4)
// Pure gameplay-driven credits, garage tokens, and persistent statistics.
export class EconomyProgression {
  constructor() {
    this.credits = 3500;
    this.garageTokens = 50;
    this.playerLevel = 4;
    this.currentXP = 1850;
    this.xpToNextLevel = 2500;

    this.stats = {
      matchesPlayed: 14,
      eliminations: 28,
      wins: 3,
      damageDealt: 5400,
      drivingDistanceKm: 42.5,
      metroJourneys: 8,
      busJourneys: 12,
      missionsCompleted: 5
    };

    this.vehicleCustomization = {
      paintColor: '#ea580c', // Bengaluru Silk Orange
      paintFinish: 'metallic', // 'matte', 'metallic', 'pearlescent'
      rimStyle: 'aero_sport',
      spoilerLevel: 2
    };

    this.loadFromStorage();
  }

  addCredits(amount) {
    this.credits += amount;
    this.addXP(Math.round(amount * 0.4));
    this.saveToStorage();
  }

  addTokens(amount) {
    this.garageTokens += amount;
    this.saveToStorage();
  }

  addXP(amount) {
    this.currentXP += amount;
    if (this.currentXP >= this.xpToNextLevel) {
      this.currentXP -= this.xpToNextLevel;
      this.playerLevel += 1;
      this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.25);
    }
    this.saveToStorage();
  }

  incrementStat(statKey, amount = 1) {
    if (this.stats[statKey] !== undefined) {
      this.stats[statKey] += amount;
      this.saveToStorage();
    }
  }

  saveToStorage() {
    try {
      const data = {
        credits: this.credits,
        garageTokens: this.garageTokens,
        playerLevel: this.playerLevel,
        currentXP: this.currentXP,
        stats: this.stats,
        vehicleCustomization: this.vehicleCustomization
      };
      localStorage.setItem('BLC_PLAYER_PROFILE', JSON.stringify(data));
    } catch (e) {
      // Storage unavailable or disabled
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('BLC_PLAYER_PROFILE');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.credits !== undefined) this.credits = data.credits;
        if (data.garageTokens !== undefined) this.garageTokens = data.garageTokens;
        if (data.playerLevel !== undefined) this.playerLevel = data.playerLevel;
        if (data.currentXP !== undefined) this.currentXP = data.currentXP;
        if (data.stats) Object.assign(this.stats, data.stats);
        if (data.vehicleCustomization) Object.assign(this.vehicleCustomization, data.vehicleCustomization);
      }
    } catch (e) {}
  }
}
