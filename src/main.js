import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BOTS } from './bots.js';

/* =========================================================
   State
   ========================================================= */
const bots = BOTS.map((b) => ({ ...b, status: pick(b.tasks) }));
let selectedId = null;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================================================
   Scene setup
   ========================================================= */
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Orthographic camera gives the clean "isometric diorama" look
const FRUSTUM = 16;
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
const HOME_POS = new THREE.Vector3(18, 16, 18);
const HOME_ZOOM = 1;
camera.position.copy(HOME_POS);
camera.zoom = HOME_ZOOM;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minZoom = 0.6;
controls.maxZoom = 3;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = 1.2;
controls.target.set(0, 0, 0);
controls.autoRotateSpeed = 0.8;

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe5ec, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(8, 16, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 });
sun.shadow.radius = 4;
sun.shadow.bias = -0.0005;
scene.add(sun);

/* =========================================================
   Helpers
   ========================================================= */
const mats = {};
function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!mats[key]) mats[key] = new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...opts });
  return mats[key];
}

function box(w, h, d, color, x = 0, y = 0, z = 0, opts) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function group(...children) {
  const g = new THREE.Group();
  children.forEach((c) => g.add(c));
  return g;
}

/* =========================================================
  Northstar delivery district
  ========================================================= */
const W = 16; // width (x)
const D = 11; // depth (z)
const office = new THREE.Group();
scene.add(office);

// Floor slab
office.add(box(W, 0.3, D, '#f4f6f8', 0, -0.3, 0));
// Subtle floor trim
office.add(box(W + 0.2, 0.08, D + 0.2, '#e3e8ee', 0, -0.38, 0));

// Back walls (low, like a cut-away dollhouse)
const WALL_H = 1.6;
office.add(box(W, WALL_H, 0.2, '#fbfcfd', 0, 0, -D / 2 + 0.1));
office.add(box(0.2, WALL_H, D, '#fbfcfd', -W / 2 + 0.1, 0, 0));

// Front glass rails
const glass = { transparent: true, opacity: 0.25, roughness: 0.1, color: '#cfe3f0' };
office.add(box(W, 0.5, 0.06, '#cfe3f0', 0, 0, D / 2 - 0.03, glass));
office.add(box(0.06, 0.5, D, '#cfe3f0', W / 2 - 0.03, 0, 0, glass));

// Glass partitions in the room
office.add(box(0.06, 1.2, 3, '#cfe3f0', 1.2, 0, -3.5, glass));
office.add(box(3.2, 1.2, 0.06, '#cfe3f0', 4.8, 0, -1.8, glass));

// Light floor zones
const zone = (w, d, color, x, z) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.005, z);
  m.receiveShadow = true;
  return m;
};
office.add(zone(5, 3.6, '#e8f1ea', -1.5, 0.2)); // greenish carpet in the middle

/* ---------- furniture ---------- */
function desk(x, z, rot = 0) {
  const g = new THREE.Group();
  const WOOD = '#d79b5c';
  g.add(box(1.6, 0.08, 0.8, WOOD, 0, 0.7, 0)); // top
  for (const [lx, lz] of [[-0.72, -0.32], [0.72, -0.32], [-0.72, 0.32], [0.72, 0.32]]) {
    g.add(box(0.06, 0.7, 0.06, '#9a6b3c', lx, 0, lz));
  }
  // Monitor
  g.add(box(0.7, 0.45, 0.05, '#2b2f36', 0, 0.95, -0.25));
  g.add(box(0.62, 0.37, 0.01, '#8fb4d8', 0, 0.99, -0.22, { emissive: '#3b6ea8', emissiveIntensity: 0.25 }));
  g.add(box(0.08, 0.17, 0.08, '#2b2f36', 0, 0.78, -0.28));
  // Keyboard
  g.add(box(0.5, 0.02, 0.15, '#e9ecef', 0, 0.78, 0.08));
  // Chair
  g.add(box(0.55, 0.08, 0.55, '#4b5563', 0, 0.42, 0.7));
  g.add(box(0.55, 0.5, 0.08, '#4b5563', 0, 0.5, 0.95));
  g.add(box(0.06, 0.42, 0.06, '#374151', 0, 0, 0.7));
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  return g;
}

function bookshelf(x, z, rot = 0) {
  const g = new THREE.Group();
  const WOOD = '#c98a4e';
  g.add(box(1.0, 2.2, 0.06, WOOD, 0, 0, -0.2)); // back
  g.add(box(0.06, 2.2, 0.45, WOOD, -0.5, 0, 0));
  g.add(box(0.06, 2.2, 0.45, WOOD, 0.5, 0, 0));
  const bookColors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];
  for (let s = 0; s < 4; s++) {
    const y = s * 0.55;
    g.add(box(1.0, 0.05, 0.45, WOOD, 0, y, 0));
    let bx = -0.42;
    while (bx < 0.38) {
      const bw = 0.06 + Math.random() * 0.06;
      const bh = 0.3 + Math.random() * 0.15;
      g.add(box(bw, bh, 0.3, pick(bookColors), bx + bw / 2, y + 0.05, 0));
      bx += bw + 0.015;
    }
  }
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  return g;
}

function sofa(x, z, rot = 0) {
  const C = '#7c6f9b';
  const g = group(
    box(2.4, 0.4, 1.0, C, 0, 0.1, 0),
    box(2.4, 0.7, 0.3, C, 0, 0.1, -0.4),
    box(0.3, 0.6, 1.0, C, -1.1, 0.1, 0),
    box(0.3, 0.6, 1.0, C, 1.1, 0.1, 0),
    box(0.9, 0.15, 0.7, '#8f84ad', -0.48, 0.5, 0.05),
    box(0.9, 0.15, 0.7, '#8f84ad', 0.48, 0.5, 0.05),
    box(2.2, 0.1, 0.9, '#5f557a', 0, 0, 0)
  );
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  return g;
}

function hexRug(x, z, r = 1.3, color = '#e6b98a') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.04, 6), mat(color));
  m.position.set(x, 0.02, z);
  m.receiveShadow = true;
  return m;
}

function plant(x, z, h = 1.2) {
  const g = group(
    box(0.3, 0.35, 0.3, '#e5e7eb', 0, 0, 0),
    (() => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, h - 0.4, 4, 8), mat('#8cc7a1'));
      m.position.y = 0.35 + h / 2;
      m.castShadow = true;
      return m;
    })()
  );
  g.position.set(x, 0, z);
  return g;
}

function sideTable(x, z) {
  return group(box(0.6, 0.45, 0.6, '#f3f4f6', x, 0, z), box(0.2, 0.15, 0.2, '#f59e0b', x, 0.45, z));
}

// Place furniture
office.add(bookshelf(-6.4, -5.05));
office.add(bookshelf(-5.3, -5.05));

const DESKS = [
  [-5.4, -2.2], [-2.6, -3.4], [0.1, -2.6],
  [-5.8, 1.8], [-2.2, 1.0], [0.6, 2.6],
  [3.4, -4.0], [5.6, -4.0],
];
DESKS.forEach(([x, z]) => office.add(desk(x, z, Math.PI)));

office.add(sofa(5.0, 0.6, -Math.PI / 2 + 0.0));
office.add(hexRug(3.2, 3.2, 1.3));
office.add(hexRug(3.2, 3.2, 1.0, '#d9a671'));
office.add(sideTable(6.6, 3.4));
office.add(plant(-7.3, 4.6, 1.4));
office.add(plant(1.0, -4.9, 1.0));
office.add(plant(7.3, -4.9, 1.3));
office.add(plant(-3.7, 4.6, 0.9));

// Keep the original office diorama in the project, but show the neighborhood
// district in the live operations view.
office.visible = false;
const district = new THREE.Group();
scene.add(district);
district.add(zone(18, 14, '#e4eadb', 0, 0));

// Use one merged cross-shaped mesh per street layer. Overlapping coplanar road
// planes caused depth-buffer z-fighting and visible flicker while orbiting.
function roadCross(width, color, y) {
  const half = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-9, -half);
  shape.lineTo(-half, -half);
  shape.lineTo(-half, -7);
  shape.lineTo(half, -7);
  shape.lineTo(half, -half);
  shape.lineTo(9, -half);
  shape.lineTo(9, half);
  shape.lineTo(half, half);
  shape.lineTo(half, 7);
  shape.lineTo(-half, 7);
  shape.lineTo(-half, half);
  shape.lineTo(-9, half);
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat(color));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.receiveShadow = false;
  district.add(mesh);
}

// A small street grid gives the fleet a delivery network to move through.
roadCross(2.05, '#c5c9bd', 0.012);
roadCross(1.55, '#777f78', 0.02);

function building(x, z, w, d, h, color, roof = '#f4f1e7') {
  const b = new THREE.Group();
  b.add(box(w, h, d, color, x, 0.02, z));
  b.add(box(w + 0.12, 0.12, d + 0.12, roof, x, h + 0.02, z));
  // Soft rooftop equipment makes each block read clearly from the isometric view.
  b.add(box(w * 0.25, 0.16, d * 0.18, '#d7d8cc', x - w * 0.18, h + 0.14, z - d * 0.17));
  for (let i = 0; i < Math.max(2, Math.floor(w / 0.7)); i++) {
    const wx = x - w * 0.35 + i * (w * 0.7 / Math.max(1, Math.floor(w / 0.7) - 1));
    b.add(box(0.22, 0.3, 0.035, '#d9e5d3', wx, h * 0.45, z + d / 2 + 0.025));
  }
  return b;
}

district.add(building(-5.0, -3.15, 3.8, 2.5, 1.0, '#d9c9ae', '#f3eadb'));
district.add(building(5.0, -3.15, 3.8, 2.5, 1.45, '#d4d9c6', '#eef0e4'));
district.add(building(-5.0, 3.15, 3.8, 2.5, 1.2, '#d5c9bf', '#f2e9df'));
district.add(building(5.0, 3.15, 3.8, 2.5, 1.0, '#cbd6c2', '#eaf0e4'));

// Dashed center lines and curb islands mark the streets.
for (let x = -8; x <= 8; x += 1.15) district.add(box(0.42, 0.018, 0.045, '#e2dfc9', x, 0.03, 0));
for (let z = -6; z <= 6; z += 1.15) district.add(box(0.045, 0.018, 0.42, '#e2dfc9', 0, 0.03, z));

// Tiny park planters soften the blocks and help show scale.
function streetTree(x, z) {
  const tree = new THREE.Group();
  tree.add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.32, 8), mat('#987d5d')));
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.23, 10, 8), mat('#91ad74'));
  crown.position.y = 0.3;
  tree.add(crown);
  tree.position.set(x, 0.02, z);
  district.add(tree);
}
for (const [x, z] of [[-7.1, -1.55], [-6.1, -1.55], [6.1, 1.55], [7.1, 1.55], [-1.55, -5.2], [1.55, 5.2]]) streetTree(x, z);

/* =========================================================
   Bots
   ========================================================= */
const botObjects = new Map(); // id -> { group, body, phase, home }

// Every waypoint sits on the street grid; robots wander between delivery stops.
const SPOTS = [
  [-6.5, 0], [-3.4, 0], [-1.0, 0], [1.5, 0], [4.1, 0], [6.8, 0],
  [0, -5.3], [0, -3.1], [0, -1.0], [0, 1.1], [0, 3.3], [0, 5.4],
];

function makeBot(bot, index) {
  const g = new THREE.Group();
  const color = new THREE.Color(bot.color);
  const body = new THREE.Group();
  body.position.y = 0.2;
  const shell = new THREE.MeshStandardMaterial({ color, roughness: 0.52 });
  body.add(box(0.72, 0.25, 0.9, '#f9f8f0', 0, 0.12, 0));
  body.add(box(0.66, 0.24, 0.6, shell, 0, 0.34, -0.02));
  body.add(box(0.46, 0.16, 0.42, '#edb36b', 0, 0.35, -0.32)); // delivery cargo pod
  body.add(box(0.38, 0.12, 0.025, '#b9d2d1', 0, 0.4, 0.29, { metalness: 0.15, roughness: 0.25 })); // front sensor glass
  body.add(box(0.22, 0.035, 0.035, '#f8f0d9', 0, 0.18, 0.46, { emissive: '#f2df9e', emissiveIntensity: 0.7 })); // headlight
  const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.08, 16), mat('#35433a', { metalness: 0.35, roughness: 0.3 }));
  lidar.position.set(0, 0.53, 0.02);
  body.add(lidar);
  const lidarTop = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.015, 16), mat('#b9d64c', { emissive: '#829d2b', emissiveIntensity: 0.35 }));
  lidarTop.position.set(0, 0.578, 0.02);
  body.add(lidarTop);
  g.add(body);

  const tireMat = mat('#343833', { roughness: 0.85 });
  for (const x of [-0.34, 0.34]) {
    for (const z of [-0.27, 0.29]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 12), tireMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.17, z);
      wheel.castShadow = true;
      g.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.095, 12), mat('#9da596', { metalness: 0.25 }));
      hub.rotation.z = Math.PI / 2;
      hub.position.set(x * 1.02, 0.17, z);
      g.add(hub);
    }
  }

  // Little shadow-catching base ring when selected
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.56, 0.64, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  g.add(ring);

  const [sx, sz] = SPOTS[index % SPOTS.length];
  g.position.set(sx, 0, sz);
  g.rotation.y = Math.PI / 2;
  g.traverse((o) => (o.userData.botId = bot.id));
  scene.add(g);

  botObjects.set(bot.id, {
    group: g,
    body,
    ring,
    phase: Math.random() * Math.PI * 2,
    target: null,
    wanderAt: performance.now() + 4000 + Math.random() * 6000,
    jumpUntil: 0,
  });
}

function addAccessory(body, kind) {
  const top = 0.38 + 0.35 / 2;
  if (kind === 'beret') {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.1, 20), mat('#f97316'));
    b.position.set(0.05, top - 0.02, 0);
    b.rotation.z = -0.25;
    body.add(b);
  } else if (kind === 'glasses') {
    const ringMat = mat('#16181d');
    for (const ex of [-0.12, 0.12]) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 20), ringMat);
      r.position.set(ex, 0.1, 0.38);
      body.add(r);
    }
  } else if (kind === 'antenna') {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25), mat('#16181d'));
    stick.position.y = top + 0.15;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), mat('#ef4444'));
    ball.position.y = top + 0.3;
    body.add(stick, ball);
  } else if (kind === 'nightcap') {
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 20), mat('#1e3a8a'));
    cap.position.set(0, top + 0.12, 0);
    cap.rotation.z = -0.4;
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), mat('#ffffff'));
    pom.position.set(0.2, top + 0.32, 0);
    body.add(cap, pom);
  } else if (kind === 'heart') {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.1);
    shape.bezierCurveTo(-0.15, 0, -0.12, 0.12, 0, 0.06);
    shape.bezierCurveTo(0.12, 0.12, 0.15, 0, 0, -0.1);
    const heart = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false }),
      mat('#be123c')
    );
    heart.position.set(0, top + 0.18, 0);
    heart.scale.setScalar(1.2);
    body.add(heart);
  }
}

bots.forEach(makeBot);

/* =========================================================
   Speech bubbles (HTML overlay)
   ========================================================= */
const bubbles = new Map(); // id -> { el, until }
function say(id, text, ms = 2600) {
  const existing = bubbles.get(id);
  if (existing) existing.el.remove();
  const el = document.createElement('div');
  el.className = 'bubble';
  el.textContent = text;
  document.getElementById('playground').appendChild(el);
  bubbles.set(id, { el, until: performance.now() + ms });
}

const tmpV = new THREE.Vector3();
function updateBubbles(now) {
  const rect = stage.getBoundingClientRect();
  for (const [id, b] of bubbles) {
    const obj = botObjects.get(id);
    if (!obj || now > b.until) {
      b.el.remove();
      bubbles.delete(id);
      continue;
    }
    obj.body.getWorldPosition(tmpV);
    tmpV.y += 0.8;
    tmpV.project(camera);
    b.el.style.left = `${((tmpV.x + 1) / 2) * rect.width}px`;
    b.el.style.top = `${((1 - tmpV.y) / 2) * rect.height}px`;
  }
}

/* =========================================================
   Selection / UI
   ========================================================= */
const card = document.getElementById('card');
const listEl = document.getElementById('botList');
const gridEl = document.getElementById('agentsGrid');

function avatarHTML(color, size = '') {
  return `<span class="avatar" style="background:${color}${size}"><i></i><i></i></span>`;
}

function renderLists() {
  document.getElementById('botCount').textContent = bots.length;
  const onlineCount = document.getElementById('onlineCount');
  if (onlineCount) onlineCount.textContent = String(bots.length).padStart(2, '0');
  listEl.innerHTML = bots
    .map(
      (b) => `
      <li class="bot-item ${b.id === selectedId ? 'selected' : ''}" data-id="${b.id}">
        ${avatarHTML(b.color)}
        <div><b>${escapeHTML(b.name)}</b><small>${escapeHTML(b.role)}</small></div>
        <span class="chev">›</span>
      </li>`
    )
    .join('');
  gridEl.innerHTML = bots
    .map(
      (b) => `
      <div class="agent-card" data-id="${b.id}">
        ${avatarHTML(b.color)}
        <b>${escapeHTML(b.name)}</b>
        <small>${escapeHTML(b.role)}</small>
        <p><span class="pulse"></span>${escapeHTML(b.status)}</p>
      </div>`
    )
    .join('');
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function select(id) {
  selectedId = id;
  const bot = bots.find((b) => b.id === id);
  botObjects.forEach((o, oid) => (o.ring.material.opacity = oid === id ? 0.6 : 0));
  if (!bot) {
    card.classList.add('hidden');
    renderLists();
    return;
  }
  document.getElementById('cardAvatar').style.background = bot.color;
  document.getElementById('cardName').textContent = bot.name;
  document.getElementById('cardRole').textContent = bot.role;
  document.getElementById('cardStatus').textContent = bot.status;
  card.classList.remove('hidden');
  renderLists();
  hop(id);
}

function hop(id) {
  const o = botObjects.get(id);
  if (o) o.jumpUntil = performance.now() + 500;
}

listEl.addEventListener('click', (e) => {
  const li = e.target.closest('.bot-item');
  if (li) {
    showView('playground');
    select(li.dataset.id);
  }
});
gridEl.addEventListener('click', (e) => {
  const c = e.target.closest('.agent-card');
  if (c) {
    showView('playground');
    select(c.dataset.id);
  }
});
document.getElementById('cardClose').onclick = () => select(null);
document.getElementById('sayHi').onclick = () => {
  if (!selectedId) return;
  hop(selectedId);
  say(selectedId, pick(['Cloud link verified ✓', 'Route updated ✓', 'Sensor check complete ✓', 'Autonomy packet received ✓']));
};

// Tabs
function showView(view) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
  document.getElementById('playground').classList.toggle('hidden', view !== 'playground');
  document.getElementById('agents').classList.toggle('hidden', view !== 'agents');
  if (view === 'playground') resize();
}
document.querySelectorAll('.tab').forEach((t) => (t.onclick = () => showView(t.dataset.view)));

// Keep the displayed day current and let the operator inspect another date.
const dashboardDate = document.getElementById('dashboardDate');
const datePicker = document.getElementById('datePicker');
const dateButton = document.getElementById('dateButton');
const dateButtonLabel = document.getElementById('dateButtonLabel');
let selectedDashboardDate = new Date();

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderDashboardDate() {
  dashboardDate.textContent = selectedDashboardDate
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();
  const isToday = localDateValue(selectedDashboardDate) === localDateValue(new Date());
  dateButtonLabel.textContent = isToday
    ? 'Today'
    : selectedDashboardDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  datePicker.value = localDateValue(selectedDashboardDate);
}

dateButton.addEventListener('click', () => {
  if (typeof datePicker.showPicker === 'function') datePicker.showPicker();
  else datePicker.click();
});
datePicker.addEventListener('change', () => {
  if (!datePicker.value) return;
  selectedDashboardDate = new Date(`${datePicker.value}T12:00:00`);
  renderDashboardDate();
});
renderDashboardDate();

// Map controls
document.querySelectorAll('.map-zoom, .rotate-toggle').forEach((toolbar) => toolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'zoomIn') camera.zoom = Math.min(controls.maxZoom, camera.zoom * 1.2);
  if (act === 'zoomOut') camera.zoom = Math.max(controls.minZoom, camera.zoom / 1.2);
  if (act === 'reset') {
    camera.position.copy(HOME_POS);
    camera.zoom = HOME_ZOOM;
    controls.target.set(0, 0, 0);
  }
  if (act === 'rotate') {
    controls.autoRotate = !controls.autoRotate;
    btn.classList.toggle('on', controls.autoRotate);
  }
  camera.updateProjectionMatrix();
}));

// Import dialog
const dialog = document.getElementById('importDialog');
const form = document.getElementById('importForm');
document.getElementById('importBtn').onclick = () => dialog.showModal();
document.getElementById('importBtnSecondary').onclick = () => dialog.showModal();
document.getElementById('cancelImport').onclick = () => dialog.close();
form.addEventListener('submit', () => {
  const data = new FormData(form);
  const name = data.get('name').trim();
  if (!name) return;
  const bot = {
    id: `bot-${Date.now()}`,
    name,
    role: data.get('role').trim() || 'New coworker',
    color: data.get('color'),
    accessory: null,
    tasks: ['Settling in', 'Finding a desk', 'Reading the onboarding doc'],
  };
  bot.status = pick(bot.tasks);
  bots.push(bot);
  makeBot(bot, bots.length - 1);
  form.reset();
  showView('playground');
  select(bot.id);
  say(bot.id, 'Connected to Relay cloud ✓');
});

/* =========================================================
   Picking bots in 3D
   ========================================================= */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downAt = null;

renderer.domElement.addEventListener('pointerdown', (e) => (downAt = { x: e.clientX, y: e.clientY }));
renderer.domElement.addEventListener('pointerup', (e) => {
  // Ignore drags (that's rotating the camera)
  if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) return;
  const id = hitBot(e);
  // Empty map clicks (roads, buildings, and route overlays) are not actions.
  // Avoid rebuilding the fleet UI or clearing selection when the map background is clicked.
  if (id) select(id);
});
renderer.domElement.addEventListener('pointermove', (e) => {
  renderer.domElement.style.cursor = hitBot(e) ? 'pointer' : 'grab';
});

function hitBot(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const groups = [...botObjects.values()].map((o) => o.group);
  const hit = raycaster.intersectObjects(groups, true)[0];
  return hit ? hit.object.userData.botId : null;
}

/* =========================================================
   Animation loop
   ========================================================= */
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();
  const now = performance.now();

  botObjects.forEach((o, id) => {
    // Idle bob + squish
    const bob = Math.sin(t * 2.2 + o.phase);
    o.body.position.y = 0.2 + bob * 0.018;
    o.body.scale.set(1 + bob * 0.02, 1 - bob * 0.02, 1 + bob * 0.02);

    // Happy hop when selected / greeted
    if (now < o.jumpUntil) {
      const p = 1 - (o.jumpUntil - now) / 500;
      o.body.position.y += Math.sin(p * Math.PI) * 0.5;
    }

    // Wander to a new spot every so often
    if (now > o.wanderAt && !o.target) {
      const free = SPOTS.filter(([x, z]) =>
        [...botObjects.values()].every((b) => b === o || b.group.position.distanceTo(new THREE.Vector3(x, 0, z)) > 1)
      );
      if (free.length) {
        const [x, z] = pick(free);
        o.target = new THREE.Vector3(x, 0, z);
      }
      o.wanderAt = now + 8000 + Math.random() * 10000;
    }
    if (o.target) {
      const pos = o.group.position;
      const dir = o.target.clone().sub(pos);
      const dist = dir.length();
      if (dist < 0.05) {
        o.target = null;
        const bot = bots.find((b) => b.id === id);
        bot.status = pick(bot.tasks);
        if (id === selectedId) document.getElementById('cardStatus').textContent = bot.status;
      } else {
        dir.normalize();
        pos.addScaledVector(dir, Math.min(dist, 0.03));
        const face = Math.atan2(dir.x, dir.z);
        o.group.rotation.y += shortestAngle(o.group.rotation.y, face) * 0.15;
        o.body.position.y += Math.abs(Math.sin(t * 12)) * 0.06; // waddle
      }
    } else {
      // Settle back to facing the camera-ish direction
      o.group.rotation.y += shortestAngle(o.group.rotation.y, Math.PI / 4) * 0.05;
    }

    o.ring.rotation.z = t;
  });

  controls.update();
  renderer.render(scene, camera);
  updateBubbles(now);
  requestAnimationFrame(animate);
}

function shortestAngle(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/* =========================================================
   Resize
   ========================================================= */
function resize() {
  const { clientWidth: w, clientHeight: h } = stage;
  if (!w || !h) return;
  renderer.setSize(w, h);
  const aspect = w / h;
  camera.left = (-FRUSTUM * aspect) / 2;
  camera.right = (FRUSTUM * aspect) / 2;
  camera.top = FRUSTUM / 2;
  camera.bottom = -FRUSTUM / 2;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// Periodic chatter so the office feels alive
setInterval(() => {
  const b = pick(bots);
  say(b.id, b.status + '…', 2200);
}, 7000);

resize();
renderLists();
animate();
