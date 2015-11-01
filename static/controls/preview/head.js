define([], function() {
  return function createHead(machine) {
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

    machine.on('status', function(status) {
      head.position.set(
        status.motion.position.x,
        status.motion.position.y,
        status.motion.position.z
      );
    });

    return head;
  };
});