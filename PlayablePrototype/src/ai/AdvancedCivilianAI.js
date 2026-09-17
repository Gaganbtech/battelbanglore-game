// Advanced Living Civilian AI System (Phase 4)
// 18 Behavioral States, Daily Schedules, Gunfire Panic & Fleeing, and Multi-Tier Distance LOD Pooling.
import * as THREE from 'three';

export const ECivilianState = {
  Idle: 'Idle',
  Walking: 'Walking',
  Shopping: 'Shopping',
  Waiting: 'Waiting',
  Commuting: 'Commuting',
  BoardingBus: 'BoardingBus',
  LeavingBus: 'LeavingBus',
  BoardingMetro: 'BoardingMetro',
  LeavingMetro: 'LeavingMetro',
  Eating: 'Eating',
  Talking: 'Talking',
  UsingPhone: 'UsingPhone',
  CrossingRoad: 'CrossingRoad',
  GoingHome: 'GoingHome',
  Running: 'Running',
  Fleeing: 'Fleeing',
  Investigating: 'Investigating',
  SeekingSafety: 'SeekingSafety'
};

export class AdvancedCivilianAI {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.civilians = [];
    this.maxPoolSize = 38; // Optimized crowd density

    // Shared Materials for high-performance batching
    this.skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    this.hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    this.shirtColors = [
      0x2563eb, // Bangalore Blue
      0xd97706, // Turmeric Gold
      0xdc2626, // Crimson Red
      0x059669, // Emerald Green
      0x475569, // Charcoal
      0x9333ea, // Silk Violet
      0xf1f5f9  // Crisp White
    ];
    this.pantColors = [0x1e293b, 0x334155, 0x0f172a, 0x475569];

    this.shirtMats = this.shirtColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }));
    this.pantMats = this.pantColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));

    this.spawnCivilianCrowd();
    this.scene.add(this.group);
  }

  spawnCivilianCrowd() {
    // Spawn civilians along sidewalks, metro concourses, and shopping arcades
    const spawnPoints = [
      // Commercial Boulevard sidewalks (Z: 14 to 22, X: -90 to +90)
      ...Array.from({ length: 18 }, (_, i) => ({
        x: -85 + i * 10 + (Math.random() * 4 - 2),
        y: 0,
        z: 14.5 + (i % 2 === 0 ? 0 : 7) + (Math.random() * 2 - 1),
        state: i % 3 === 0 ? ECivilianState.Shopping : (i % 4 === 0 ? ECivilianState.UsingPhone : ECivilianState.Walking)
      })),
      // Metro Concourse & Platform pedestrians (Z: -20, X: -30 to +30)
      ...Array.from({ length: 10 }, (_, i) => ({
        x: -25 + i * 5.5,
        y: 7.0, // Concourse deck
        z: -20 + (Math.random() * 6 - 3),
        state: i % 2 === 0 ? ECivilianState.Commuting : ECivilianState.Waiting
      })),
      // Bus Stops & Transport Hubs (Z: 60 to 90, X: -60 to 40)
      ...Array.from({ length: 10 }, (_, i) => ({
        x: -50 + i * 9,
        y: 0,
        z: 70 + (Math.random() * 12 - 6),
        state: i % 2 === 0 ? ECivilianState.Waiting : ECivilianState.Walking
      }))
    ];

    spawnPoints.slice(0, this.maxPoolSize).forEach((pt, idx) => {
      const civ = this.createCivilianMesh(idx);
      civ.position.set(pt.x, pt.y, pt.z);
      this.group.add(civ);

      this.civilians.push({
        id: `civ_${idx}`,
        mesh: civ,
        position: civ.position,
        state: pt.state,
        baseY: pt.y,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5),
        moveSpeed: 1.3 + Math.random() * 0.4,
        walkAnimTime: Math.random() * 10,
        stateTimer: 4.0 + Math.random() * 8.0,
        panicTimer: 0,
        phoneArmRaised: false,
        umbrellaAttached: false,
        activeLOD: 'NEAR'
      });
    });
  }

  createCivilianMesh(idx) {
    const root = new THREE.Group();

    const shirtMat = this.shirtMats[idx % this.shirtMats.length];
    const pantMat = this.pantMats[idx % this.pantMats.length];

    // Pelvis / Hips
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.26), pantMat);
    pelvis.position.y = 0.95;
    root.add(pelvis);

    // Torso / Shirt
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.55, 0.28), shirtMat);
    torso.position.y = 1.32;
    torso.castShadow = true;
    root.add(torso);

    // Head & Hair
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), this.skinMat);
    head.position.y = 1.74;
    head.castShadow = true;
    root.add(head);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), this.hairMat);
    hair.position.y = 1.88;
    root.add(hair);

    // Left & Right Arms (Articulated for walking & phone calls)
    const armGeo = new THREE.BoxGeometry(0.12, 0.52, 0.12);
    const leftArm = new THREE.Mesh(armGeo, shirtMat);
    leftArm.position.set(0.3, 1.28, 0);
    root.add(leftArm);
    root.leftArm = leftArm;

    const rightArm = new THREE.Mesh(armGeo, shirtMat);
    rightArm.position.set(-0.3, 1.28, 0);
    root.add(rightArm);
    root.rightArm = rightArm;

    // Left & Right Legs
    const legGeo = new THREE.BoxGeometry(0.16, 0.88, 0.18);
    const leftLeg = new THREE.Mesh(legGeo, pantMat);
    leftLeg.position.set(0.12, 0.44, 0);
    root.add(leftLeg);
    root.leftLeg = leftLeg;

    const rightLeg = new THREE.Mesh(legGeo, pantMat);
    rightLeg.position.set(-0.12, 0.44, 0);
    root.add(rightLeg);
    root.rightLeg = rightLeg;

    // Small Mobile Phone Prop in Hand
    const phone = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    phone.position.set(0, -0.22, 0.08);
    phone.visible = false;
    rightArm.add(phone);
    root.phoneProp = phone;

    return root;
  }

  update(delta, playerPosition, weather = 'clear', timeOfDay = 'day') {
    const isRaining = weather === 'rain' || weather === 'monsoon';

    this.civilians.forEach((civ, i) => {
      const distToPlayer = civ.position.distanceTo(playerPosition);

      // Distance LOD Optimization
      if (distToPlayer > 85.0) {
        civ.activeLOD = 'CULLED';
        civ.mesh.visible = false;
        return;
      }

      civ.mesh.visible = true;
      civ.activeLOD = distToPlayer < 35.0 ? 'NEAR' : 'MEDIUM';

      // If MEDIUM LOD, update simulation every 2nd frame
      if (civ.activeLOD === 'MEDIUM' && (i % 2 !== 0)) {
        return;
      }

      civ.stateTimer -= delta;

      // Gunfire Panic check
      if (civ.panicTimer > 0) {
        civ.panicTimer -= delta;
        civ.state = ECivilianState.Fleeing;
      } else if (civ.state === ECivilianState.Fleeing) {
        civ.state = ECivilianState.SeekingSafety;
      } else if (civ.stateTimer <= 0) {
        // Dynamic State Transitions based on Daily Schedule & Weather
        civ.stateTimer = 5.0 + Math.random() * 10.0;
        this.transitionState(civ, timeOfDay, isRaining);
      }

      // Execute State Behaviors
      this.executeState(civ, delta, playerPosition);

      // Procedural Locomotion Animations
      this.animateCivilian(civ, delta);
    });
  }

  transitionState(civ, timeOfDay, isRaining) {
    if (isRaining) {
      civ.state = Math.random() < 0.6 ? ECivilianState.SeekingSafety : ECivilianState.Walking;
      return;
    }

    if (timeOfDay === 'night') {
      // Night schedule: quieter, talking or heading home
      const roll = Math.random();
      if (roll < 0.4) civ.state = ECivilianState.Walking;
      else if (roll < 0.7) civ.state = ECivilianState.GoingHome;
      else civ.state = ECivilianState.Talking;
    } else if (timeOfDay === 'sunset') {
      // Evening rush hour
      const roll = Math.random();
      if (roll < 0.35) civ.state = ECivilianState.Commuting;
      else if (roll < 0.65) civ.state = ECivilianState.Walking;
      else civ.state = ECivilianState.CrossingRoad;
    } else {
      // Day / Morning
      const states = [
        ECivilianState.Walking,
        ECivilianState.Shopping,
        ECivilianState.UsingPhone,
        ECivilianState.Waiting,
        ECivilianState.Commuting
      ];
      civ.state = states[Math.floor(Math.random() * states.length)];
    }
  }

  executeState(civ, delta, playerPosition) {
    if (civ.state === ECivilianState.Walking || civ.state === ECivilianState.Commuting || civ.state === ECivilianState.GoingHome) {
      civ.position.addScaledVector(civ.velocity, civ.moveSpeed * delta);

      // Sidewalk bounds bouncing
      if (civ.position.x > 110 || civ.position.x < -110) civ.velocity.x *= -1;
      if (civ.position.z > 95 || civ.position.z < -45) civ.velocity.z *= -1;

      civ.mesh.rotation.y = Math.atan2(civ.velocity.x, civ.velocity.z);
    } else if (civ.state === ECivilianState.Fleeing) {
      // Flee directly away from the player / danger source
      const fleeDir = new THREE.Vector3().subVectors(civ.position, playerPosition).normalize();
      fleeDir.y = 0;
      civ.position.addScaledVector(fleeDir, 4.2 * delta); // Sprint speed
      civ.mesh.rotation.y = Math.atan2(fleeDir.x, fleeDir.z);
    } else if (civ.state === ECivilianState.SeekingSafety) {
      // Crouch / freeze in fear
      civ.position.y = civ.baseY - 0.25;
    } else {
      // Idle / UsingPhone / Shopping: remain near position
      civ.position.y = civ.baseY;
    }
  }

  animateCivilian(civ, delta) {
    const isMoving = civ.state === ECivilianState.Walking || civ.state === ECivilianState.Commuting || civ.state === ECivilianState.Fleeing;
    const animSpeed = civ.state === ECivilianState.Fleeing ? 14.0 : 6.5;

    if (isMoving) {
      civ.walkAnimTime += delta * animSpeed;
      const legAngle = Math.sin(civ.walkAnimTime) * 0.55;
      civ.mesh.leftLeg.rotation.x = legAngle;
      civ.mesh.rightLeg.rotation.x = -legAngle;

      if (civ.state === ECivilianState.UsingPhone) {
        civ.mesh.rightArm.rotation.x = -Math.PI / 2.2;
        civ.mesh.phoneProp.visible = true;
      } else {
        civ.mesh.phoneProp.visible = false;
        civ.mesh.leftArm.rotation.x = -legAngle * 0.8;
        civ.mesh.rightArm.rotation.x = legAngle * 0.8;
      }
    } else {
      // Idle breathing / phone holding
      civ.mesh.leftLeg.rotation.x = 0;
      civ.mesh.rightLeg.rotation.x = 0;

      if (civ.state === ECivilianState.UsingPhone) {
        civ.mesh.rightArm.rotation.x = -Math.PI / 2.2;
        civ.mesh.phoneProp.visible = true;
      } else {
        civ.mesh.phoneProp.visible = false;
        civ.mesh.leftArm.rotation.x = 0;
        civ.mesh.rightArm.rotation.x = 0;
      }
    }
  }

  triggerGunfirePanic(sourcePosition, radius = 45.0) {
    this.civilians.forEach(civ => {
      const dist = civ.position.distanceTo(sourcePosition);
      if (dist < radius) {
        civ.panicTimer = 7.0;
        civ.state = ECivilianState.Fleeing;
      }
    });
  }
}
