// High-Performance Supercar ("Vajra Hypercar") with Nitro Boost, Drift, and Exhaust VFX
import * as THREE from 'three';

export class Supercar {
  constructor(scene, initialPosition = new THREE.Vector3(-15, 0, 18), color = 0xd50000) {
    this.scene = scene;
    this.position = initialPosition.clone();
    this.yaw = Math.PI / 2; // Facing East
    this.speed = 0;
    this.maxForwardSpeed = 48.0; // ~175 km/h normal
    this.nitroTopSpeed = 72.0;    // ~260 km/h nitro boost
    this.maxReverseSpeed = -14.0;
    this.acceleration = 28.0;
    this.nitroAcceleration = 46.0;
    this.brakingDecel = 32.0;
    this.steerSpeed = 2.4;
    this.friction = 5.0;

    this.isOccupied = false;
    this.isNitroActive = false;
    this.nitroFuel = 100.0;
    this.maxNitroFuel = 100.0;
    this.carColor = color;
    this.spoilerType = 'gt'; // 'none', 'stock', 'gt'

    this.flameParticles = [];
    this.mesh = this.buildSupercarMesh();
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;
    this.scene.add(this.mesh);
  }

  buildSupercarMesh() {
    const group = new THREE.Group();

    // Body Material with high gloss car paint shader
    this.paintMaterial = new THREE.MeshStandardMaterial({
      color: this.carColor,
      metalness: 0.85,
      roughness: 0.15
    });

    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x05080d, roughness: 0.05, metalness: 0.95 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xdfa000, metalness: 0.9, roughness: 0.2 }); // Gold BBS rims

    // 1. Sleek Lower Chassis & Aerodynamic Floor
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.45, 2.1), carbonMat);
    chassis.position.y = 0.32;
    chassis.castShadow = true;
    group.add(chassis);

    // Front Splitter
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.15), carbonMat);
    splitter.position.set(2.4, 0.18, 0);
    group.add(splitter);

    // 2. Sculpted Hood & Cockpit
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.9), this.paintMaterial);
    hood.position.set(1.1, 0.65, 0);
    hood.castShadow = true;
    group.add(hood);

    // Cockpit Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 1.45), glassMat);
    roof.position.set(-0.25, 1.05, 0);
    roof.castShadow = true;
    group.add(roof);

    // Rear Engine Cover (Mid-Engine V10 Layout)
    const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.52, 1.95), this.paintMaterial);
    rearDeck.position.set(-1.6, 0.72, 0);
    rearDeck.castShadow = true;
    group.add(rearDeck);

    // 3. Aerodynamic GT Spoiler Wing
    this.spoilerGroup = new THREE.Group();
    const wingStrutL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), carbonMat);
    wingStrutL.position.set(-2.1, 1.05, 0.65);
    this.spoilerGroup.add(wingStrutL);

    const wingStrutR = wingStrutL.clone();
    wingStrutR.position.z = -0.65;
    this.spoilerGroup.add(wingStrutR);

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 2.05), carbonMat);
    wingBlade.position.set(-2.15, 1.35, 0);
    wingBlade.castShadow = true;
    this.spoilerGroup.add(wingBlade);
    group.add(this.spoilerGroup);

    // 4. Performance Wheels & Gold Rims
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 16);
    const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.29, 12);

    const wheelOffsets = [
      [1.45, 1.05],   // Front Left
      [1.45, -1.05],  // Front Right
      [-1.45, 1.05],  // Rear Left
      [-1.45, -1.05]  // Rear Right
    ];

    wheelOffsets.forEach(([wx, wz]) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, 0.42, wz);

      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wGroup.add(rim);

      group.add(wGroup);
    });

    // 5. LED Laser Headlights (Cyan / White)
    const hlMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.2 });
    const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.4), hlMat);
    hlLeft.position.set(2.25, 0.65, 0.72);
    group.add(hlLeft);

    const hlRight = hlLeft.clone();
    hlRight.position.z = -0.72;
    group.add(hlRight);

    // Headlight Spotlights
    this.headlightBeam = new THREE.SpotLight(0x00e5ff, 0, 50, Math.PI / 5, 0.3);
    this.headlightBeam.position.set(2.4, 0.65, 0);
    this.headlightBeam.target.position.set(25, 0, 0);
    group.add(this.headlightBeam);
    group.add(this.headlightBeam.target);

    // 6. Tail & Brake Lights
    this.brakeLightMat = new THREE.MeshStandardMaterial({ color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 0.3 });
    const tailStrip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.8), this.brakeLightMat);
    tailStrip.position.set(-2.38, 0.78, 0);
    group.add(tailStrip);

    // 7. Dual Exhaust Pipes & Nitro Flame Emitters
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9 });
    const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8), exhaustMat);
    pipeL.rotation.z = Math.PI / 2;
    pipeL.position.set(-2.4, 0.42, 0.35);
    group.add(pipeL);

    const pipeR = pipeL.clone();
    pipeR.position.z = -0.35;
    group.add(pipeR);

    // Nitro Flame particle meshes
    this.nitroFlameMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0 });
    this.nitroFlameL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 8), this.nitroFlameMat);
    this.nitroFlameL.rotation.z = Math.PI / 2;
    this.nitroFlameL.position.set(-2.9, 0.42, 0.35);
    group.add(this.nitroFlameL);

    this.nitroFlameR = this.nitroFlameL.clone();
    this.nitroFlameR.position.z = -0.35;
    group.add(this.nitroFlameR);

    return group;
  }

  setPaintColor(hexColor) {
    this.carColor = hexColor;
    if (this.paintMaterial) {
      this.paintMaterial.color.setHex(hexColor);
    }
  }

  setSpoilerType(type) {
    this.spoilerType = type;
    if (this.spoilerGroup) {
      this.spoilerGroup.visible = (type !== 'none');
      if (type === 'stock') {
        this.spoilerGroup.scale.set(0.6, 0.6, 0.7);
      } else {
        this.spoilerGroup.scale.set(1.0, 1.0, 1.0);
      }
    }
  }

  update(delta, inputKeys, audioManager) {
    if (!this.isOccupied) return;

    // Nitro Boost Trigger: Hold Shift while driving
    const wantsNitro = inputKeys.sprint && this.nitroFuel > 5 && this.speed > 8.0;
    if (wantsNitro) {
      this.isNitroActive = true;
      this.nitroFuel = Math.max(0, this.nitroFuel - 32 * delta);
      this.nitroFlameMat.opacity = 0.85 + Math.random() * 0.15;
    } else {
      this.isNitroActive = false;
      this.nitroFuel = Math.min(this.maxNitroFuel, this.nitroFuel + 12 * delta);
      this.nitroFlameMat.opacity = 0;
    }

    const currentTopSpeed = this.isNitroActive ? this.nitroTopSpeed : this.maxForwardSpeed;
    const currentAccel = this.isNitroActive ? this.nitroAcceleration : this.acceleration;

    // Acceleration & Braking
    const isForward = inputKeys.forward;
    const isReverse = inputKeys.backward;
    const isHandbrake = inputKeys.jump;

    if (isForward) {
      this.speed = Math.min(currentTopSpeed, this.speed + currentAccel * delta);
      this.brakeLightMat.emissiveIntensity = 0.3;
    } else if (isReverse) {
      if (this.speed > 0.5) {
        // High-performance carbon ceramic braking
        this.speed = Math.max(0, this.speed - this.brakingDecel * delta);
        this.brakeLightMat.emissiveIntensity = 2.4;
      } else {
        this.speed = Math.max(this.maxReverseSpeed, this.speed - currentAccel * 0.6 * delta);
        this.brakeLightMat.emissiveIntensity = 0.3;
      }
    } else {
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.friction * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.friction * delta);
      }
      this.brakeLightMat.emissiveIntensity = 0.3;
    }

    if (isHandbrake) {
      // Drift handbrake
      this.speed = THREE.MathUtils.lerp(this.speed, 0, delta * 6);
      this.brakeLightMat.emissiveIntensity = 2.6;
    }

    // Steering with drift multiplier
    if (Math.abs(this.speed) > 0.2) {
      const steerDir = (inputKeys.left ? 1 : 0) - (inputKeys.right ? 1 : 0);
      const speedSign = (this.speed >= 0) ? 1 : -1;
      const driftBoost = isHandbrake ? 1.8 : 1.0;
      this.yaw += steerDir * this.steerSpeed * driftBoost * delta * speedSign;
    }

    // Move forward in facing direction
    const forwardX = Math.cos(this.yaw);
    const forwardZ = -Math.sin(this.yaw);

    this.position.x += forwardX * this.speed * delta;
    this.position.z += forwardZ * this.speed * delta;

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;

    // Audio pitch feedback
    if (audioManager) {
      const speedFactor = Math.abs(this.speed) / this.maxForwardSpeed;
      audioManager.playVehicleEngine(speedFactor * (this.isNitroActive ? 1.4 : 1.0));
    }
  }

  getInteractionDistance(playerPos) {
    return this.position.distanceTo(playerPos);
  }
}
