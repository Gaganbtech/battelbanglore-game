# BENGALURU: LAST CITY
### Professional AAA-Style Open-World Battle Royale Prototype
**Phase 1: Foundation & Playable Vertical Prototype**

---

## 🌆 Overview
**"BENGALURU: LAST CITY"** is an original open-world action Battle Royale game set in a highly detailed, fictionalized and game-optimized recreation inspired by **Bengaluru, India**. 

This is a **100% original intellectual property** featuring:
- Bengaluru-inspired urban infrastructure (flyovers, elevated Namma Metro corridor, commercial boulevards, tech parks, residential apartments with rooftop water tanks, industrial logistics hubs, and urban lakes).
- Local traffic dynamics: iconic yellow-and-green Auto-Rickshaws, BMTC-style transit buses, and civilian cars.
- Third-person player mechanics with realistic acceleration/deceleration locomotion and professional shoulder camera.
- Interactive drivable vehicles.
- Dynamic 24-hour day/night cycle and atmospheric Monsoon Rain weather simulation.
- Dual Architecture:
  1. **Unreal Engine 5 C++ Production Codebase**: Modular gameplay tags, subsystems, data assets, and replication architecture ready for 100-player Battle Royale in Phase 2+.
  2. **Instant Playable 3D Vertical Slice**: High-performance WebGL / Three.js interactive simulation runnable immediately in any browser with zero external dependencies.

---

## 🗺️ Playable Map: 7 Connected Districts
1. **Zone A: Central Urban District (MG Road)** — High-density commercial street, local shop boards, zebra crossings, and vibrant city streetlights.
2. **Zone B: IT / Tech Park (Electronic City)** — Futuristic glass-and-steel skyscrapers, corporate campuses, landscaped avenues, and corporate spires with aviation beacons.
3. **Zone C: Residential District (Indiranagar)** — 3-5 storey apartment complexes with balconies, boundary walls, and signature rooftop PVC water tanks.
4. **Zone D: Industrial Logistics Hub** — Corrugated metal warehouses, shipping container stacks, and cargo loading bays.
5. **Zone E: Elevated Metro Corridor** — Continuous elevated viaduct with concrete hammerhead piers, overhead electric catenary, and the multi-level **MG Road Central Metro Station** with concourse, ticket turnstiles, and purple-line train coaches.
6. **Zone F: Elevated Expressway & Flyover** — Four-lane elevated arterial flyover with high-speed curved on-ramps, crash barriers, and overhead highway signs.
7. **Zone G: Suburban Buffer & Urban Lake** — Scenic Bellandur-style water basin with shoreline promenade and tropical banyan/palm greenery.

---

## 🎮 Controls & Mechanics
| Action | Key | Description |
|---|---|---|
| **Move** | `W` `A` `S` `D` / Arrows | Smooth directional walk and run |
| **Sprint** | `Shift` (Hold) | Sprint with stamina consumption and dynamic camera FOV kick |
| **Jump** | `Space` | Jump with vertical physics and audio feedback |
| **Crouch** | `C` | Low-profile stance with reduced movement speed |
| **Interact / Drive** | `E` | Enter / exit nearby Auto-Rickshaw or Car |
| **Toggle Map** | `M` | Open / close fullscreen District Sector Map with landmarks & BR safe zone |
| **Pause Menu** | `Esc` | Pause simulation, adjust settings, or quit to menu |
| **Look / Orbit** | `Mouse` | Smooth 3rd-person camera rotation with collision avoidance |

---

## 📁 Project Architecture

```
battelbanglore-game/
├── BengaluruLastCity.uproject             # Unreal Engine 5 project descriptor
├── Config/                                # UE5 configuration files
│   ├── DefaultEngine.ini                  # Rendering, World Partition, Lumen/Nanite settings
│   ├── DefaultGame.ini                    # GameMode rules and city simulation limits
│   ├── DefaultInput.ini                   # Enhanced Input actions and mappings
│   └── DefaultGameplayTags.ini            # Gameplay tags for zones, loot tiers, and events
├── Source/BengaluruLastCity/              # Native C++ module architecture
│   ├── BengaluruLastCity.Target.cs
│   ├── BengaluruLastCityEditor.Target.cs
│   ├── BengaluruLastCity.Build.cs
│   ├── BengaluruLastCity.h / .cpp
│   ├── Core/
│   │   ├── BLCGameModeBase.h / .cpp      # GameMode lifecycle & spawn selector
│   │   ├── BLCGameStateBase.h / .cpp     # Replicated world state, weather & safe zone ring
│   │   ├── BLCGameInstance.h / .cpp      # Persistent user settings & scalability
│   │   └── BLCGameTypes.h                # Zone enums, match phases, struct definitions
│   ├── Characters/
│   │   ├── BLCCharacterBase.h / .cpp     # Replicated pawn base
│   │   ├── BLCPlayerCharacter.h / .cpp   # 3rd-person hero with Enhanced Input & camera
│   │   └── BLCCivilianNPC.h / .cpp       # Pedestrian AI pawn
│   ├── Controllers/
│   │   ├── BLCPlayerController.h / .cpp  # Input routing, HUD management & pause menu
│   │   └── BLCNPCController.h / .cpp     # Navigation waypoint controller
│   ├── Components/
│   │   ├── BLCMovementComponent.h / .cpp # Walk/run/sprint/crouch with acceleration
│   │   ├── BLCCameraComponent.h / .cpp   # Shoulder offset camera with collision damping
│   │   ├── BLCHealthStaminaComponent.h   # Replicated health & sprint stamina
│   │   └── BLCInteractionComponent.h     # Sphere trace interaction for vehicles & metro
│   ├── Vehicles/
│   │   └── BLCVehicleBase.h / .cpp       # Replicated vehicle pawn foundation
│   ├── World/
│   │   ├── BLCTimeOfDaySubsystem.h / .cpp# 24-hr day/night cycle world subsystem
│   │   ├── BLCWeatherSubsystem.h / .cpp  # Clear, Cloudy, Monsoon Rain subsystem
│   │   ├── BLCTrafficManager.h / .cpp    # Traffic spline routing & auto-rickshaw pooling
│   │   └── BLCMetroSystem.h / .cpp       # Modular elevated metro infrastructure
│   ├── UI/
│   │   ├── BLCHUD.h / .cpp               # In-game HUD coordinator
│   │   ├── BLCMainMenuWidget.h / .cpp    # Main Menu widget
│   │   └── BLCMapWidget.h / .cpp         # World map & minimap widget
│   └── Data/
│       ├── BLCDataAssets.h / .cpp        # Primary Data Assets for districts & vehicles
│       └── BLCWorldEventTypes.h          # Dynamic event definitions for future BR drops
│
└── PlayablePrototype/                     # 3D Interactive Vertical Prototype (Three.js/WebGL/Vite)
    ├── index.html                        # Canvas host with AAA glassmorphic UI
    ├── package.json                      # Build scripts & dependencies
    ├── vite.config.js                    # Vite dev server configuration
    ├── styles/game.css                   # Modern dark-mode glassmorphic styling
    └── src/
        ├── main.js                       # Game loop, scene, and subsystem orchestrator
        ├── config/constants.js           # World dimensions, zone coordinates, and physics
        ├── core/GameState.js             # State machine (MENU, PLAYING, PAUSED, MAP)
        ├── core/InputManager.js          # Keyboard, mouse look, and pointer lock
        ├── core/AudioManager.js          # Web Audio synthesizer (traffic, rain, engine)
        ├── player/PlayerCharacter.js     # 3D protagonist mesh, locomotion & stamina
        ├── player/ThirdPersonCamera.js   # Shoulder camera, damping, FOV kick & shake
        ├── world/RoadNetwork.js          # Boulevards, markings, streetlights & flyover
        ├── world/MetroSystem.js          # Elevated viaduct, station platform & train
        ├── world/CityBuilder.js          # 7 Bengaluru zones architecture & shopboards
        ├── world/DayNightCycle.js        # Day, Sunset, Night illumination transitions
        ├── world/WeatherSystem.js        # Monsoon Rain particles & wet road reflections
        ├── simulation/TrafficSystem.js   # Auto-rickshaws, BMTC buses & civilian cars
        ├── simulation/CivilianNPCSystem.js # Walking pedestrian crowd AI
        ├── simulation/DrivableVehicle.js # Enterable Auto-Rickshaw with driving physics
        └── ui/                           # HUD, Minimap, Settings, Pause & Main Menu
```

---

## 🚀 How to Launch the Playable Prototype
1. Navigate to the `PlayablePrototype` directory:
   ```bash
   cd PlayablePrototype
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser at:
   ```
   http://127.0.0.1:5173/
   ```

---

## 🔮 Phase 2 Roadmap
- **Supercars & Customization**: High-performance hypercars, suspension tuning, drift physics, and custom garages.
- **100-Player Battle Royale**: Sky drop aircraft flight, loot tiers, inventory management, weapon ballistics, shrinking safe-zone storm wall.
- **Metro Transit Gameplay**: Automated station-to-station train travel, interior carriage combat, and tactical metro-based rotations.
- **Advanced AI**: Law enforcement response AI, hostile militia squads, and intelligent traffic routing.
- **Backend Infrastructure**: Matchmaking, player profiles, and server-authoritative netcode.
