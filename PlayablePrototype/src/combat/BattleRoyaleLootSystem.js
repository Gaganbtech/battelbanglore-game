// Tiered Battle Royale Loot System for Bengaluru: Last City
// Generates randomized weapons, L1-L3 armor & helmets, attachments, and medical supplies
import * as THREE from 'three';
import { getDistrictAtPosition } from '../world/BengaluruDistricts.js';

export const ELootRarity = Object.freeze({
  Common: { name: 'Common', color: 0x9ca3af, hex: '#9ca3af' },
  Uncommon: { name: 'Uncommon', color: 0x22c55e, hex: '#22c55e' },
  Rare: { name: 'Rare', color: 0x3b82f6, hex: '#3b82f6' },
  Epic: { name: 'Epic', color: 0xa855f7, hex: '#a855f7' },
  Legendary: { name: 'Legendary', color: 0xeab308, hex: '#eab308' }
});

export const LOOT_CATALOG = [
  // 1. WEAPONS
  { id: 'wep_ar9', name: 'AR-9 Bangalore Special', category: 'weapon', weaponKey: 'ar9', caliber: '5.56mm', rarity: ELootRarity.Uncommon },
  { id: 'wep_kestrel', name: 'Kestrel Carbine', category: 'weapon', weaponKey: 'kestrel', caliber: '5.56mm', rarity: ELootRarity.Rare },
  { id: 'wep_raven', name: 'Raven-45 Heavy Pistol', category: 'weapon', weaponKey: 'raven', caliber: '9mm', rarity: ELootRarity.Common },
  { id: 'wep_pulse9', name: 'Pulse-9 Submachine Gun', category: 'weapon', weaponKey: 'pulse9', caliber: '9mm', rarity: ELootRarity.Uncommon },
  { id: 'wep_longshot', name: 'Longshot-50 Anti-Material Sniper', category: 'weapon', weaponKey: 'longshot', caliber: '.50cal', rarity: ELootRarity.Legendary },

  // 2. HELMETS (L1-L3)
  { id: 'helm_l1', name: 'Tactical Helmet (Level 1)', category: 'helmet', level: 1, damageReduction: 0.30, durability: 80, rarity: ELootRarity.Common },
  { id: 'helm_l2', name: 'Military SpecOps Helmet (Level 2)', category: 'helmet', level: 2, damageReduction: 0.40, durability: 150, rarity: ELootRarity.Rare },
  { id: 'helm_l3', name: 'Spetsnaz Ballistic Mask (Level 3)', category: 'helmet', level: 3, damageReduction: 0.55, durability: 230, rarity: ELootRarity.Legendary },

  // 3. BODY ARMOR (L1-L3)
  { id: 'vest_l1', name: 'Police Patrol Vest (Level 1)', category: 'armor', level: 1, damageReduction: 0.20, durability: 100, rarity: ELootRarity.Common },
  { id: 'vest_l2', name: 'Reinforced Commando Armor (Level 2)', category: 'armor', level: 2, damageReduction: 0.30, durability: 180, rarity: ELootRarity.Rare },
  { id: 'vest_l3', name: 'Juggernaut Composite Rig (Level 3)', category: 'armor', level: 3, damageReduction: 0.45, durability: 250, rarity: ELootRarity.Epic },

  // 4. BACKPACKS (L1-L3)
  { id: 'pack_l1', name: 'Assault Pack (Level 1)', category: 'backpack', level: 1, capacity: 150, rarity: ELootRarity.Common },
  { id: 'pack_l2', name: 'Expedition Rucksack (Level 2)', category: 'backpack', level: 2, capacity: 200, rarity: ELootRarity.Rare },
  { id: 'pack_l3', name: 'Field Command Pack (Level 3)', category: 'backpack', level: 3, capacity: 270, rarity: ELootRarity.Epic },

  // 5. ATTACHMENTS
  { id: 'att_comp', name: 'Titanium Compensator', category: 'attachment', slot: 'muzzle', recoilReduction: 0.25, rarity: ELootRarity.Rare },
  { id: 'att_supp', name: 'Tactical Suppressor', category: 'attachment', slot: 'muzzle', noiseReduction: 0.70, rarity: ELootRarity.Epic },
  { id: 'att_extmag', name: 'Extended Quickdraw Mag', category: 'attachment', slot: 'magazine', bonusCapacity: 10, rarity: ELootRarity.Rare },
  { id: 'att_grip', name: 'Angled Ergonomic Foregrip', category: 'attachment', slot: 'grip', adsSpeedBonus: 0.20, rarity: ELootRarity.Uncommon },
  { id: 'att_scope4x', name: '4x Tactical ACOG Scope', category: 'attachment', slot: 'optic', zoomLevel: 4, rarity: ELootRarity.Rare },
  { id: 'att_scope8x', name: '8x High-Caliber Marksman Scope', category: 'attachment', slot: 'optic', zoomLevel: 8, rarity: ELootRarity.Legendary },

  // 6. HEALING & BOOST
  { id: 'med_bandage', name: 'Sterile Field Bandages (x5)', category: 'med', healAmount: 10, useTime: 3.0, rarity: ELootRarity.Common },
  { id: 'med_firstaid', name: 'Trauma First Aid Kit', category: 'med', healAmount: 75, useTime: 5.5, rarity: ELootRarity.Rare },
  { id: 'med_medkit', name: 'Full Military Medkit', category: 'med', healAmount: 100, useTime: 7.5, rarity: ELootRarity.Epic },
  { id: 'med_drink', name: 'Bengaluru Rush Energy Drink', category: 'boost', boostAmount: 40, useTime: 3.5, rarity: ELootRarity.Common },
  { id: 'med_pills', name: 'High-Concentration Painkillers', category: 'boost', boostAmount: 60, useTime: 5.0, rarity: ELootRarity.Uncommon },

  // 7. AMMUNITION
  { id: 'ammo_556', name: '5.56mm NATO Rounds (x60)', category: 'ammo', caliber: '5.56mm', count: 60, rarity: ELootRarity.Common },
  { id: 'ammo_762', name: '7.62mm Soviet Rounds (x60)', category: 'ammo', caliber: '7.62mm', count: 60, rarity: ELootRarity.Common },
  { id: 'ammo_9mm', name: '9mm Parabellum Rounds (x60)', category: 'ammo', caliber: '9mm', count: 60, rarity: ELootRarity.Common },
  { id: 'ammo_50', name: '.50 Cal Armor Piercing (x15)', category: 'ammo', caliber: '.50cal', count: 15, rarity: ELootRarity.Legendary }
];

export class BattleRoyaleLootSystem {
  constructor(scene) {
    this.scene = scene;
    this.lootItems = [];
    this.group = new THREE.Group();

    this.spawnDistrictLootDistribution();
    this.scene.add(this.group);
  }

  spawnDistrictLootDistribution() {
    // Distribute 40+ strategic ground loot stashes across Bengaluru buildings & streets
    const spawnPoints = [
      // Central Nexus
      { x: 10, y: 0.5, z: 20 }, { x: -15, y: 0.5, z: 12 }, { x: 30, y: 0.5, z: -25 },
      // Metro Crown & Platforms
      { x: 4, y: 14.5, z: -20 }, { x: 25, y: 14.5, z: -20 }, { x: -22, y: 14.5, z: -20 },
      // Tech Valley & Offices
      { x: 135, y: 0.5, z: -80 }, { x: 150, y: 0.5, z: -110 }, { x: 120, y: 0.5, z: -95 },
      // Silicon District
      { x: 85, y: 0.5, z: 75 }, { x: 105, y: 0.5, z: 90 },
      // West Gate & Checkpoints
      { x: -155, y: 0.5, z: 15 }, { x: -170, y: 0.5, z: 28 },
      // Kengeri Heights
      { x: -135, y: 0.5, z: 105 }, { x: -150, y: 0.5, z: 120 },
      // Ironworks Industrial Depots
      { x: -95, y: 0.5, z: -125 }, { x: -110, y: 0.5, z: -140 }, { x: -80, y: 0.5, z: -130 },
      // Airport Runway Corridor
      { x: 155, y: 0.5, z: -150 }, { x: 175, y: 0.5, z: -170 },
      // Lakeview Perimeter
      { x: -105, y: 0.5, z: 70 }, { x: -120, y: 0.5, z: 85 },
      // Market Quarter Bazaars
      { x: 35, y: 0.5, z: -45 }, { x: 48, y: 0.5, z: -55 },
      // Skyline Towers Helipads
      { x: -40, y: 28.0, z: -60 }, { x: -35, y: 0.5, z: -55 },
      // East Tech Terminals
      { x: 175, y: 0.5, z: 15 }, { x: 190, y: 0.5, z: 30 },
      // South Industrial Refineries
      { x: 25, y: 0.5, z: 155 }, { x: 40, y: 0.5, z: 170 }
    ];

    spawnPoints.forEach((pt, idx) => {
      const district = getDistrictAtPosition(pt.x, pt.z);
      // Select loot item filtered by district rarity tier
      let pool = LOOT_CATALOG;
      if (district.lootTier === 'Legendary') {
        pool = LOOT_CATALOG.filter(i => i.rarity === ELootRarity.Legendary || i.rarity === ELootRarity.Epic);
      } else if (district.lootTier === 'Epic') {
        pool = LOOT_CATALOG.filter(i => i.rarity === ELootRarity.Epic || i.rarity === ELootRarity.Rare);
      }

      const item = pool[Math.floor(Math.random() * pool.length)] || LOOT_CATALOG[idx % LOOT_CATALOG.length];
      const lootObj = this.createLootMesh(pt.x, pt.y, pt.z, item);
      this.lootItems.push(lootObj);
      this.group.add(lootObj.mesh);
    });
  }

  createLootMesh(x, y, z, itemDef) {
    const root = new THREE.Group();
    root.position.set(x, y, z);

    const rarityColor = itemDef.rarity.color;

    // Tactical Supply Chest
    const chestGeo = new THREE.BoxGeometry(0.8, 0.35, 0.5);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.5,
      metalness: 0.4
    });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.castShadow = true;
    root.add(chest);

    // Glowing Rarity Stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.08, 0.52),
      new THREE.MeshStandardMaterial({
        color: rarityColor,
        emissive: rarityColor,
        emissiveIntensity: 0.6
      })
    );
    root.add(stripe);

    // Vertical Sky Beam for high tier loot
    if (itemDef.rarity === ELootRarity.Legendary || itemDef.rarity === ELootRarity.Epic) {
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 45, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: rarityColor,
        transparent: true,
        opacity: 0.45
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 22.5;
      root.add(beam);
    }

    return {
      mesh: root,
      item: itemDef,
      position: new THREE.Vector3(x, y, z),
      isLooted: false
    };
  }

  update(delta) {
    // Subtle hover bob
    this.lootItems.forEach(l => {
      if (!l.isLooted) {
        l.mesh.rotation.y += delta * 0.9;
      }
    });
  }

  getClosestLoot(playerPos, maxDist = 3.5) {
    for (let l of this.lootItems) {
      if (!l.isLooted && l.position.distanceTo(playerPos) < maxDist) {
        return l;
      }
    }
    return null;
  }
}
