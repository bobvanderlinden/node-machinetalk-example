define(['c'], function(c) {
  return function createPreview(machine) {
    var previewObject = new THREE.Object3D();
    var material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.8,
      linewidth: 2
    });
    machine.on('preview', function(preview) {
      var geometry = createGeometry(preview);
      var line = new THREE.Line(geometry, material);
      previewObject.add(line);
    });

    function createGeometry(preview) {
      var positions = new Float32Array(preview.length * 3);
      var j = 0;
      for(var i=0;i<preview.length;i++) {
        if (preview[i].type !== 3)  { continue; }
        positions[j * 3 + 0] = preview[i].pos.x;
        positions[j * 3 + 1] = preview[i].pos.y;
        positions[j * 3 + 2] = preview[i].pos.z;
        j++;
      }
      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, j);
      return geometry;
    }

    return previewObject;
  };
});