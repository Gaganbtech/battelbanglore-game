// Bengaluru Civilian Pedestrian AI Population
import * as THREE from 'three';

export class CivilianNPCSystem {
  constructor(scene) {
    this.scene = scene;
    this.civilians = [];
    this.group = new THREE.Group();

    this.spawnCivilianPopulation();
    this.scene.add(this.group);
  }

  spawnCivilianPopulation() {
    const shirtColors = [0xef5350, 0x42a5f5, 0x66bb6a, 0xffa726, 0xab47bc, 0x8d6e63, 0xffffff];
    const pantColors = [0x37474f, 0x263238, 0x455a64, 0x546e7a];
    const skinTones = [0x8d5524, 0xc68642, 0xe0ac69, 0xa66336];

    // Spawn 20 civilians along the sidewalks of Zone A and Zone B
    for (let i = 0; i < 22; i++) {
      const skin = skinTones[i % skinTones.length];
      const shirt = shirtColors[i % shirtColors.length];
      const pants = pantColors[i % pantColors.length];

      const npc = this.createNPCMesh(skin, shirt, pants);
      
      // Place along sidewalks
      const sx = (i % 2 === 0 ? 1 : -1) * (15 + (i % 6) * 12);
      const sz = -40 + (i * 9);
      npc.group.position.set(sx, 0, sz);

      npc.walkSpeed = 1.6 + Math.random() * 0.8;
      npc.walkCycle = Math.random() * Math.PI * 2;
      npc.walkDirection = (Math.random() > 0.5) ? 1 : -1;
      npc.isWalkingAlongZ = (i % 2 === 0);

      this.civilians.push(npc);
      this.group.add(npc.group);
    }
  }

  createNPCMesh(skinColor, shirtColor, pantColor) {
    const group = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
    const pantMat = new THREE.MeshStandardMaterial({ color: pantColor, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.28), shirtMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.28), skinMat);
    head.position.y = 0.52;
    head.castShadow = true;
    torso.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), hairMat);
    hair.position.set(0, 0.14, 0);
    head.add(hair);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.14, 0.6, 0.14);
    const leftArm = new THREE.Mesh(armGeo, shirtMat);
    leftArm.position.set(-0.32, 0, 0);
    torso.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, shirtMat);
    rightArm.position.set(0.32, 0, 0);
    torso.add(rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
    const leftLeg = new THREE.Mesh(legGeo, pantMat);
    leftLeg.position.set(-0.14, 0.35, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantMat);
    rightLeg.position.set(0.14, 0.35, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    return { group, leftLeg, rightLeg, leftArm, rightArm, torso };
  }

  update(delta, playerPosition) {
    this.civilians.forEach(npc => {
      // Distance to player
      const distToPlayer = npc.group.position.distanceTo(playerPosition);
      const isNearPlayer = distToPlayer < 4.0;

      // Animate walking
      const speedMult = isNearPlayer ? 1.6 : 1.0;
      npc.walkCycle += delta * (npc.walkSpeed * 3.5 * speedMult);

      const swing = Math.sin(npc.walkCycle) * 0.45;
      npc.leftLeg.rotation.x = swing;
      npc.rightLeg.rotation.x = -swing;
      npc.leftArm.rotation.x = -swing * 0.8;
      npc.rightArm.rotation.x = swing * 0.8;

      // Move along sidewalk
      if (npc.isWalkingAlongZ) {
        npc.group.position.z += npc.walkSpeed * delta * npc.walkDirection * speedMult;
        npc.group.rotation.y = (npc.walkDirection > 0) ? 0 : Math.PI;
        if (Math.abs(npc.group.position.z) > 130) {
          npc.walkDirection *= -1;
        }
      } else {
        npc.group.position.x += npc.walkSpeed * delta * npc.walkDirection * speedMult;
        npc.group.rotation.y = (npc.walkDirection > 0) ? Math.PI / 2 : -Math.PI / 2;
        if (Math.abs(npc.group.position.x) > 130) {
          npc.walkDirection *= -1;
        }
      }
    });
  }
}
