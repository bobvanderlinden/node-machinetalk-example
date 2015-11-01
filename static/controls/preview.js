define(['eventbus',
  'controls/preview/axes',
  'controls/preview/head',
  'controls/preview/trace',
  'controls/preview/boundingbox',
  'controls/preview/preview'
  ], function(eventbus,axes,head,trace,boundingbox, preview) {
  return function createPreviewControl(machine) {
    // Initialize THREE
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.up.set(0,0,1);
    camera.position.set(200, 200, 200);


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

    scene.add(axes(machine));
    scene.add(head(machine));
    scene.add(trace(machine));
    scene.add(boundingbox(machine));
    scene.add(preview(machine));


    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
    }
    render();

    return renderer.domElement;
  };
});