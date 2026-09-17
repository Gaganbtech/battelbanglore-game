// Bengaluru: Last City Strategic Districts & Named Locations
// Defines 13 original tactical zones with distinct loot profiles & geography
import * as THREE from 'three';

export const BENGALURU_DISTRICTS = [
  {
    id: 'DIST_NEXUS',
    name: 'Central Nexus',
    description: 'High-density commercial core with corporate towers and multi-tiered skywalks.',
    center: new THREE.Vector2(0, 0),
    radius: 65,
    lootTier: 'Legendary',
    lootBias: { weapons: 0.35, armor: 0.30, attachments: 0.20, meds: 0.15 },
    color: '#ffb300'
  },
  {
    id: 'DIST_METRO',
    name: 'Metro Crown',
    description: 'Elevated transit interchange with long sniper sightlines along rail tracks.',
    center: new THREE.Vector2(0, -20),
    radius: 50,
    lootTier: 'Epic',
    lootBias: { weapons: 0.40, armor: 0.25, attachments: 0.20, meds: 0.15 },
    color: '#00e5ff'
  },
  {
    id: 'DIST_TECH_VALLEY',
    name: 'Tech Valley',
    description: 'Glass corporate campuses, data servers, and wide parking structures.',
    center: new THREE.Vector2(140, -100),
    radius: 75,
    lootTier: 'Epic',
    lootBias: { weapons: 0.30, armor: 0.25, attachments: 0.30, meds: 0.15 },
    color: '#7c4dff'
  },
  {
    id: 'DIST_SILICON',
    name: 'Silicon District',
    description: 'Modern start-up complexes and innovation centers with abundant tech loot.',
    center: new THREE.Vector2(90, 80),
    radius: 60,
    lootTier: 'Rare',
    lootBias: { weapons: 0.30, armor: 0.25, attachments: 0.25, meds: 0.20 },
    color: '#00b0ff'
  },
  {
    id: 'DIST_WEST_GATE',
    name: 'West Gate',
    description: 'Western arterial highway checkpoint with high vehicle and fuel spawn rate.',
    center: new THREE.Vector2(-160, 20),
    radius: 60,
    lootTier: 'Uncommon',
    lootBias: { weapons: 0.35, armor: 0.20, attachments: 0.20, meds: 0.25 },
    color: '#76ff03'
  },
  {
    id: 'DIST_KENGERI',
    name: 'Kengeri Heights',
    description: 'Elevated southwestern suburban ridge offering commanding tactical vista.',
    center: new THREE.Vector2(-140, 110),
    radius: 70,
    lootTier: 'Uncommon',
    lootBias: { weapons: 0.30, armor: 0.20, attachments: 0.20, meds: 0.30 },
    color: '#c6ff00'
  },
  {
    id: 'DIST_IRONWORKS',
    name: 'Ironworks',
    description: 'Heavy industrial manufacturing warehouses with heavy armor and LMG spawns.',
    center: new THREE.Vector2(-100, -130),
    radius: 70,
    lootTier: 'Rare',
    lootBias: { weapons: 0.45, armor: 0.35, attachments: 0.10, meds: 0.10 },
    color: '#ff9100'
  },
  {
    id: 'DIST_AIRPORT_EDGE',
    name: 'Airport Edge',
    description: 'Open northeastern perimeter runway corridor with fast supercar dragways.',
    center: new THREE.Vector2(160, -160),
    radius: 80,
    lootTier: 'Rare',
    lootBias: { weapons: 0.35, armor: 0.30, attachments: 0.20, meds: 0.15 },
    color: '#ff3d00'
  },
  {
    id: 'DIST_LAKEVIEW',
    name: 'Lakeview District',
    description: 'Scenic water perimeter surrounded by luxury residences and winding alleys.',
    center: new THREE.Vector2(-110, 75),
    radius: 55,
    lootTier: 'Uncommon',
    lootBias: { weapons: 0.25, armor: 0.25, attachments: 0.20, meds: 0.30 },
    color: '#1de9b6'
  },
  {
    id: 'DIST_MARKET',
    name: 'Market Quarter',
    description: 'Bustling labyrinthine bazaars and narrow street stalls with dense close-range loot.',
    center: new THREE.Vector2(40, -50),
    radius: 45,
    lootTier: 'Common',
    lootBias: { weapons: 0.35, armor: 0.20, attachments: 0.15, meds: 0.30 },
    color: '#ffea00'
  },
  {
    id: 'DIST_SKYLINE',
    name: 'Skyline Towers',
    description: 'Ultra-luxury high-rises with rooftop sniper nests and premium armaments.',
    center: new THREE.Vector2(-40, -60),
    radius: 50,
    lootTier: 'Legendary',
    lootBias: { weapons: 0.40, armor: 0.35, attachments: 0.15, meds: 0.10 },
    color: '#ffd600'
  },
  {
    id: 'DIST_EAST_TECH',
    name: 'East Tech Park',
    description: 'Electric bus terminals, tech hubs, and expansive campus plazas.',
    center: new THREE.Vector2(180, 20),
    radius: 65,
    lootTier: 'Rare',
    lootBias: { weapons: 0.30, armor: 0.25, attachments: 0.25, meds: 0.20 },
    color: '#2979ff'
  },
  {
    id: 'DIST_SOUTH_IND',
    name: 'South Industrial Zone',
    description: 'Refineries, heavy storage yards, and sprawling logistic depots.',
    center: new THREE.Vector2(30, 160),
    radius: 75,
    lootTier: 'Rare',
    lootBias: { weapons: 0.40, armor: 0.30, attachments: 0.15, meds: 0.15 },
    color: '#e040fb'
  }
];

export function getDistrictAtPosition(x, z) {
  for (let d of BENGALURU_DISTRICTS) {
    const dist = Math.hypot(x - d.center.x, z - d.center.y);
    if (dist <= d.radius) return d;
  }
  return { id: 'DIST_OUTSKIRTS', name: 'Bengaluru Outskirts', lootTier: 'Common' };
}
