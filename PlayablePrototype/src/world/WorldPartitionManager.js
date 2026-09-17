// Spatial World Partition & Sector Streaming Manager (Phase 5)
// Divides the 600m x 600m Bengaluru open world into a 3x3 sector grid with distance-based HLOD culling.
import * as THREE from 'three';

export class WorldPartitionManager {
  constructor(scene) {
    this.scene = scene;

    // 3x3 Sector Definitions
    this.sectors = [
      { id: 'sector_0_central', name: 'Central Commercial Hub', center: new THREE.Vector3(0, 0, 0), radius: 110, group: new THREE.Group() },
      { id: 'sector_1_east_tech', name: 'Silicon Valley Tech Corridor', center: new THREE.Vector3(200, 0, -100), radius: 140, group: new THREE.Group() },
      { id: 'sector_2_peenya_ind', name: 'Peenya Industrial District', center: new THREE.Vector3(-200, 0, -120), radius: 140, group: new THREE.Group() },
      { id: 'sector_3_residential', name: 'Residency Road & Indiranagar', center: new THREE.Vector3(120, 0, 100), radius: 130, group: new THREE.Group() },
      { id: 'sector_4_majestic_depot', name: 'Majestic Transport Interchange', center: new THREE.Vector3(-120, 0, 100), radius: 130, group: new THREE.Group() },
      { id: 'sector_5_lake', name: 'Ulsoor / Bellandur Lake District', center: new THREE.Vector3(-120, 0, 180), radius: 120, group: new THREE.Group() },
      { id: 'sector_6_west_gate', name: 'West Gate Terminal & Suburbs', center: new THREE.Vector3(-220, 0, 0), radius: 130, group: new THREE.Group() },
      { id: 'sector_7_flyover', name: 'Elevated Expressway Corridor', center: new THREE.Vector3(50, 0, 30), radius: 120, group: new THREE.Group() },
      { id: 'sector_8_outskirts', name: 'North Airport Corridor Outskirts', center: new THREE.Vector3(0, 0, -220), radius: 140, group: new THREE.Group() }
    ];

    this.sectors.forEach(s => this.scene.add(s.group));
    this.activeSectorCount = 9;
  }

  update(playerPos) {
    let activeCount = 0;

    this.sectors.forEach(sector => {
      const dist = sector.center.distanceTo(playerPos);

      if (dist < 160.0) {
        // Near Sector: Full Quality Active
        sector.group.visible = true;
        activeCount++;
      } else if (dist < 320.0) {
        // Medium Sector: Active
        sector.group.visible = true;
        activeCount++;
      } else {
        // Distant Sector: Culled from rendering pipeline to save draw calls
        sector.group.visible = false;
      }
    });

    this.activeSectorCount = activeCount;
  }

  registerActorToClosestSector(actorMesh, worldPos) {
    let closestSector = this.sectors[0];
    let minDist = Infinity;

    this.sectors.forEach(s => {
      const d = s.center.distanceTo(worldPos);
      if (d < minDist) {
        minDist = d;
        closestSector = s;
      }
    });

    closestSector.group.add(actorMesh);
    return closestSector;
  }
}
