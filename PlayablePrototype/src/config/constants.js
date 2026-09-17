// Configuration constants for Bengaluru: Last City

export const WORLD = {
  SIZE: 600, // World boundary -300 to +300
  ROAD_WIDTH_MAIN: 24,
  ROAD_WIDTH_SIDE: 14,
  METRO_HEIGHT: 14,
  FLYOVER_HEIGHT: 12
};

export const ZONES = {
  ZONE_A: {
    id: 'zone-a',
    name: 'Zone A: Central Urban (MG Road)',
    color: '#ff9800',
    center: { x: 0, z: 0 },
    radius: 70,
    description: 'Commercial heart with local shopfronts, bustling boulevards and MG Road metro access.'
  },
  ZONE_B: {
    id: 'zone-b',
    name: 'Zone B: IT / Tech Park (Electronic City)',
    color: '#00e5ff',
    center: { x: 120, z: -100 },
    radius: 75,
    description: 'Ultra-modern glass skyscrapers, tech campuses, and manicured corporate plazas.'
  },
  ZONE_C: {
    id: 'zone-c',
    name: 'Zone C: Residential (Indiranagar)',
    color: '#e91e63',
    center: { x: -120, z: -90 },
    radius: 70,
    description: 'Multi-storey apartments with balconies, rooftop water tanks, and tree-lined avenues.'
  },
  ZONE_D: {
    id: 'zone-d',
    name: 'Zone D: Industrial Logistics Hub',
    color: '#795548',
    center: { x: 130, z: 110 },
    radius: 70,
    description: 'Sprawling freight warehouses, container yards, and heavy logistics depot.'
  },
  ZONE_E: {
    id: 'zone-e',
    name: 'Zone E: Elevated Metro Corridor',
    color: '#9c27b0',
    center: { x: 0, z: -20 },
    radius: 180,
    description: 'Continuous elevated viaduct with concrete piers and MG Road Central Station.'
  },
  ZONE_F: {
    id: 'zone-f',
    name: 'Zone F: Elevated Expressway / Flyover',
    color: '#ffeb3b',
    center: { x: 50, z: 20 },
    radius: 120,
    description: 'Four-lane elevated arterial flyover with high-speed ramps and concrete crash barriers.'
  },
  ZONE_G: {
    id: 'zone-g',
    name: 'Zone G: Suburban Buffer & Urban Lake',
    color: '#4caf50',
    center: { x: -120, z: 110 },
    radius: 75,
    description: 'Scenic Bellandur-style urban lake, lush banyan and palm groves, and open recreation trails.'
  }
};

export const PLAYER_CONFIG = {
  WALK_SPEED: 6.0,
  RUN_SPEED: 11.5,
  SPRINT_SPEED: 18.0,
  CROUCH_SPEED: 3.5,
  JUMP_VELOCITY: 10.5,
  GRAVITY: 26.0,
  MAX_HEALTH: 100,
  MAX_STAMINA: 100,
  STAMINA_DRAIN_SPRINT: 24, // Per second
  STAMINA_RECOVERY: 28     // Per second
};

export const CAMERA_CONFIG = {
  DEFAULT_FOV: 75,
  SPRINT_FOV: 88,
  DISTANCE: 4.8,
  HEIGHT: 2.1,
  SHOULDER_OFFSET_X: 0.85,
  ROTATION_SPEED: 0.0024
};
