// Ground Loot Spawner distributing holographic loot crates & beacons across Bengaluru landmarks
import * as THREE from 'three';

export class LootSpawner {
  constructor(scene) {
    this.scene = scene;
    this.crates = [];
    this.group = new THREE.Group();

    this.spawnLootCrates();
    this.scene.add(this.group);
  }

  spawnLootCrates() {
    const locations = [
      { x: 12, y: 0.5, z: 22, name: 'AR-9 Bangalore Special & Ammo' },
      { x: 135, y: 0.5, z: -80, name: 'High-Tier Armor & Nitro Boost Tanks' },
      { x: 4, y: 14.5, z: -20, name: 'Metro Supply Cache (Heavy Armor)' },
      { x: 50, y: 11.2, z: 35, name: 'Flyover Tactical Airdrop Crate' },
      { x: -110, y: 0.5, z: 75, name: 'Lake Perimeter Survival Stash' }
    ];

    locations.forEach(loc => {
      const crate = this.createCrateMesh(loc.x, loc.y, loc.z, loc.name);
      this.crates.push(crate);
      this.group.add(crate.mesh);
    });
  }

  createCrateMesh(x, y, z, name) {
    const crateGroup = new THREE.Group();
    crateGroup.position.set(x, y, z);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xff8f00,
      emissiveIntensity: 0.5
    });

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });

    // Crate chest box
    const chest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.2), goldMat);
    chest.castShadow = true;
    crateGroup.add(chest);

    // Reinforcing corner brackets
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.2, 1.25), blackMat);
    crateGroup.add(bracket);

    // Vertical Hologram Laser Beacon Beam reaching into the sky
    const beamGeo = new THREE.CylinderGeometry(0.15, 0.15, 60, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 30;
    crateGroup.add(beam);

    return {
      mesh: crateGroup,
      position: new THREE.Vector3(x, y, z),
      name,
      isOpened: false
    };
  }

  update(delta) {
    // Gentle floating bob and beacon pulse
    this.crates.forEach(c => {
      c.mesh.rotation.y += delta * 0.8;
    });
  }

  getClosestCrate(playerPos, maxDist = 3.5) {
    for (let crate of this.crates) {
      if (!crate.isOpened && crate.position.distanceTo(playerPos) < maxDist) {
        return crate;
      }
    }
    return null;
  }
}
