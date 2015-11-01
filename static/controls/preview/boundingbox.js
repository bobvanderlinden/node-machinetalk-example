define([], function() {

  function LineBox(box, material) {
    this.box = box;

    var min = this.box.min;
    var max = this.box.max;
    var geometry = new THREE.Geometry();
    geometry.vertices = [
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(min.x, max.y, min.z),
      new THREE.Vector3(min.x, max.y, min.z),
      new THREE.Vector3(max.x, max.y, min.z),
      new THREE.Vector3(max.x, max.y, min.z),
      new THREE.Vector3(max.x, min.y, min.z),
      new THREE.Vector3(max.x, min.y, min.z),
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(min.x, min.y, max.z),
      new THREE.Vector3(min.x, max.y, max.z),
      new THREE.Vector3(min.x, max.y, max.z),
      new THREE.Vector3(max.x, max.y, max.z),
      new THREE.Vector3(max.x, max.y, max.z),
      new THREE.Vector3(max.x, min.y, max.z),
      new THREE.Vector3(max.x, min.y, max.z),
      new THREE.Vector3(min.x, min.y, max.z),
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(min.x, min.y, max.z),
      new THREE.Vector3(min.x, max.y, min.z),
      new THREE.Vector3(min.x, max.y, max.z),
      new THREE.Vector3(max.x, max.y, min.z),
      new THREE.Vector3(max.x, max.y, max.z),
      new THREE.Vector3(max.x, min.y, min.z),
      new THREE.Vector3(max.x, min.y, max.z)
    ];
    geometry.computeBoundingSphere();
    geometry.computeLineDistances();

    THREE.LineSegments.call(this, geometry, material);
  }
  LineBox.prototype = Object.create(THREE.LineSegments.prototype);

  return function createBoundingBox(machine) {
    var lineBoxContainer = new THREE.Object3D();
    var lineBox = null;

    machine.on('status', function(status) {
      var minx, miny, minz;
      var maxx, maxy, maxz;
      var minx = status.config.axis[0].min_position_limit;
      var maxx = status.config.axis[0].max_position_limit;
      var miny = status.config.axis[1].min_position_limit;
      var maxy = status.config.axis[1].max_position_limit;
      var minz = status.config.axis[2].min_position_limit;
      var maxz = status.config.axis[2].max_position_limit;

      var changed = lineBox === null
        || lineBox.box.min.x !== minx
        || lineBox.box.max.x !== maxx
        || lineBox.box.min.y !== miny
        || lineBox.box.max.y !== maxy
        || lineBox.box.min.z !== minz
        || lineBox.box.max.z !== maxz;
      if (changed) {
        console.log('changed');
        lineBoxContainer.remove(lineBox);
        lineBox = new LineBox(new THREE.Box3(
          new THREE.Vector3(minx,miny,minz),
          new THREE.Vector3(maxx,maxy,maxz)
        ), new THREE.LineDashedMaterial({
          color: 0xcc0000,
          dashSize: 10,
          gapSize: 10,
          opacity: 0.3,
          transparent: true
        }));
        lineBoxContainer.add(lineBox);
      }
    });

    return lineBoxContainer;
  };
});