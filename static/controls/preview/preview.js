define(['c'], function(c) {
  var PreviewOp = {
    STRAIGHT_PROBE:      1,
    RIGID_TAP:           2,
    STRAIGHT_FEED:       3,
    ARC_FEED:            4,
    STRAIGHT_TRAVERSE:   5,
    SET_G5X_OFFSET:      6,
    SET_G92_OFFSET:      7,
    SET_XY_ROTATION:     8,
    SELECT_PLANE:        9,
    SET_TRAVERSE_RATE:   10,
    SET_FEED_RATE:       11,
    CHANGE_TOOL:         12,
    CHANGE_TOOL_NUMBER:  13,
    DWELL:               14,
    MESSAGE:             15,
    COMMENT:             16,
    USE_TOOL_OFFSET:     17,
    SET_PARAMS:          18, // kins, axismask, angle_units, length_unit,
    SET_FEED_MODE:       19,
    SOURCE_CONTEXT:      20,
  };

  return function createPreview(machine) {
    var currentFile = null;
    var color = new THREE.Color(0xffffff);
    var travelColor = new THREE.Color(0x333333);

    var previewObject = new THREE.Object3D();
    var material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.8,
      linewidth: 1,
      transparent: true,
      vertexColors: THREE.VertexColors
    });
    machine.on('preview', function(preview) {
      createObjects(preview);
      endPath();
    });

    machine.on('status', function(status) {
      if (status.task.file !== currentFile) {
        currentFile = status.task.file;
        clear();
        if (currentFile !== '') {
          machine.command('emcTaskPlanOpen', ['preview', currentFile]);
          machine.command('emcTaskPlanRun', ['preview', 0]);
        }
      }
    });

    function clear() {
      while(previewObject.children.length > 0) {
        previewObject.remove(previewObject.children[0]);
      }
    }

    function createObjects(preview) {

      for(var i=0;i<preview.length;i++) {
        var item = preview[i];
        switch(item.type) {
          case PreviewOp.ARC_FEED:
            processPathArc(item);
            break;
          case PreviewOp.STRAIGHT_FEED:
          case PreviewOp.STRAIGHT_TRAVERSE:
            // HACK: This converts inches to mm.
            // TODO: Figure out where units for previews are exposed.
            // preview[i].pos.x *= 25.4;
            // preview[i].pos.y *= 25.4;
            // preview[i].pos.z *= 25.4;

            processPathStraight(item);
            break;
        }
      }
    }
    var currentPathItem = null;

    function processPathStraight(item) {
      if (currentPathItem && currentPathItem.type !== 'line') {
        endPath();
      }
      if (!currentPathItem) {
        currentPathItem = {
          type: 'line',
          geometry: new THREE.Geometry()
        };
      }

      currentPathItem.geometry.vertices.push(new THREE.Vector3(
        item.pos.x,
        item.pos.y,
        item.pos.z
      ));
      currentPathItem.geometry.colors.push(item.type == 3
        ? color
        : travelColor
      );
    }

    function processPathArc(item) {
      if (currentPathItem && currentPathItem.type !== 'arc') {
        endPath();
      }
      if (!currentPathItem) {
        currentPathItem = {
          type: 'arc',
          geometry: new THREE.Geometry()
        };
      }
    }

    function endPath() {
      if (currentPathItem === null) { return; }
      switch(currentPathItem.type) {
        case 'line':
          previewObject.add(new THREE.Line(currentPathItem.geometry, material));
          break;
        case 'arc':
          break;
      }
      currentPathItem = null;
    }

    return previewObject;
  };
});