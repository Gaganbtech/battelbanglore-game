// Open-World Missions & Urban Activities Framework (Phase 4)
// 6 Missions, Waypoint Navigation, Speed Radar Traps, and Hidden Garages.
import * as THREE from 'three';

export class MissionManager {
  constructor(scene, audioManager, economy) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.economy = economy;
    this.group = new THREE.Group();

    this.missions = [
      {
        id: 'mission_lost_signal',
        title: 'Lost Signal',
        category: 'Exploration',
        description: 'Ascend to the Skyline Tech Tower rooftop to reboot the emergency broadcast relay.',
        targetPos: new THREE.Vector3(110, 28, -50),
        rewardCredits: 1200,
        rewardTokens: 25,
        status: 'AVAILABLE'
      },
      {
        id: 'mission_last_bus',
        title: 'Last Bus to Electronic City',
        category: 'Timed Transit',
        description: 'Race across the city to Majestic Central Bus Depot before the departing express bus leaves.',
        targetPos: new THREE.Vector3(-60, 0, 95),
        timeLimit: 90.0,
        rewardCredits: 1500,
        rewardTokens: 30,
        status: 'AVAILABLE'
      },
      {
        id: 'mission_metro_blackout',
        title: 'Metro Blackout',
        category: 'Investigation',
        description: 'Investigate the electrical power substation failure at MG Road Central Metro concourse.',
        targetPos: new THREE.Vector3(0, 7.2, -20),
        rewardCredits: 1000,
        rewardTokens: 20,
        status: 'AVAILABLE'
      },
      {
        id: 'mission_warehouse_recovery',
        title: 'Warehouse Recovery',
        category: 'Recovery',
        description: 'Infiltrate the Peenya Industrial Warehouse mezzanine to secure the classified prototype core.',
        targetPos: new THREE.Vector3(-100, 5.4, -120),
        rewardCredits: 2000,
        rewardTokens: 40,
        status: 'AVAILABLE'
      },
      {
        id: 'mission_convoy_run',
        title: 'Convoy Run',
        category: 'Vehicle Escort',
        description: 'Escort a high-value tech parts transport along the Outer Ring Road.',
        targetPos: new THREE.Vector3(65, 0, 42),
        rewardCredits: 1800,
        rewardTokens: 35,
        status: 'AVAILABLE'
      },
      {
        id: 'mission_emergency_route',
        title: 'Emergency Route',
        category: 'Delivery',
        description: 'Navigate through flooded streets and construction detours to deliver medical plasma.',
        targetPos: new THREE.Vector3(-35, 0, 42),
        rewardCredits: 1400,
        rewardTokens: 25,
        status: 'AVAILABLE'
      }
    ];

    this.activeMission = null;
    this.missionTimer = 0;

    // Build 3D Waypoint Visual Marker (Glowing Beaming Column)
    this.waypointMesh = this.buildWaypointMarker();
    this.waypointMesh.visible = false;
    this.group.add(this.waypointMesh);

    // Build Speed Trap Radars along Boulevard
    this.speedTraps = [
      { position: new THREE.Vector3(0, 0, 14), name: 'MG Road Radar Trap 01', speedLimit: 75 },
      { position: new THREE.Vector3(60, 0, 70), name: 'Ring Road Radar Trap 02', speedLimit: 85 }
    ];

    this.scene.add(this.group);
  }

  buildWaypointMarker() {
    const markerGroup = new THREE.Group();

    // Glowing Neon Beacon Column
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 16, 16), beamMat);
    beam.position.y = 8;
    markerGroup.add(beam);

    // Rotating Diamond Ring at Base
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.15, 8, 24), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.5;
    markerGroup.add(ring);
    markerGroup.ring = ring;

    return markerGroup;
  }

  startMission(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission) return false;

    this.activeMission = mission;
    this.activeMission.status = 'IN_PROGRESS';
    this.missionTimer = mission.timeLimit || 0;

    this.waypointMesh.position.copy(mission.targetPos);
    this.waypointMesh.visible = true;

    if (this.audioManager) this.audioManager.playUIBeep(880);
    return true;
  }

  update(delta, playerPos, vehicleSpeed = 0, hud) {
    if (!this.activeMission) return;

    // Animate Waypoint Marker
    const time = performance.now() * 0.003;
    if (this.waypointMesh.ring) {
      this.waypointMesh.ring.rotation.z = time;
    }

    // Timer check
    if (this.activeMission.timeLimit) {
      this.missionTimer -= delta;
      if (this.missionTimer <= 0) {
        this.failMission(hud);
        return;
      }
    }

    // Check Distance to Waypoint
    const dist = playerPos.distanceTo(this.activeMission.targetPos);
    if (dist < 4.8) {
      this.completeMission(hud);
    }
  }

  completeMission(hud) {
    if (!this.activeMission) return;

    const mission = this.activeMission;
    mission.status = 'COMPLETED';
    this.waypointMesh.visible = false;

    if (this.economy) {
      this.economy.addCredits(mission.rewardCredits);
      this.economy.addTokens(mission.rewardTokens);
      this.economy.incrementStat('missionsCompleted');
    }

    if (this.audioManager) {
      this.audioManager.playUIBeep(880);
      setTimeout(() => this.audioManager.playUIBeep(1100), 120);
    }

    if (hud) {
      hud.triggerKillfeed(`Mission Complete: ${mission.title} (+${mission.rewardCredits} Credits, +${mission.rewardTokens} Tokens)`);
    }

    this.activeMission = null;
  }

  failMission(hud) {
    if (!this.activeMission) return;
    const mission = this.activeMission;
    mission.status = 'FAILED';
    this.waypointMesh.visible = false;

    if (hud) {
      hud.triggerKillfeed(`Mission Failed: ${mission.title} (Time Expired)`);
    }

    this.activeMission = null;
  }
}
