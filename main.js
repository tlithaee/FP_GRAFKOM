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

const groundGeometry = new THREE.PlaneGeometry(0, 0, 30, 30);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});

const spotLight = new THREE.SpotLight(0x7F7FFF);
spotLight.position.set(10, 50, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const spotLight1 = new THREE.SpotLight(0xDA70D6);
spotLight1.position.set(10, 30, 10);
spotLight1.castShadow = true;
spotLight1.shadow.bias = -0.0001;
scene.add(spotLight1);

let mesh;

const keyboardState = {};
const mouseState = { x: 0, y: 0 };

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

  // camera.rotation.y = mouseState.x * Math.PI;
  // camera.rotation.x = mouseState.y * Math.PI;

  controls.update();
  renderer.render(scene, camera);
}

const loader = new GLTFLoader().setPath('public/models/');
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

  document.getElementById('progress-container').style.display = 'none';
}, ( xhr ) => {
  document.getElementById('progress').innerHTML = `LOADING ${Math.max(xhr.loaded / xhr.total, 1) * 100}/100`;
});

animate();
