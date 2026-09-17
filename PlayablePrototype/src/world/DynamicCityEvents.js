// Dynamic Living Bengaluru City Events System (Phase 4)
// Traffic Accidents, BBMP Road Construction Detours, Bus Breakdowns, Monsoon Waterlogging, and Supercar VIP Convoys.
import * as THREE from 'three';

export class DynamicCityEvents {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.activeEvents = [];

    this.buildTrafficAccidentEvent();
    this.buildRoadConstructionEvent();
    this.buildBusBreakdownEvent();
    this.buildMonsoonWaterloggingEvent();

    this.scene.add(this.group);
  }

  buildTrafficAccidentEvent() {
    const eventGroup = new THREE.Group();
    eventGroup.position.set(15, 0, 16); // Central Boulevard Intersection

    const carMat1 = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 }); // Red sedan
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 }); // Grey sedan
    const cautionMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    // Car 1 (T-boned angle)
    const car1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.2, 1.8), carMat1);
    car1.position.set(0, 0.6, 0);
    car1.rotation.y = Math.PI / 5;
    car1.castShadow = true;
    eventGroup.add(car1);

    // Car 2 (Impacted into side)
    const car2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 1.8), carMat2);
    car2.position.set(2.2, 0.6, 1.2);
    car2.rotation.y = -Math.PI / 3;
    car2.castShadow = true;
    eventGroup.add(car2);

    // Radiator Steam / Smoke Particle Simulation Mesh
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db, transparent: true, opacity: 0.4 });
    const steam = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), steamMat);
    steam.position.set(1.2, 1.4, 0.4);
    eventGroup.add(steam);
    eventGroup.steamMesh = steam;

    // Orange Hazard Warning Reflective Triangles
    [-3.5, 5.0].forEach(tx => {
      const tri = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 3), cautionMat);
      tri.position.set(tx, 0.25, 0);
      eventGroup.add(tri);
    });

    this.group.add(eventGroup);
    this.activeEvents.push({
      id: 'traffic_accident',
      name: 'Central Boulevard Traffic Incident',
      position: eventGroup.position,
      group: eventGroup
    });
  }

  buildRoadConstructionEvent() {
    const eventGroup = new THREE.Group();
    eventGroup.position.set(-35, 0, 42); // Commercial district side-lane

    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }); // BBMP Safety Orange
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });

    // Road Construction Barricades (White & Orange Striped Boards)
    for (let b = -4; b <= 4; b += 2.5) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.15), stripeMat);
      barrier.position.set(b, 0.55, 0);
      barrier.castShadow = true;
      eventGroup.add(barrier);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.25, 0.16), whiteMat);
      stripe.position.set(b, 0.55, 0);
      eventGroup.add(stripe);
    }

    // Safety Traffic Cones
    [-5.5, 5.5].forEach(cx => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 8), stripeMat);
      cone.position.set(cx, 0.35, 1.5);
      eventGroup.add(cone);
    });

    // Heavy Asphalt Roller Machinery Prop
    const rollerBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 1.8), rollerMat);
    rollerBody.position.set(0, 1.4, -3.5);
    eventGroup.add(rollerBody);

    const rollerDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 }));
    rollerDrum.rotation.z = Math.PI / 2;
    rollerDrum.position.set(-1.8, 0.8, -3.5);
    eventGroup.add(rollerDrum);

    this.group.add(eventGroup);
    this.activeEvents.push({
      id: 'road_construction',
      name: 'BBMP Urban Road Resurfacing Works',
      position: eventGroup.position,
      group: eventGroup
    });
  }

  buildBusBreakdownEvent() {
    const eventGroup = new THREE.Group();
    eventGroup.position.set(50, 0, 78); // Outer transit lane curb

    const busMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 }); // BMTC Green
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    // Stalled BMTC Bus on roadside curb
    const bus = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.2, 2.7), busMat);
    bus.position.y = 1.9;
    bus.castShadow = true;
    eventGroup.add(bus);

    // Hazard Flasher Lights (Front and Rear)
    const hazardFL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.2), hazardMat);
    hazardFL.position.set(5.8, 1.2, 1.2);
    eventGroup.add(hazardFL);

    const hazardFR = hazardFL.clone();
    hazardFR.position.z = -1.2;
    eventGroup.add(hazardFR);

    eventGroup.hazardLights = [hazardFL, hazardFR];

    this.group.add(eventGroup);
    this.activeEvents.push({
      id: 'bus_breakdown',
      name: 'BMTC Transit Breakdown on Ring Road',
      position: eventGroup.position,
      group: eventGroup
    });
  }

  buildMonsoonWaterloggingEvent() {
    const puddleGroup = new THREE.Group();
    puddleGroup.position.set(-15, 0.05, -70); // Low-lying industrial road section

    // Reflective Road Water Puddle (High-Shine Water Material)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.04,
      metalness: 0.95,
      transparent: true,
      opacity: 0.8
    });

    const puddle = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 8.5, 0.02, 24), waterMat);
    puddle.position.y = 0.01;
    puddleGroup.add(puddle);

    this.group.add(puddleGroup);
    this.activeEvents.push({
      id: 'monsoon_waterlogging',
      name: 'Monsoon Underpass Waterlogging',
      position: puddleGroup.position,
      group: puddleGroup
    });
  }

  update(delta) {
    const time = performance.now() * 0.005;

    // Hazard blinkers pulse
    const isBlinkOn = Math.sin(time * 3) > 0;
    this.activeEvents.forEach(ev => {
      if (ev.group.hazardLights) {
        ev.group.hazardLights.forEach(hl => {
          hl.material.color.setHex(isBlinkOn ? 0xf59e0b : 0x451a03);
        });
      }
      if (ev.group.steamMesh) {
        ev.group.steamMesh.scale.setScalar(1.0 + Math.sin(time * 2) * 0.2);
      }
    });
  }
}
