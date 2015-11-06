define([], function() {
  return function createTrace(machine) {
    var traceMaxLength = 4096;
    var traceGeometry = new THREE.BufferGeometry();
    var tracePositions = new Float32Array(traceMaxLength * 3);
    traceGeometry.addAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
    var traceLength = 0;
    //traceGeometry.setDrawRange(0, traceLength);
    traceGeometry.dynamic = true;

    var traceMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      linewidth: 2,
      transparent: true
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