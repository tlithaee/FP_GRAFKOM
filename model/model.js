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

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 5;
// controls.maxDistance = 50;
// controls.minPolarAngle = 0.5;
// controls.maxPolarAngle = 1.5;
// controls.autoRotate = false;
// controls.target = new THREE.Vector3(0, 1, 0);
// controls.update();

let mesh;
let sun;

const keyboardState = {};
const mouseState = { x: 0, y: 0 };

let ambientLight;
let directionalLight;
let hemisphereLight;

let cameraDirection = new THREE.Vector3();
let cameraRight = new THREE.Vector3();

// Function to create different lighting modes
function setLightingMode(mode) {
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

  if (mode === 'day') {
    sun = new THREE.SpotLight(0xffffff, 1);
    sun.position.set(10, 50, 10);
    sun.castShadow = true;
    sun.shadow.bias = -0.0001;
    scene.add(sun);

    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(0, 0, 0);
    scene.add(sunTarget);
    sun.target = sunTarget;
  }

  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(hemisphereLight);
}

let lightingMode = 'day';
setLightingMode(lightingMode);

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

function lockPointer() {
  renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock ||
                                           renderer.domElement.mozRequestPointerLock ||
                                           renderer.domElement.webkitRequestPointerLock;
  renderer.domElement.requestPointerLock();
}

renderer.domElement.addEventListener('click', lockPointer, false);

function onPointerMove(event) {
  if (document.pointerLockElement === renderer.domElement ||
      document.mozPointerLockElement === renderer.domElement ||
      document.webkitPointerLockElement === renderer.domElement) {
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    const sensitivity = 0.00000000000001; // Sesuaikan sensitivitas sesuai kebutuhan
    camera.rotation.y -= movementX * sensitivity;

    // Menghitung dan membatasi rotasi baru untuk sumbu X
    let newRotationX = camera.rotation.x - movementY * sensitivity;
    newRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotationX));
    
    // Memperbarui rotasi kamera dengan mencegah rotasi di sekitar sumbu Z
    camera.rotation.set(newRotationX, camera.rotation.y, 0);
  }
}

document.addEventListener('mousemove', onPointerMove, false);

window.addEventListener('keydown', (event) => {
  keyboardState[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
  keyboardState[event.key.toLowerCase()] = false;
});

window.addEventListener('mousemove', (event) => {
  let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  camera.rotation.y -= movementX * 0.002;
  camera.rotation.x -= movementY * 0.002;
  camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
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

  document.querySelector('.wrap').style.display = 'none';

  animate();

}, (xhr) => {
  const progressElement = document.querySelector('.text');
  progressElement.innerHTML = `Fetching Assets ${(xhr.loaded / xhr.total * 100)}%`;
});

function animate() {
  requestAnimationFrame(animate);

  camera.getWorldDirection(cameraDirection);
  cameraRight.crossVectors(camera.up, cameraDirection).normalize();

  let forwardDirection = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
  
  if (keyboardState['s']) {
    mesh.position.addScaledVector(forwardDirection, 0.1);
  }
  if (keyboardState['w']) {
    mesh.position.addScaledVector(forwardDirection, -0.1);
  }
  if (keyboardState['d']) {
    mesh.position.addScaledVector(cameraRight, 0.1);
  }
  if (keyboardState['a']) {
    mesh.position.addScaledVector(cameraRight, -0.1);
  }

  camera.position.y = 7.0;

  renderer.render(scene, camera);
}

animate();