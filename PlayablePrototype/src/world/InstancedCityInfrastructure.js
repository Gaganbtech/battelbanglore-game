// Ultra-High-Performance Instanced City Infrastructure (Phase 5)
// Consolidates thousands of individual draw calls into GPU Instanced Meshes:
// Streetlights, Road Markings, Medians, Bengaluru Rain Trees, Split ACs, and Rooftop Tanks.
import * as THREE from 'three';

export class InstancedCityInfrastructure {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.buildInstancedStreetlights();
    this.buildInstancedRoadMarkings();
    this.buildInstancedMedians();
    this.buildInstancedBengaluruVegetation();
    this.buildInstancedBuildingClutter();

    this.scene.add(this.group);
  }

  buildInstancedStreetlights() {
    // 32 Streetlights along Boulevards
    const polePositions = [
      [-180, 14], [-140, 14], [-100, 14], [-60, 14], [-20, 14], [20, 14], [60, 14], [100, 14], [140, 14], [180, 14],
      [-180, -14], [-140, -14], [-100, -14], [-60, -14], [-20, -14], [20, -14], [60, -14], [100, -14], [140, -14], [180, -14],
      [14, -140], [14, -100], [14, -60], [14, 60], [14, 100], [14, 140],
      [-14, -140], [-14, -100], [-14, -60], [-14, 60], [-14, 100], [-14, 140]
    ];
    const count = polePositions.length;

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xfef08a, emissiveIntensity: 0.35 });

    // 1. Instanced Vertical Poles (Single Draw Call)
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8);
    const instPoles = new THREE.InstancedMesh(poleGeo, poleMat, count);
    instPoles.receiveShadow = true;

    // 2. Instanced Lamp Fixtures (Single Draw Call)
    const lampGeo = new THREE.BoxGeometry(0.4, 0.22, 0.85);
    const instLamps = new THREE.InstancedMesh(lampGeo, lampMat, count);

    const dummy = new THREE.Object3D();
    polePositions.forEach(([px, pz], i) => {
      // Pole transform
      dummy.position.set(px, 3.75, pz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instPoles.setMatrixAt(i, dummy.matrix);

      // Lamp fixture transform
      const armOffsetZ = pz > 0 ? -1.5 : 1.5;
      dummy.position.set(px, 7.4, pz + armOffsetZ);
      dummy.updateMatrix();
      instLamps.setMatrixAt(i, dummy.matrix);
    });

    instPoles.instanceMatrix.needsUpdate = true;
    instLamps.instanceMatrix.needsUpdate = true;

    this.group.add(instPoles);
    this.group.add(instLamps);
  }

  buildInstancedRoadMarkings() {
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // 1. Instanced White Dashed Lane Lines (EW & NS Roads)
    const dashPositions = [];
    for (let x = -270; x <= 270; x += 14) {
      if (Math.abs(x) < 22 || Math.abs(x - 110) < 16 || Math.abs(x + 110) < 16) continue;
      dashPositions.push({ x: x, y: 0.03, z: 4.8, rotY: 0, scaleX: 7.0, scaleZ: 0.35 });
      dashPositions.push({ x: x, y: 0.03, z: -4.8, rotY: 0, scaleX: 7.0, scaleZ: 0.35 });
    }
    for (let z = -270; z <= 270; z += 14) {
      if (Math.abs(z) < 22 || Math.abs(z - 100) < 16 || Math.abs(z + 90) < 16) continue;
      dashPositions.push({ x: 4.8, y: 0.03, z: z, rotY: Math.PI / 2, scaleX: 7.0, scaleZ: 0.35 });
      dashPositions.push({ x: -4.8, y: 0.03, z: z, rotY: Math.PI / 2, scaleX: 7.0, scaleZ: 0.35 });
    }

    const dashGeo = new THREE.PlaneGeometry(1, 1);
    const instDashes = new THREE.InstancedMesh(dashGeo, whiteMat, dashPositions.length);

    const dummy = new THREE.Object3D();
    dashPositions.forEach((pos, i) => {
      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.rotation.set(-Math.PI / 2, 0, pos.rotY);
      dummy.scale.set(pos.scaleX, pos.scaleZ, 1);
      dummy.updateMatrix();
      instDashes.setMatrixAt(i, dummy.matrix);
    });
    instDashes.instanceMatrix.needsUpdate = true;
    this.group.add(instDashes);

    // 2. Instanced Zebra Crossing Stripes at Central Intersection (Single Draw Call)
    const zebraStripes = [];
    // North crossing
    for (let i = -9; i <= 9; i += 1.8) {
      zebraStripes.push({ x: i, z: -17, rotY: 0 });
      zebraStripes.push({ x: i, z: 17, rotY: 0 });
      zebraStripes.push({ x: -17, z: i, rotY: Math.PI / 2 });
      zebraStripes.push({ x: 17, z: i, rotY: Math.PI / 2 });
    }

    const zebraGeo = new THREE.PlaneGeometry(1.1, 7.5);
    const instZebra = new THREE.InstancedMesh(zebraGeo, whiteMat, zebraStripes.length);
    zebraStripes.forEach((pos, i) => {
      dummy.position.set(pos.x, 0.04, pos.z);
      dummy.rotation.set(-Math.PI / 2, 0, pos.rotY);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instZebra.setMatrixAt(i, dummy.matrix);
    });
    instZebra.instanceMatrix.needsUpdate = true;
    this.group.add(instZebra);
  }

  buildInstancedMedians() {
    // Bengaluru Signature Black & Yellow Concrete Medians
    const medianPositions = [];
    for (let x = -260; x <= 260; x += 12) {
      if (Math.abs(x) < 24 || Math.abs(x - 110) < 18 || Math.abs(x + 110) < 18) continue;
      medianPositions.push({ x, z: 0, rotY: 0 });
    }
    for (let z = -260; z <= 260; z += 12) {
      if (Math.abs(z) < 24 || Math.abs(z - 100) < 18 || Math.abs(z + 90) < 18) continue;
      medianPositions.push({ x: 0, z, rotY: Math.PI / 2 });
    }

    const medianMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    const medianGeo = new THREE.BoxGeometry(11.6, 0.4, 1.2);
    const instMedians = new THREE.InstancedMesh(medianGeo, medianMat, medianPositions.length);
    instMedians.receiveShadow = true;

    const dummy = new THREE.Object3D();
    medianPositions.forEach((pos, i) => {
      dummy.position.set(pos.x, 0.2, pos.z);
      dummy.rotation.set(0, pos.rotY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instMedians.setMatrixAt(i, dummy.matrix);
    });
    instMedians.instanceMatrix.needsUpdate = true;
    this.group.add(instMedians);
  }

  buildInstancedBengaluruVegetation() {
    // Lush Rain Trees (Samanea saman) & Gulmohar Trees along Boulevards
    const treePositions = [];
    for (let x = -240; x <= 240; x += 32) {
      if (Math.abs(x) < 30 || Math.abs(x - 110) < 20 || Math.abs(x + 110) < 20) continue;
      treePositions.push({ x: x + 4, z: 18.5, scale: 0.9 + Math.random() * 0.3 });
      treePositions.push({ x: x - 4, z: -18.5, scale: 0.9 + Math.random() * 0.3 });
      treePositions.push({ x: 18.5, z: x + 4, scale: 0.9 + Math.random() * 0.3 });
      treePositions.push({ x: -18.5, z: x - 4, scale: 0.9 + Math.random() * 0.3 });
    }

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Bengaluru lush tropical green
      roughness: 0.75,
      metalness: 0.05
    });

    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 5.5, 8);
    const foliageGeo = new THREE.DodecahedronGeometry(3.8, 1);

    const instTrunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treePositions.length);
    const instFoliage = new THREE.InstancedMesh(foliageGeo, foliageMat, treePositions.length);

    instTrunks.castShadow = true;
    instFoliage.castShadow = true;

    const dummy = new THREE.Object3D();
    treePositions.forEach((pos, i) => {
      // Trunk
      dummy.position.set(pos.x, 2.75 * pos.scale, pos.z);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.scale.set(pos.scale, pos.scale, pos.scale);
      dummy.updateMatrix();
      instTrunks.setMatrixAt(i, dummy.matrix);

      // Canopy
      dummy.position.set(pos.x, 6.5 * pos.scale, pos.z);
      dummy.rotation.set(Math.random() * 0.2, Math.random() * Math.PI, 0);
      dummy.scale.set(pos.scale, pos.scale * 0.85, pos.scale);
      dummy.updateMatrix();
      instFoliage.setMatrixAt(i, dummy.matrix);
    });

    instTrunks.instanceMatrix.needsUpdate = true;
    instFoliage.instanceMatrix.needsUpdate = true;

    this.group.add(instTrunks);
    this.group.add(instFoliage);
  }

  buildInstancedBuildingClutter() {
    // Instanced AC Outdoor Units across Commercial and Residential Facades
    const acPositions = [];
    for (let x = -80; x <= 80; x += 26) {
      for (let floor = 8; floor <= 36; floor += 8) {
        acPositions.push({ x: x + 6, y: floor, z: 27.8 });
        acPositions.push({ x: x - 6, y: floor, z: 27.8 });
      }
    }

    const acMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.5, metalness: 0.3 });
    const acGeo = new THREE.BoxGeometry(0.85, 0.55, 0.4);
    const instAC = new THREE.InstancedMesh(acGeo, acMat, acPositions.length);

    const dummy = new THREE.Object3D();
    acPositions.forEach((pos, i) => {
      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instAC.setMatrixAt(i, dummy.matrix);
    });
    instAC.instanceMatrix.needsUpdate = true;
    this.group.add(instAC);

    // Instanced Black Sintex Water Tanks on Commercial/Residential Roofs
    const tankPositions = [];
    for (let x = -80; x <= 80; x += 26) {
      tankPositions.push({ x: x + 4, y: 38, z: 35 });
      tankPositions.push({ x: x - 4, y: 38, z: 35 });
    }

    const tankMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
    const tankGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.8, 12);
    const instTanks = new THREE.InstancedMesh(tankGeo, tankMat, tankPositions.length);

    tankPositions.forEach((pos, i) => {
      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instTanks.setMatrixAt(i, dummy.matrix);
    });
    instTanks.instanceMatrix.needsUpdate = true;
    this.group.add(instTanks);
  }
}
