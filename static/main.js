// Initialize THREE
var scene = new THREE.Scene();
scene.translateX(-65);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);


var renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

// var controls = new THREE.FlyControls(camera, renderer.domElement);
// controls.dragToLook = true;

var light = new THREE.AmbientLight(0x404040);
scene.add(light);
for(var i=0;i<5;i++) {
  var light = new THREE.PointLight(0x333333, 1, 0);
  light.position.set(i*20-10, 0, 0);
  scene.add(light);
}

function createPhongMaterial(color) {
  return new THREE.MeshPhongMaterial({
    color: color,
    emissive: 0x000000,
    specular: 0x111111,
    shininess: 30,
    shading: THREE.FlatShading
  });
}

var cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  createPhongMaterial(0xffffff)
);

scene.add(cube);

var headGeometry = new THREE.CylinderGeometry(0, 2, 10, 32);
headGeometry.rotateX(-Math.PI / 2);
headGeometry.translate(0, 0, 5);
var head = new THREE.Mesh(
  headGeometry,
  createPhongMaterial(0xcccccc)
);
head.position.set(0, 0, 0);
scene.add(head);

var traceMaxLength = 500;
var traceGeometry = new THREE.BufferGeometry();
var tracePositions = new Float32Array(traceMaxLength * 3);
traceGeometry.addAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
var traceLength = 2;
//traceGeometry.setDrawRange(0, traceLength);
traceGeometry.dynamic = true;

var traceMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  opacity: 1,
  linewidth: 3
});
var traceLine = new THREE.Line(traceGeometry, traceMaterial);
scene.add(traceLine);

var statusBox = document.createElement('pre');
var socket = io();

socket.on('status', function(status) {
  statusBox.textContent = JSON.stringify(status, '  ', '  ');
  tracePositions[traceLength * 3 + 0] = status.motion.position.x;
  tracePositions[traceLength * 3 + 1] = status.motion.position.y;
  tracePositions[traceLength * 3 + 2] = status.motion.position.z;
  traceLength++;
  traceGeometry.setDrawRange(0, traceLength);
  traceLine.geometry.attributes.position.needsUpdate = true;

  head.position.set(
    status.motion.position.x,
    status.motion.position.y,
    status.motion.position.z
  );
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

document.addEventListener("DOMContentLoaded", function(event) {
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(statusBox);
});