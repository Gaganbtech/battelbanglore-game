// Matchmaking Session Manager for Bengaluru: Last City
// Manages queue, session discovery, and local/development simulation transitions

export const EMatchmakingState = Object.freeze({
  Idle: 'Idle',
  Searching: 'Searching',
  Found: 'Found',
  Connecting: 'Connecting',
  Loading: 'Loading',
  Ready: 'Ready',
  MatchStarted: 'MatchStarted'
});

export class MatchmakingManager {
  constructor() {
    this.currentState = EMatchmakingState.Idle;
    this.selectedMode = 'SQUAD'; // 'SOLO', 'DUO', 'SQUAD'
    this.isDevelopmentMode = true; // Local development match simulation
    this.region = 'Asia (Bengaluru DC)';
    this.searchTimer = 0;
    this.stateCallbacks = [];
  }

  setMode(mode) {
    this.selectedMode = mode;
  }

  startMatchmaking(onCompleteCallback = null) {
    this.onComplete = onCompleteCallback;
    this.setState(EMatchmakingState.Searching);

    // Realistic matchmaking progression simulation
    setTimeout(() => {
      this.setState(EMatchmakingState.Found);
      setTimeout(() => {
        this.setState(EMatchmakingState.Connecting);
        setTimeout(() => {
          this.setState(EMatchmakingState.Loading);
          setTimeout(() => {
            this.setState(EMatchmakingState.Ready);
            setTimeout(() => {
              this.setState(EMatchmakingState.MatchStarted);
              if (this.onComplete) this.onComplete(this.selectedMode);
            }, 600);
          }, 800);
        }, 800);
      }, 700);
    }, 1200);
  }

  cancel() {
    this.setState(EMatchmakingState.Idle);
  }

  setState(newState) {
    this.currentState = newState;
    this.stateCallbacks.forEach(cb => cb(this.currentState, this.getStatusLabel()));
  }

  onStateChange(callback) {
    this.stateCallbacks.push(callback);
  }

  getStatusLabel() {
    switch (this.currentState) {
      case EMatchmakingState.Searching:
        return 'Searching for Contenders (100-Player Session)...';
      case EMatchmakingState.Found:
        return 'Session Allocated: [DEV-SIMULATION-BLC-01]';
      case EMatchmakingState.Connecting:
        return 'Connecting to Local Game Instance...';
      case EMatchmakingState.Loading:
        return 'Loading Bengaluru Map Geometry & Weather...';
      case EMatchmakingState.Ready:
        return 'Contenders Ready (100/100)';
      case EMatchmakingState.MatchStarted:
        return 'Deployment Initialized';
      default:
        return 'Ready';
    }
  }
}
