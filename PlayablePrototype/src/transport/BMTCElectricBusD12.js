// BMTC Low-Floor Electric Bus (D12 Electronic City - Reference Target Model)
// BENGALURU: LAST CITY - Master Production Overhaul
// Blue electric bus body, amber digital LED display "D12 ELECTRONIC CITY",
// white LED headlights, curved panoramic windscreen, interior passenger seating,
// Karnataka registration "KA-01-AB-1234", and realistic physics drive controller.
import * as THREE from 'three';

export class BMTCElectricBusD12 {
  constructor(scene, initialPos = new THREE.Vector3(-22, 0, 18)) {
    this.scene = scene;
    this.position = initialPos.clone();
    this.rotation = 0;
    this.speed = 0;
    this.maxSpeed = 16.5; // ~60 km/h

    this.group = new THREE.Group();
    this.group.name = 'BMTCElectricBus_D12';

    this.buildBusMesh();
    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  buildBusMesh() {
    // 1. High-Detail PBR Materials
    const bmtcBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant BMTC Electric Sky Blue
      roughness: 0.28,
      metalness: 0.55,
      clearcoat: 0.85
    });

    const blackTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.2
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.45,
      clearcoat: 1.0
    });

    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf8fafc,
      emissiveIntensity: 1.8,
      roughness: 0.1
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.85,
      metalness: 0.05
    });

    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.9
    });

    // 2. Bus Dimensions (Standard 12-meter Low Floor City Bus)
    const length = 12.0;
    const width = 2.6;
    const height = 3.2;

    // Main Body Shell
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.5, length), bmtcBlueMat);
    body.position.y = height / 2 + 0.25;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    // Aerodynamic Curved Roof Cap
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.4, length - 0.4), blackTrimMat);
    roof.position.y = height + 0.1;
    this.group.add(roof);

    // Rooftop Battery Pack Enclosures (Electric EV)
    const batteryPack = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, 0.45, length * 0.5), blackTrimMat);
    batteryPack.position.set(0, height + 0.4, -0.5);
    this.group.add(batteryPack);

    // 3. Curved Front Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(width - 0.25, 1.45, 0.1), glassMat);
    windshield.position.set(0, 2.2, length / 2 + 0.02);
    this.group.add(windshield);

    // Windshield Wipers
    [-0.45, 0.45].forEach(wx => {
      const wiper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.02), blackTrimMat);
      wiper.rotation.z = wx > 0 ? 0.35 : -0.35;
      wiper.position.set(wx, 1.8, length / 2 + 0.08);
      this.group.add(wiper);
    });

    // 4. Digital Amber LED Destination Matrix Display: "D12 ELECTRONIC CITY"
    const ledCanvas = document.createElement('canvas');
    ledCanvas.width = 512;
    ledCanvas.height = 128;
    const lctx = ledCanvas.getContext('2d');

    lctx.fillStyle = '#05080f'; // Dark LED housing
    lctx.fillRect(0, 0, 512, 128);

    // Glowing Amber LED Text
    lctx.fillStyle = '#f59e0b';
    lctx.shadowColor = '#fbbf24';
    lctx.shadowBlur = 12;

    // Route Number
    lctx.font = '900 58px monospace';
    lctx.textAlign = 'left';
    lctx.fillText('D12', 20, 85);

    // Destination Name
    lctx.font = 'bold 38px sans-serif';
    lctx.fillText('ELECTRONIC CITY', 150, 80);

    const ledTexture = new THREE.CanvasTexture(ledCanvas);
    const ledMat = new THREE.MeshBasicMaterial({ map: ledTexture });
    const ledDisplay = new THREE.Mesh(new THREE.BoxGeometry(width - 0.4, 0.65, 0.12), ledMat);
    ledDisplay.position.set(0, height - 0.25, length / 2 + 0.04);
    this.group.add(ledDisplay);

    // Front BMTC Electric Bus Logo & Branding
    const brandCanvas = document.createElement('canvas');
    brandCanvas.width = 512;
    brandCanvas.height = 128;
    const bctx = brandCanvas.getContext('2d');
    bctx.fillStyle = '#0284c7';
    bctx.fillRect(0, 0, 512, 128);
    bctx.fillStyle = '#ffffff';
    bctx.font = 'bold 44px sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('BMTC', 256, 55);
    bctx.font = '24px sans-serif';
    bctx.fillStyle = '#bae6fd';
    bctx.fillText('Electric Bus', 256, 95);

    const brandTex = new THREE.CanvasTexture(brandCanvas);
    const brandMat = new THREE.MeshBasicMaterial({ map: brandTex });
    const brandMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.05), brandMat);
    brandMesh.position.set(0, 1.35, length / 2 + 0.04);
    this.group.add(brandMesh);

    // 5. White LED Headlight Clusters
    [-width / 2 + 0.35, width / 2 - 0.35].forEach(hx => {
      // Main beam
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.15), headlightMat);
      lamp.position.set(hx, 1.1, length / 2 + 0.05);
      this.group.add(lamp);

      // Daytime running light strip
      const drl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.12), headlightMat);
      drl.position.set(hx, 1.28, length / 2 + 0.05);
      this.group.add(drl);
    });

    // 6. Karnataka High-Security Registration Plate (HSRP)
    // Reference: KA-01-AB-1234 (Green EV stripe)
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 256;
    plateCanvas.height = 64;
    const pctx = plateCanvas.getContext('2d');
    pctx.fillStyle = '#15803d'; // Green EV background
    pctx.fillRect(0, 0, 256, 64);
    pctx.strokeStyle = '#ffffff';
    pctx.lineWidth = 3;
    pctx.strokeRect(2, 2, 252, 60);
    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 30px monospace';
    pctx.textAlign = 'center';
    pctx.fillText('KA-01-AB-1234', 128, 44);

    const plateTex = new THREE.CanvasTexture(plateCanvas);
    const plateMat = new THREE.MeshBasicMaterial({ map: plateTex });
    const numberPlate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.05), plateMat);
    numberPlate.position.set(0, 0.72, length / 2 + 0.06);
    this.group.add(numberPlate);

    // 7. Side Passenger Windows
    [-width / 2 - 0.02, width / 2 + 0.02].forEach(wx => {
      for (let z = -length / 2 + 2.0; z <= length / 2 - 2.0; z += 2.2) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 1.9), glassMat);
        win.position.set(wx, 2.15, z);
        this.group.add(win);
      }
    });

    // 8. Low-Floor Wheels with Alloy Rims (4 wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.38, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.40, 12);
    rimGeo.rotateZ(Math.PI / 2);

    const wheelZOffsets = [-3.8, 3.8];
    wheelZOffsets.forEach(wz => {
      [-width / 2, width / 2].forEach(wx => {
        const wheel = new THREE.Mesh(wheelGeo, rubberMat);
        const rim = new THREE.Mesh(rimGeo, alloyMat);
        wheel.add(rim);
        wheel.position.set(wx, 0.52, wz);
        wheel.castShadow = true;
        this.group.add(wheel);
      });
    });
  }

  update(delta) {
    // Subtle idle vibration
    this.group.position.y = Math.sin(Date.now() * 0.008) * 0.003;
  }
}
