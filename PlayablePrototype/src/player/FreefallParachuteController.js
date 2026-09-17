// Freefall & Steerable Parachute Flight Controller for Bengaluru: Last City
// Simulates aerodynamic freefall descent, canopy steering, and smooth landing compression
import * as THREE from 'three';

export const EAirFlightState = Object.freeze({
  None: 'None',
  Freefall: 'Freefall',
  Parachute: 'Parachute',
  Landed: 'Landed'
});

export class FreefallParachuteController {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.state = EAirFlightState.None;

    // Aerodynamic Physics Constants
    this.terminalFreefallSpeed = 58.0; // m/s
    this.diveFreefallSpeed = 74.0;     // m/s when looking steep down
    this.parachuteGlideSpeed = 12.5;   // m/s forward glide
    this.parachuteFallSpeed = 5.5;     // m/s vertical descent
    this.autoDeployAltitude = 65.0;    // Forced parachute deployment

    // State Tracking
    this.altitude = 260.0;
    this.currentSpeed = 0.0;
    this.glideYaw = 0.0;
    this.canopyRoll = 0.0;

    // Parachute 3D Canopy Mesh
    this.canopyGroup = this.buildParachuteMesh();
    this.scene.add(this.canopyGroup);
    this.canopyGroup.visible = false;
  }

  buildParachuteMesh() {
    const root = new THREE.Group();

    // High-visibility Tactical Canopy (Bengaluru Gold & Matte Slate)
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    const camoMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });

    // Curved Rectangular Aerofoil Canopy (Span: 8.5m, Chord: 3.8m)
    const canopyGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.8, 16, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.position.y = 4.6;
    root.add(canopy);

    // Center cell stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 3.8), camoMat);
    stripe.position.y = 6.8;
    root.add(stripe);

    // Suspension Lines (Risers to Harness)
    const lineGeo = new THREE.CylinderGeometry(0.015, 0.015, 4.2, 4);
    const cornerOffsets = [
      [-3.5, 4.2, -1.6],
      [3.5, 4.2, -1.6],
      [-3.5, 4.2, 1.6],
      [3.5, 4.2, 1.6]
    ];

    cornerOffsets.forEach(pos => {
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(pos[0] * 0.5, pos[1] * 0.5, pos[2] * 0.5);
      line.lookAt(0, 0, 0);
      root.add(line);
    });

    return root;
  }

  startDrop(initialPos) {
    this.state = EAirFlightState.Freefall;
    this.altitude = initialPos.y;
    this.currentSpeed = 30.0;
    this.canopyGroup.visible = false;
  }

  deployParachute() {
    if (this.state === EAirFlightState.Freefall) {
      this.state = EAirFlightState.Parachute;
      this.canopyGroup.visible = true;
      if (this.audioManager) {
        this.audioManager.playAirBrakeHiss();
        this.audioManager.playUIBeep(660);
      }
    }
  }

  update(delta, player, inputKeys, cameraYaw, cameraPitch, onTouchdown = null) {
    if (this.state === EAirFlightState.None || this.state === EAirFlightState.Landed) return;

    this.altitude = player.position.y;
    this.glideYaw = cameraYaw;

    // 1. FREEFALL DYNAMICS
    if (this.state === EAirFlightState.Freefall) {
      // Steep dive if camera pitch is low
      const isDiving = cameraPitch < -0.3;
      const targetFallSpeed = isDiving ? this.diveFreefallSpeed : this.terminalFreefallSpeed;
      const forwardDrive = isDiving ? 22.0 : 14.0;

      player.velocity.y = THREE.MathUtils.lerp(player.velocity.y, -targetFallSpeed, delta * 4.0);

      // Horizontal steering in freefall
      const forwardX = Math.sin(cameraYaw);
      const forwardZ = Math.cos(cameraYaw);
      player.velocity.x = forwardX * forwardDrive;
      player.velocity.z = forwardZ * forwardDrive;

      // Freefall torso aerodynamic tilt
      player.mesh.rotation.y = cameraYaw;
      if (player.torso) {
        player.torso.rotation.x = Math.PI / 2.8; // Horizontal skydiving spread
      }

      this.currentSpeed = Math.hypot(player.velocity.x, player.velocity.y, player.velocity.z);

      // Auto-deploy parachute at safe altitude
      if (player.position.y <= this.autoDeployAltitude) {
        this.deployParachute();
      }
    }

    // 2. PARACHUTE CANOPY GLIDE DYNAMICS
    if (this.state === EAirFlightState.Parachute) {
      // Smoothly decelerate vertical fall
      player.velocity.y = THREE.MathUtils.lerp(player.velocity.y, -this.parachuteFallSpeed, delta * 3.5);

      // Steerable forward drive
      let forwardMultiplier = 1.0;
      if (inputKeys.forward) forwardMultiplier = 1.4;
      if (inputKeys.backward) forwardMultiplier = 0.5;

      // Banking turns
      let turnRoll = 0.0;
      if (inputKeys.left) turnRoll = -0.25;
      if (inputKeys.right) turnRoll = 0.25;
      this.canopyRoll = THREE.MathUtils.lerp(this.canopyRoll, turnRoll, delta * 6.0);

      const glideDirX = Math.sin(cameraYaw);
      const glideDirZ = Math.cos(cameraYaw);
      player.velocity.x = glideDirX * (this.parachuteGlideSpeed * forwardMultiplier);
      player.velocity.z = glideDirZ * (this.parachuteGlideSpeed * forwardMultiplier);

      // Sync canopy mesh above player
      this.canopyGroup.position.copy(player.position);
      this.canopyGroup.rotation.y = cameraYaw;
      this.canopyGroup.rotation.z = this.canopyRoll;

      // Upright dangling legs posture
      player.mesh.rotation.y = cameraYaw;
      if (player.torso) {
        player.torso.rotation.x = 0.1;
      }

      this.currentSpeed = Math.hypot(player.velocity.x, player.velocity.y, player.velocity.z);
    }

    // 3. LANDING TRANSITION
    if (player.position.y <= 1.2) {
      player.position.y = 0.05;
      player.velocity.set(0, 0, 0);
      player.mesh.position.copy(player.position);

      this.state = EAirFlightState.Landed;
      this.canopyGroup.visible = false;

      // Reset character model posture
      if (player.torso) player.torso.rotation.x = 0.0;

      if (this.audioManager) {
        this.audioManager.playFootstep();
      }

      if (onTouchdown) onTouchdown();
    }
  }

  isDropping() {
    return this.state === EAirFlightState.Freefall || this.state === EAirFlightState.Parachute;
  }
}
