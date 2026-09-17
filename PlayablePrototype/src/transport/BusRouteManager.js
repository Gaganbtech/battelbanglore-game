// Bus Route Manager & Autonomous Bus AI Navigation
// BENGALURU: LAST CITY - Phase 2.5 Overhaul
import * as THREE from 'three';

export const BUS_ROUTES = {
  D1: {
    id: 'D1',
    name: 'Route D1: Majestic ⇄ MG Road Central ⇄ Central Market',
    busType: 'double_decker',
    waypoints: [
      { x: -200, z: 8.5, stop: 'Majestic Terminal' },
      { x: -80, z: 8.5, stop: 'Shivajinagar Junction' },
      { x: 0, z: 8.5, stop: 'MG Road Central Metro Interchange' },
      { x: 80, z: 8.5, stop: 'Central Market' },
      { x: 180, z: 8.5, stop: 'Commercial Boulevard East' }
    ]
  },
  D2: {
    id: 'D2',
    name: 'Route D2: MG Road Central ⇄ Electronic City IT Park',
    busType: 'city_bus',
    waypoints: [
      { x: 0, z: -14, stop: 'MG Road Central' },
      { x: 60, z: -40, stop: 'Koramangala Transit' },
      { x: 120, z: -80, stop: 'Silk Board Flyover' },
      { x: 160, z: -120, stop: 'Electronic City Tech Campus' }
    ]
  },
  D3: {
    id: 'D3',
    name: 'Route D3: Central Market ⇄ Kengeri Residential',
    busType: 'electric_bus',
    waypoints: [
      { x: 60, z: 35, stop: 'Central Market' },
      { x: -40, z: 60, stop: 'Vijayanagar Hub' },
      { x: -120, z: 90, stop: 'Kengeri Satellite Town' }
    ]
  }
};

export class BusRouteManager {
  constructor(scene, audioManager, busStopSystem = null) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.busStopSystem = busStopSystem;

    this.routes = BUS_ROUTES;
  }

  updateBusNavigation(bus, delta) {
    const data = bus.userData;
    const route = this.routes[data.routeId] || this.routes.D1;
    const waypoints = route.waypoints;

    if (!data.waypointIndex) data.waypointIndex = 0;
    const targetWp = waypoints[data.waypointIndex];

    const dx = targetWp.x - bus.position.x;
    const dz = targetWp.z - bus.position.z;
    const distToWp = Math.sqrt(dx * dx + dz * dz);

    // AI State Machine: Cruising -> Decelerating / Docking at Stop -> Waiting (Dwell) -> Departing
    if (data.state === 'cruising') {
      // Steer smoothly towards target waypoint
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - bus.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      bus.rotation.y += diff * delta * 2.0;

      // Move forward
      const forwardX = Math.sin(bus.rotation.y);
      const forwardZ = Math.cos(bus.rotation.y);

      bus.position.x += forwardX * data.speed * delta;
      bus.position.z += forwardZ * data.speed * delta;

      // Check approach to bus stop
      if (targetWp.stop && distToWp < 15.0) {
        data.state = 'stopping';
      } else if (distToWp < 4.0) {
        // Next waypoint
        data.waypointIndex = (data.waypointIndex + 1) % waypoints.length;
      }
    } else if (data.state === 'stopping') {
      // Smooth deceleration into bus bay
      data.speed = THREE.MathUtils.lerp(data.speed, 0, delta * 2.2);

      const forwardX = Math.sin(bus.rotation.y);
      const forwardZ = Math.cos(bus.rotation.y);
      bus.position.x += forwardX * data.speed * delta;
      bus.position.z += forwardZ * data.speed * delta;

      if (distToWp < 1.2 || data.speed < 0.4) {
        bus.position.x = targetWp.x;
        bus.position.z = targetWp.z;
        data.speed = 0;
        data.state = 'docked';
        data.dockTimer = 8.5; // 8.5s passenger boarding window

        // Pneumatic air brake release sound
        if (this.audioManager) {
          this.audioManager.playAirBrakeHiss();
        }
      }
    } else if (data.state === 'docked') {
      data.dockTimer -= delta;

      if (data.dockTimer <= 0) {
        data.state = 'departing';
        data.speed = 1.0;
        data.waypointIndex = (data.waypointIndex + 1) % waypoints.length;

        // Pneumatic door chime & departure rumble
        if (this.audioManager) {
          this.audioManager.playUIBeep(560);
        }
      }
    } else if (data.state === 'departing') {
      // Accelerate back to cruising speed
      data.speed = THREE.MathUtils.lerp(data.speed, data.targetSpeed, delta * 1.6);

      const forwardX = Math.sin(bus.rotation.y);
      const forwardZ = Math.cos(bus.rotation.y);
      bus.position.x += forwardX * data.speed * delta;
      bus.position.z += forwardZ * data.speed * delta;

      if (distToWp > 8.0) {
        data.state = 'cruising';
      }
    }
  }
}
