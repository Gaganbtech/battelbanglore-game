// Battle Royale Match States for Bengaluru: Last City
// Explicit state machine for match lifecycle management

export const EBattleRoyaleMatchState = Object.freeze({
  WaitingForPlayers: 'WaitingForPlayers',   // Matchmaking queue / session discovery
  Preparing: 'Preparing',                   // Pre-match lobby staging area (30s countdown)
  AircraftDeparture: 'AircraftDeparture',   // Cargo plane flight across Bengaluru at Y=280m
  DropPhase: 'DropPhase',                   // Freefall & parachuting onto the island
  ActiveMatch: 'ActiveMatch',               // Core scavenging, combat, vehicle rotations, storm shrinking
  FinalZone: 'FinalZone',                   // Late-game high tension survival circle (<35m radius)
  MatchEnding: 'MatchEnding',               // Winner/Squad determined, slow-mo victory sequence
  MatchComplete: 'MatchComplete'            // Match summary & stats breakdown screen
});

export class MatchStateMachine {
  constructor(initialState = EBattleRoyaleMatchState.WaitingForPlayers) {
    this.currentState = initialState;
    this.previousState = null;
    this.stateTimer = 0;
    this.listeners = [];
  }

  setState(newState) {
    if (this.currentState === newState) return;
    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateTimer = 0;
    
    // Notify registered subscribers
    this.listeners.forEach(cb => cb(this.currentState, this.previousState));
  }

  update(delta) {
    this.stateTimer += delta;
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  isState(state) {
    return this.currentState === state;
  }

  getStateTime() {
    return this.stateTimer;
  }
}
