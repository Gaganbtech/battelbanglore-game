// AAA Production Realistic Humanoid Character Model & 8-Directional Locomotion IK System
// BENGALURU: LAST CITY - Phase 5 Master Production Overhaul
import * as THREE from 'three';
import { PlayerCharacter } from './PlayerCharacter.js';

export class RealisticHumanoidCharacter extends PlayerCharacter {
  constructor(scene, gameState, audioManager) {
    super(scene, gameState, audioManager);

    // Additional Phase 5 Polish
    this.recoilPitch = 0.0;
    this.recoilYaw = 0.0;
    this.idleBreathing = 0.0;
    this.isParachuting = false;

    // Add extra tactical details to existing mesh
    this.enhanceTacticalGear();
  }

  enhanceTacticalGear() {
    // 1. IFAK (Individual First Aid Kit) pouch on right vest waist
    const ifakMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // OD Green / Coyote Tan tactical pouch
      roughness: 0.75,
      metalness: 0.08
    });
    const ifak = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), ifakMat);
    ifak.position.set(0.19, 0.10, -0.06);
    this.pelvis.add(ifak);

    // Red Cross emblem patch on IFAK
    const patchMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const patchV = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.04, 0.005), patchMat);
    patchV.position.set(0.24, 0.10, -0.06);
    this.pelvis.add(patchV);
    const patchH = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.005), patchMat);
    patchH.position.set(0.24, 0.10, -0.06);
    this.pelvis.add(patchH);

    // 2. Sculpted Brow Ridge for intense combat gaze
    const browGeo = new THREE.BoxGeometry(0.11, 0.025, 0.05);
    const brow = new THREE.Mesh(browGeo, this.skinMat);
    brow.position.set(0, 0.155, 0.13);
    this.head.add(brow);

    // 3. Tourniquet holder on left upper arm
    const tqMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.4
    });
    const tq = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.05, 12), tqMat);
    tq.position.set(0, -0.06, 0);
    this.leftUpperArm.add(tq);

    // 4. Tactical Sunglasses / Ballistic Eye Protection
    const glassesFrameMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.2,
      metalness: 0.9
    });
    const glassesLensMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0
    });

    const glassesFrame = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.025, 0.04), glassesFrameMat);
    glassesFrame.position.set(0, 0.138, 0.145);
    this.head.add(glassesFrame);

    [-0.038, 0.038].forEach(gx => {
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.01), glassesLensMat);
      lens.position.set(gx, 0.13, 0.15);
      this.head.add(lens);
    });
  }

  applyWeaponRecoil(recoilAmount = 0.08) {
    this.recoilPitch += recoilAmount;
    this.recoilYaw += (Math.random() - 0.5) * recoilAmount * 0.4;
  }

  setParachuting(state) {
    this.isParachuting = state;
  }

  update(delta, inputKeys, cameraYaw, cameraPitch = 0, isAiming = false, colliders = []) {
    // Apply recoil recovery spring
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, delta * 15);
    this.recoilYaw = THREE.MathUtils.lerp(this.recoilYaw, 0, delta * 15);

    // Idle breathing cycle
    this.idleBreathing += delta * 2.2;
    const breatheY = Math.sin(this.idleBreathing) * 0.008;
    const breatheChest = Math.sin(this.idleBreathing) * 0.015;

    // Call parent update
    super.update(delta, inputKeys, cameraYaw, cameraPitch + this.recoilPitch, isAiming, colliders);

    // Apply secondary breathing and recoil to upper spine
    if (!this.isMoving && this.isGrounded) {
      this.spine.position.y = 0.14 + breatheY;
      this.chest.rotation.x = this.aimPitch * 0.45 + breatheChest + this.recoilPitch;
    }

    // Parachute descent pose if airborne in freefall/chute
    if (this.isParachuting) {
      this.pelvis.position.y = 1.05;
      this.leftThigh.rotation.x = -0.35;
      this.rightThigh.rotation.x = -0.35;
      this.leftKnee.rotation.x = 0.6;
      this.rightKnee.rotation.x = 0.6;
      this.leftUpperArm.rotation.z = 1.4;
      this.rightUpperArm.rotation.z = -1.4;
      this.leftUpperArm.rotation.x = -0.6;
      this.rightUpperArm.rotation.x = -0.6;
    }
  }
}
