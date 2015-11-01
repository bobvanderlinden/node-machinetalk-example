define([], function() {
  return function createAxes(machine) {
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

    var axes = new THREE.Object3D();
    axes.add(createAxis(new THREE.Vector3(1, 0, 0), 0xff0000));
    axes.add(createAxis(new THREE.Vector3(0, 1, 0), 0x00ff00));
    axes.add(createAxis(new THREE.Vector3(0, 0, 1), 0x0000ff));
    return axes;
  };
});