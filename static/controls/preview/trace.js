define([], function() {
  return function createTrace(machine) {
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
    traceLine.frustumCulled = false;

    machine.on('status', function(status) {
      tracePositions[traceLength * 3 + 0] = status.motion.position.x;
      tracePositions[traceLength * 3 + 1] = status.motion.position.y;
      tracePositions[traceLength * 3 + 2] = status.motion.position.z;
      traceLength++;
      traceGeometry.setDrawRange(0, traceLength);
      traceLine.geometry.attributes.position.needsUpdate = true;
    });

    return traceLine;
  };
});