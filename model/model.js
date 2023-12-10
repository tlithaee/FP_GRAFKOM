import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeece6);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 40);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

let mesh;
let sun;

const keyboardState = {};
const mouseState = { x: 0, y: 0 };

let ambientLight;
let directionalLight;
let hemisphereLight;

// Function to create different lighting modes
function setLightingMode(mode) {
  // Remove existing lights and sun
  scene.remove(ambientLight);
  scene.remove(directionalLight);
  scene.remove(hemisphereLight);
  scene.remove(sun);

  // Create new lights based on the mode
  switch (mode) {
    case 'morning':
      ambientLight = new THREE.AmbientLight(0x404040);
      directionalLight = new THREE.DirectionalLight(0xffccaa, 1);
      directionalLight.position.set(10, 50, 10);
      hemisphereLight = new THREE.HemisphereLight(0x87CEFA, 0x006400, 1);
      break;
    case 'day':
      ambientLight = new THREE.AmbientLight(0x404040);
      directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 50, 10);
      hemisphereLight = new THREE.HemisphereLight(0x87CEFA, 0x006400, 1);
      break;
    case 'evening':
      ambientLight = new THREE.AmbientLight(0x404040);
      directionalLight = new THREE.DirectionalLight(0xFFA500, 0.3);
      directionalLight.position.set(10, 50, 10);
      hemisphereLight = new THREE.HemisphereLight(0xFFD700, 0x000000, 0.3);
      break;
    case 'night':
      ambientLight = new THREE.AmbientLight(0x404040);
      directionalLight = new THREE.DirectionalLight(0xaaaaaa, 0.5);
      directionalLight.position.set(10, 50, 10);
      hemisphereLight = new THREE.HemisphereLight(0x000080, 0x000000, 0.5);
      break;
    default:
      break;
  }

  // Create a sun (SpotLight) for day mode
  if (mode === 'day') {
    sun = new THREE.SpotLight(0xffffff, 1);
    sun.position.set(10, 50, 10);
    sun.castShadow = true;
    sun.shadow.bias = -0.0001;
    scene.add(sun);

    // Set the target for the sun to look at
    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(0, 0, 0);
    scene.add(sunTarget);
    sun.target = sunTarget;
  }

  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(hemisphereLight);
}

// Initial lighting mode (you can change this based on your preference)
let lightingMode = 'day';
setLightingMode(lightingMode);

// Function to switch lighting modes
function switchLightingMode() {
  switch (lightingMode) {
    case 'morning':
      lightingMode = 'day';
      break;
    case 'day':
      lightingMode = 'evening';
      break;
    case 'evening':
      lightingMode = 'night';
      break;
    case 'night':
      lightingMode = 'morning';
      break;
    default:
      break;
  }

  setLightingMode(lightingMode);
}

// Add event listener to switch lighting mode on key press (e.g., 'L' key)
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'l') {
    switchLightingMode();
  }
});

window.addEventListener('keydown', (event) => {
  keyboardState[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
  keyboardState[event.key.toLowerCase()] = false;
});

window.addEventListener('mousemove', (event) => {
  mouseState.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseState.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const loader = new GLTFLoader().setPath('/public/models/');
loader.load('scene.gltf', (gltf) => {
  mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.material.roughness = 0.5;
      child.material.metalness = 0.2;
    }
  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);

  // Sembunyikan elemen loading
  document.querySelector('.wrap').style.display = 'none';

  // Setelah menyembunyikan elemen loading, tambahkan mesh ke scene
  // dan panggil fungsi animate untuk memulai rendering
  animate();

}, (xhr) => {
  // Opsi: Perbarui elemen loading dengan persentase progress
  const progressElement = document.querySelector('.text');
  progressElement.innerHTML = `Fetching Assets ${(xhr.loaded / xhr.total * 100)}%`;
});

function animate() {
  requestAnimationFrame(animate);

  if (keyboardState['s']) {
    mesh.position.z -= 0.1;
  } else if (keyboardState['w']) {
    mesh.position.z += 0.1;
  }

  if (keyboardState['d']) {
    mesh.position.x -= 0.1;
  } else if (keyboardState['a']) {
    mesh.position.x += 0.1;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();