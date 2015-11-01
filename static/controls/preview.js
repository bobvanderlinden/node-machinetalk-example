define(['eventbus'], function(eventbus) {
  return function createPreviewControl(machine) {
    // Initialize THREE
    var scene = new THREE.Scene();
    scene.rotateX(-Math.PI/2);

    var camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.position.set(0, 0, 500);


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);
    for(var i=0;i<5;i++) {
      var light = new THREE.PointLight(0x333333, 1, 0);
      light.position.set(i*20-10, 0, 0);
      scene.add(light);
    }

    function createAxis(vector, color) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0,0,0));
      geometry.vertices.push(vector.multiplyScalar(100));
      var material = new THREE.LineBasicMaterial({
        color: color,
        opacity: 0.5,
        linewidth: 1,
        transparent: true
      });
      return new THREE.Line(geometry, material);
    }

    scene.add(createAxis(new THREE.Vector3(1, 0, 0), 0xff0000));
    scene.add(createAxis(new THREE.Vector3(0, 1, 0), 0x00ff00));
    scene.add(createAxis(new THREE.Vector3(0, 0, 1), 0x0000ff));

    function createPhongMaterial(color) {
      return new THREE.MeshPhongMaterial({
        color: color,
        emissive: 0x000000,
        specular: 0x111111,
        shininess: 30,
        shading: THREE.FlatShading
      });
    }

    var headGeometry = new THREE.CylinderGeometry(0, 2, 10, 32);
    headGeometry.rotateX(-Math.PI / 2);
    headGeometry.translate(0, 0, 5);
    var head = new THREE.Mesh(
      headGeometry,
      createPhongMaterial(0xcccccc)
    );
    head.position.set(0, 0, 0);
    scene.add(head);

    var traceMaxLength = 1000;
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

    machine.on('status', function(status) {
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

    return renderer.domElement;
  };
});