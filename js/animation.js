let widthCoverage = 1;
let heightCoverage = 1;

let canvasWidth = window.innerWidth * widthCoverage;
let canvasHeight = window.innerHeight * heightCoverage;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvasWidth / canvasHeight, 0.01, 1000);
scene.add(camera);

camera.position.x = 0;
camera.position.y = -10;
camera.position.z = 30;

const canvas = document.getElementById("animation");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});
renderer.setClearColor(0x000000, 0);

const rows = 50;
const cols = Math.floor(canvasWidth / 8);
const perlinScale = 0.04;
const waveSpeed = 0.2;
const waveHeight = 2;
const FPS = 60;
const startTime = new Date().getTime();

noise.seed(Math.random());

function createGeometry() {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  for (let x = -cols/2; x < cols/2; x++) {
    for (let y = -rows/2; y < rows/2; y++) {
      vertices.push(x, 0, y);
    }
  }

  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positionAttribute);
  return geometry;
}

const geo = createGeometry();
const pointMaterial = new THREE.PointsMaterial({
  size: 0.0001,
  color: new THREE.Color("rgb(240,240,240)")
});
const pointCloud = new THREE.Points(geo, pointMaterial);
scene.add(pointCloud);

function perlinAnimate() {
  let curTime = new Date().getTime();
  let points = pointCloud.geometry.attributes.position;
  let i = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let pX = (x * perlinScale) + ((curTime - startTime) / 1000) * waveSpeed;
      let pZ = (y * perlinScale) + ((curTime - startTime) / 1000) * waveSpeed;
      let value = (noise.simplex2(pX, pZ)) * waveHeight;
      points.setY(i, value);
      i++;
    }
  }
  points.needsUpdate = true;
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  perlinAnimate();
  render();
}

function refreshCanvasState() {
  canvasWidth = window.innerWidth * widthCoverage;
  canvasHeight = window.innerHeight * heightCoverage;
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
}

window.addEventListener('resize', refreshCanvasState);
animate();
refreshCanvasState();