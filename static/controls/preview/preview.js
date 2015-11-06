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
        var item = preview[i];
        switch(item.type) {
          case 3:
          case 5:
            // HACK: This converts inches to mm.
            // TODO: Figure out where units for previews are exposed.
            preview[i].pos.x *= 25.4;
            preview[i].pos.y *= 25.4;
            preview[i].pos.z *= 25.4;
            positions[j * 3 + 0] = preview[i].pos.x;
            positions[j * 3 + 1] = preview[i].pos.y;
            positions[j * 3 + 2] = preview[i].pos.z;
            j++;
            break;
        }
      }
      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, j);
      return geometry;
    }

    return previewObject;
  };
});