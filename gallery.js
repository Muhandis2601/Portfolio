/*
 * Virtual 3D exhibition — gallery.html only.
 * A warm, amber-lit museum hall. The 2D works hang flush on the side walls,
 * facing straight into the aisle (so they read face-on as you pass), each in
 * a backlit niche. A couple of freestanding glass vitrines add depth. Scroll
 * dollies the camera straight down the hall — the view stays level and
 * forward-facing at all times, no steering required. Clicking a frame opens
 * a detail popup with the project's title, image and a short description.
 */
(function () {
  const wrap = document.getElementById('gal3dWrap');
  const canvas = document.getElementById('galCanvas');
  if (!wrap || !canvas) return;

  function hasWebGL() {
    try {
      const test = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (test.getContext('webgl') || test.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (typeof THREE === 'undefined' || !hasWebGL()) {
    wrap.classList.add('no-webgl');
    return;
  }

  // ---------- Works (canvases in the 3D scene stay empty — the real image
  // and description only appear in the popup when a frame is clicked) ----------
  const WORKS = [
    { title: '3 Phase Inverter Circuit', cat: 'Circuit Design', href: 'projects/3-phase-inverter.html',
      img: 'assets/Project/3%20Phase.png', meta: 'Proteus · Arduino',
      desc: 'Designed and simulated a 3-phase inverter with Arduino-controlled motor producing a perfect sinusoidal output.' },
    { title: 'Electric Power Protection – Lombok Island', cat: 'Power Systems', href: 'projects/electric-power-protection-lombok.html',
      img: 'assets/Project/Electric%20Power%20Protection.png', meta: 'ETAP',
      desc: 'Engineered and simulated a comprehensive power protection system for 9 key substations across Lombok Island.' },
    { title: 'Energy Audit', cat: 'Energy', href: 'projects/energy-audit.html',
      img: 'assets/Project/Audit%20Energy.png', meta: 'Energy Auditing',
      desc: 'Conducted a full energy audit at Depok Sleman District Office with a 100% completion rate and actionable recommendations.' },
    { title: 'Research Assistant Lecturer', cat: 'Research', href: 'projects/research-assistant.html',
      img: 'assets/Project/Research%20Assistant%20Lecturer.png', meta: 'Arduino · AutoCAD',
      desc: 'Developed vibration sensors for railway track monitoring using Arduino and Autodesk Inventor for casing design.' },
    { title: 'PKM 2023 – GAMATEA', cat: 'Innovation', href: 'projects/student-creativity-program.html',
      img: 'assets/Project/Student%20creativity%20program%202023.png', meta: 'PKM · Kemendikbudristek',
      desc: 'Led a team to develop an automatic tea leaf cutter, securing national funding from Kemendikbudristek for PT Pagilaran.' },
    { title: 'Electric Power System – Neera Island', cat: 'Power Systems', href: 'projects/neera-island-power-system.html',
      img: 'assets/Project/Development%20of%20the%20Electric%20Power%20System%20in%20the%20Neera%20Island.jpg', meta: 'Electrical Design',
      desc: 'Developed a 10-year master plan for Neera Island\'s power system, integrating solar energy into the distribution network.' },
    { title: 'Electric Power System – IKN Area', cat: 'Power Systems', href: 'projects/ikn-power-system.html',
      img: 'assets/Project/Involves%20designing%20and%20developing%20electric%20power%20systems%20in%20the%20IKN%20area.png', meta: 'Electrical Engineering',
      desc: 'Designed cost-effective power systems for Indonesia\'s new capital, balancing technical performance with budget constraints.' },
    { title: 'Solar LED Light', cat: 'Electronics', href: 'projects/solar-led-light.html',
      img: 'assets/Project/Solar%20LED%20Light.png', meta: 'Eagle PCB · Inventor',
      desc: 'Designed and built a solar-powered LED lamp using Inventor for 3D modeling and Eagle for PCB circuit design.' }
  ];

  const CORRIDOR_HALF_WIDTH = 4;
  const CORRIDOR_HEIGHT = 6;
  const START_Z = 10;
  const WORK_SPACING = 9;
  const WORK_Z = WORKS.map((_, i) => -8 - i * WORK_SPACING);
  const END_Z = WORK_Z[WORK_Z.length - 1] - 14;
  const CORRIDOR_LENGTH = START_Z - END_Z + 40;
  const CORRIDOR_CENTER_Z = (START_Z + END_Z) / 2;
  const FRAME_W = 1.7, FRAME_H = 1.3;

  // ---------- Renderer / scene / camera ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const FOG_COLOR = 0xcdb896;
  scene.background = new THREE.Color(FOG_COLOR);
  scene.fog = new THREE.Fog(FOG_COLOR, 24, 62);

  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 200);
  camera.position.set(0, 1.7, START_Z);

  function sizeRenderer() {
    const w = wrap.clientWidth || window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  sizeRenderer();

  // ---------- Procedural textures (no image assets) ----------
  function makeWoodTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b98950';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 10; i++) {
      const y = i * 26;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,222,175,0.16)' : 'rgba(80,50,20,0.18)';
      ctx.fillRect(0, y, 256, 2);
    }
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = 'rgba(80,50,20,' + (0.07 + Math.random() * 0.08) + ')';
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(80, y + (Math.random() * 10 - 5), 170, y + (Math.random() * 10 - 5), 256, y);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, CORRIDOR_LENGTH / 10);
    return tex;
  }

  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,222,160,0.8)');
    g.addColorStop(0.45, 'rgba(255,205,130,0.28)');
    g.addColorStop(1, 'rgba(255,205,130,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  function makeShadowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(35,24,10,0.45)');
    g.addColorStop(1, 'rgba(35,24,10,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  const woodTexture = makeWoodTexture();
  const glowTexture = makeGlowTexture();
  const shadowTexture = makeShadowTexture();

  // ---------- Architecture: floor, ceiling, walls, ceiling rails ----------
  const floorMat = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.8, metalness: 0.03 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORRIDOR_HALF_WIDTH * 2, CORRIDOR_LENGTH), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, CORRIDOR_CENTER_Z);
  scene.add(floor);

  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xe4d8bf, roughness: 0.9 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CORRIDOR_HALF_WIDTH * 2, CORRIDOR_LENGTH), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, CORRIDOR_HEIGHT, CORRIDOR_CENTER_Z);
  scene.add(ceiling);

  // Side walls are built in segments further below, leaving a gap — a
  // recessed alcove bordered by partition returns ("sekat") — at each work.
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xc7b394, roughness: 0.92 });
  const returnMat = new THREE.MeshStandardMaterial({
    color: 0x3a2c1c, emissive: 0xffb15f, emissiveIntensity: 0.4, roughness: 1, side: THREE.DoubleSide
  });
  const RECESS_DEPTH = 0.55;
  const BAY_WIDTH = FRAME_W + 1.0;
  const BAY_HEIGHT = FRAME_H + 1.1;
  const NICHE_CENTER_Y = 2.1;
  const BAY_TOP = NICHE_CENTER_Y + BAY_HEIGHT / 2;
  const BAY_BOTTOM = NICHE_CENTER_Y - BAY_HEIGHT / 2;

  function addWallSegment(side, zFrom, zTo) {
    const length = zFrom - zTo;
    if (length <= 0.02) return;
    const seg = new THREE.Mesh(new THREE.PlaneGeometry(length, CORRIDOR_HEIGHT), wallMat);
    seg.position.set(side * CORRIDOR_HALF_WIDTH, CORRIDOR_HEIGHT / 2, (zFrom + zTo) / 2);
    seg.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(seg);
  }

  function buildSideWall(side, nicheZs) {
    const zTop = CORRIDOR_CENTER_Z + CORRIDOR_LENGTH / 2;
    const zBottom = CORRIDOR_CENTER_Z - CORRIDOR_LENGTH / 2;
    const sorted = nicheZs.slice().sort((a, b) => b - a);
    let cursor = zTop;
    sorted.forEach(z => {
      const gapStart = z + BAY_WIDTH / 2;
      const gapEnd = z - BAY_WIDTH / 2;
      addWallSegment(side, cursor, gapStart);
      cursor = gapEnd;
    });
    addWallSegment(side, cursor, zBottom);
  }

  buildSideWall(-1, WORK_Z.filter((z, i) => i % 2 === 0));
  buildSideWall(1, WORK_Z.filter((z, i) => i % 2 === 1));

  // Cross partition — a dividing wall with a walk-through doorway, placed
  // right after the vitrines. Splits the hall into two bays of 4 niches each.
  const DOOR_HALF_W = 1.6;
  const DOOR_HEIGHT = 4.2;
  function buildPartition(z) {
    const sideWidth = CORRIDOR_HALF_WIDTH - DOOR_HALF_W;

    [-1, 1].forEach(dir => {
      const seg = new THREE.Mesh(new THREE.PlaneGeometry(sideWidth, CORRIDOR_HEIGHT), wallMat);
      seg.position.set(dir * (DOOR_HALF_W + sideWidth / 2), CORRIDOR_HEIGHT / 2, z);
      scene.add(seg);
    });

    const header = new THREE.Mesh(new THREE.PlaneGeometry(DOOR_HALF_W * 2, CORRIDOR_HEIGHT - DOOR_HEIGHT), wallMat);
    header.position.set(0, DOOR_HEIGHT + (CORRIDOR_HEIGHT - DOOR_HEIGHT) / 2, z);
    scene.add(header);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(DOOR_HALF_W * 2 + 0.1, 0.06, 0.1), fixtureMat);
    trim.position.set(0, DOOR_HEIGHT, z);
    scene.add(trim);
  }
  const PARTITION_Z = (WORK_Z[3] + WORK_Z[4]) / 2 - 2;

  // Ceiling track rails + small warm spotlight heads
  const railMat = new THREE.MeshStandardMaterial({ color: 0x352c22, roughness: 0.5, metalness: 0.35 });
  const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.4, metalness: 0.6, emissive: 0xffcf8a, emissiveIntensity: 0.4 });
  buildPartition(PARTITION_Z);
  [-1.6, 1.6].forEach(x => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, CORRIDOR_LENGTH), railMat);
    rail.position.set(x, CORRIDOR_HEIGHT - 0.04, CORRIDOR_CENTER_Z);
    scene.add(rail);
    for (let z = START_Z; z > END_Z; z -= 4.5) {
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), fixtureMat);
      fixture.position.set(x, CORRIDOR_HEIGHT - 0.09, z);
      scene.add(fixture);
    }
  });

  // Soft warm glow at the far end of the hall
  const endGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 5),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.3 })
  );
  endGlow.position.set(0, CORRIDOR_HEIGHT / 2, END_Z - 12);
  scene.add(endGlow);

  // ---------- Materials shared by wall niches & vitrines ----------
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x9c6f34, roughness: 0.35, metalness: 0.5 });
  const canvasMat = new THREE.MeshStandardMaterial({ color: 0xfbf8f3, roughness: 0.95 });
  const backingMat = new THREE.MeshStandardMaterial({ color: 0x30251a, emissive: 0xffb15f, emissiveIntensity: 0.55, roughness: 1 });
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff3d6, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false
  });
  const glowSprites = [];
  const clickableMeshes = [];

  function addGlow(parent, y, scale) {
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture, color: 0xffd9a0, transparent: true, opacity: 0.3, depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(0, y, 0.4);
    parent.add(sprite);
    glowSprites.push({ sprite, phase: Math.random() * Math.PI * 2 });
  }

  // ---------- Wall works — set inside a recessed, backlit alcove ----------
  WORKS.forEach((work, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const z = WORK_Z[i];
    const wallX = side * CORRIDOR_HALF_WIDTH;
    const backX = wallX + side * RECESS_DEPTH;
    const midX = (wallX + backX) / 2;

    // Back wall of the alcove — glows warm, like an LED-backlit panel
    const backing = new THREE.Mesh(new THREE.PlaneGeometry(BAY_WIDTH - 0.1, BAY_HEIGHT - 0.1), backingMat);
    backing.position.set(backX, NICHE_CENTER_Y, z);
    backing.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(backing);

    // Top / bottom returns of the recess
    const topReturn = new THREE.Mesh(new THREE.PlaneGeometry(RECESS_DEPTH, BAY_WIDTH), returnMat);
    topReturn.rotation.x = Math.PI / 2;
    topReturn.position.set(midX, BAY_TOP, z);
    scene.add(topReturn);

    const bottomReturn = new THREE.Mesh(new THREE.PlaneGeometry(RECESS_DEPTH, BAY_WIDTH), returnMat);
    bottomReturn.rotation.x = -Math.PI / 2;
    bottomReturn.position.set(midX, BAY_BOTTOM, z);
    scene.add(bottomReturn);

    // Side returns — the projecting "sekat" partitions between bays
    [-1, 1].forEach(dir => {
      const sideReturn = new THREE.Mesh(new THREE.PlaneGeometry(RECESS_DEPTH, BAY_HEIGHT), returnMat);
      sideReturn.position.set(midX, NICHE_CENTER_Y, z + dir * BAY_WIDTH / 2);
      scene.add(sideReturn);
    });

    // Empty framed canvas, mounted just in front of the backlit panel
    const frameGroup = new THREE.Group();
    frameGroup.position.set(backX + side * 0.05, NICHE_CENTER_Y, z);
    frameGroup.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;

    const border = new THREE.Mesh(new THREE.BoxGeometry(FRAME_W + 0.18, FRAME_H + 0.18, 0.06), frameMat);
    frameGroup.add(border);

    const blankCanvas = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W, FRAME_H), canvasMat);
    blankCanvas.position.z = 0.045;
    frameGroup.add(blankCanvas);

    border.userData.workIndex = i;
    blankCanvas.userData.workIndex = i;
    clickableMeshes.push(border, blankCanvas);

    scene.add(frameGroup);

    // Spotlight fixture on the ceiling, aiming a soft beam down onto the niche
    const spotFixture = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.15, 10), fixtureMat);
    spotFixture.position.set(midX, CORRIDOR_HEIGHT - 0.08, z);
    scene.add(spotFixture);

    const beamHeight = CORRIDOR_HEIGHT - NICHE_CENTER_Y - 0.3;
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.55, beamHeight, 20, 1, true), beamMat);
    beam.position.set(midX, NICHE_CENTER_Y + 0.3 + beamHeight / 2, z);
    scene.add(beam);
  });

  // ---------- A couple of freestanding vitrines for depth (decorative) ----------
  const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.6 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7f4ec, metalness: 0, roughness: 0.1, transmission: 0.3,
    transparent: true, opacity: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.1, side: THREE.DoubleSide
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const relicMat = new THREE.MeshStandardMaterial({ color: 0xb08a4a, roughness: 0.4, metalness: 0.55 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xfff6df });
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.4, depthWrite: false });

  const PEDESTAL_H = 0.8, VITRINE_H = 1.1;
  const VITRINE_Z = PARTITION_Z + 3.5;
  const vitrineSpots = [
    { x: -1.1, z: VITRINE_Z },
    { x: 1.1, z: VITRINE_Z }
  ];
  vitrineSpots.forEach((spot, i) => {
    const group = new THREE.Group();
    group.position.set(spot.x, 0, spot.z);

    const shadowBlob = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), shadowMat);
    shadowBlob.rotation.x = -Math.PI / 2;
    shadowBlob.position.y = 0.01;
    group.add(shadowBlob);

    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.75, PEDESTAL_H, 0.75), pedestalMat);
    pedestal.position.y = PEDESTAL_H / 2;
    group.add(pedestal);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.9, VITRINE_H, 0.9), glassMat);
    glass.position.y = PEDESTAL_H + VITRINE_H / 2;
    group.add(glass);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), edgeMat);
    edges.position.copy(glass.position);
    group.add(edges);

    const relic = new THREE.Mesh(
      i % 2 === 0 ? new THREE.OctahedronGeometry(0.22, 0) : new THREE.TorusKnotGeometry(0.14, 0.05, 64, 8),
      relicMat
    );
    relic.position.y = PEDESTAL_H + VITRINE_H / 2;
    group.add(relic);

    // LED ring built into the base, uplighting the piece from inside the vitrine
    const led = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 24), ledMat);
    led.position.y = PEDESTAL_H + 0.02;
    group.add(led);

    const ledLight = new THREE.PointLight(0xfff0d0, 0.6, 3, 2);
    ledLight.position.y = PEDESTAL_H + 0.3;
    group.add(ledLight);

    addGlow(group, PEDESTAL_H + VITRINE_H + 0.15, 1.6);

    scene.add(group);
  });

  // ---------- Lights (warm amber museum feel — not blown out) ----------
  scene.add(new THREE.AmbientLight(0xffd8a3, 0.38));
  const hemi = new THREE.HemisphereLight(0xfff0d0, 0xb98950, 0.3);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffd9a0, 0.55);
  key.position.set(6, 16, 8);
  scene.add(key);

  const lantern = new THREE.PointLight(0xffdca8, 0.4, 11, 2.2);
  lantern.position.copy(camera.position);
  scene.add(lantern);

  // ---------- Caption / progress UI ----------
  const captionEl = document.getElementById('galCaption');
  const captionNum = document.getElementById('galCaptionNum');
  const captionTitle = document.getElementById('galCaptionTitle');
  const captionSub = document.getElementById('galCaptionSub');
  const captionLink = document.getElementById('galCaptionLink');
  const progressBar = document.getElementById('galProgressBar');

  let lastIndex = -1;
  function updateCaption(zPos) {
    let nearest = 0, best = Infinity;
    WORK_Z.forEach((z, i) => {
      const d = Math.abs(z - zPos);
      if (d < best) { best = d; nearest = i; }
    });
    const active = best < WORK_SPACING * 0.85;
    captionEl.classList.toggle('visible', active);
    if (active && nearest !== lastIndex) {
      lastIndex = nearest;
      const w = WORKS[nearest];
      captionNum.textContent = String(nearest + 1).padStart(2, '0') + ' / ' + String(WORKS.length).padStart(2, '0');
      captionTitle.textContent = w.title;
      captionSub.textContent = w.cat + ' — Empty frame, artwork coming soon';
      captionLink.href = w.href;
    }
  }

  // ---------- Click a frame to open its detail popup ----------
  const modalOverlay = document.getElementById('galModalOverlay');
  const modalCard = document.getElementById('galModalCard');
  const modalClose = document.getElementById('galModalClose');
  const modalNum = document.getElementById('galModalNum');
  const modalTitle = document.getElementById('galModalTitle');
  const modalImg = document.getElementById('galModalImg');
  const modalDesc = document.getElementById('galModalDesc');
  const modalMeta = document.getElementById('galModalMeta');
  const modalLink = document.getElementById('galModalLink');

  function openWorkModal(index) {
    const w = WORKS[index];
    if (!w || !modalOverlay) return;
    modalNum.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(WORKS.length).padStart(2, '0');
    modalTitle.textContent = w.title;
    modalImg.src = w.img;
    modalImg.alt = w.title;
    modalDesc.textContent = w.desc;
    modalMeta.textContent = w.meta;
    modalLink.href = w.href;
    modalOverlay.classList.add('open');
  }
  function closeWorkModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
  }

  if (modalOverlay) {
    modalClose.addEventListener('click', closeWorkModal);
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeWorkModal();
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeWorkModal();
    });
  }

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  let pointerDragDistance = 0;
  let pointerDownPos = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', e => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
    pointerDragDistance = 0;
  });
  canvas.addEventListener('pointermove', e => {
    pointerDragDistance = Math.max(
      pointerDragDistance,
      Math.abs(e.clientX - pointerDownPos.x) + Math.abs(e.clientY - pointerDownPos.y)
    );

    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    const hit = raycaster.intersectObjects(clickableMeshes)[0];
    canvas.style.cursor = hit ? 'pointer' : 'default';
  });
  canvas.addEventListener('click', e => {
    if (pointerDragDistance > 6) return;
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    const hit = raycaster.intersectObjects(clickableMeshes)[0];
    if (hit) openWorkModal(hit.object.userData.workIndex);
  });

  // ---------- Scroll-driven camera dolly ----------
  let scrollProgress = 0;
  function readScrollProgress() {
    const rect = wrap.getBoundingClientRect();
    const scrollable = wrap.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    const passed = -rect.top;
    return Math.min(1, Math.max(0, passed / scrollable));
  }
  window.addEventListener('scroll', () => { scrollProgress = readScrollProgress(); }, { passive: true });
  scrollProgress = readScrollProgress();

  window.addEventListener('resize', sizeRenderer);

  // ---------- Animate ----------
  const clock = new THREE.Clock();
  let currentZ = camera.position.z;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const targetZ = START_Z + scrollProgress * (END_Z - START_Z);
    currentZ += (targetZ - currentZ) * 0.08;
    camera.position.z = currentZ;

    lantern.position.set(camera.position.x, camera.position.y + 0.3, camera.position.z - 1.5);

    glowSprites.forEach(g => {
      g.sprite.material.opacity = 0.24 + Math.sin(t * 1.2 + g.phase) * 0.08;
    });

    updateCaption(currentZ);
    if (progressBar) progressBar.style.height = (scrollProgress * 100) + '%';

    renderer.render(scene, camera);
  }
  animate();
})();
