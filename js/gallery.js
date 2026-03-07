import { students } from "./data.js";

const container = document.getElementById("scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020617);

const camera = new THREE.PerspectiveCamera(
  70,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// ===== STUDENT PANELS =====
const panels = [];

students.forEach((student, i) => {
  const geo = new THREE.BoxGeometry(1.8, 1.2, 0.2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.3,
    roughness: 0.4
  });

  const panel = new THREE.Mesh(geo, mat);
  panel.position.set(i * 3 - 3, 0, 0);
  panel.userData.studentId = student.id;

  scene.add(panel);
  panels.push(panel);
});

// ===== RAYCASTING =====
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function getPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  pointer.set(x, y);
}

// Desktop click
renderer.domElement.addEventListener("click", (e) => {
  getPointer(e);
  raycaster.setFromCamera(pointer, camera);
  checkIntersection();
});

// Mobile touch
renderer.domElement.addEventListener("touchstart", (e) => {
  getPointer(e.touches[0]);
  raycaster.setFromCamera(pointer, camera);
  checkIntersection();
});

function checkIntersection() {
  const hits = raycaster.intersectObjects(panels);

  if (hits.length > 0) {
    const id = hits[0].object.userData.studentId;
    localStorage.setItem("studentId", id);
    window.location.href = "project.html";
  }
}

// ===== ANIMATION =====
function animate() {
  requestAnimationFrame(animate);
  panels.forEach(p => p.rotation.y += 0.005);
  renderer.render(scene, camera);
}
animate();

// ===== RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
