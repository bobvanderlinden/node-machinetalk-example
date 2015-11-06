define(['eventbus', 'c', 'eventemitter', 'controls/machinelist', 'controls/machine'], function(eventbus, c, EventEmitter, control_machinelist, control_machine) {
  function Machine(uuid) {
    this.uuid = uuid;
    EventEmitter.call(this);
  }
  Machine.prototype = new EventEmitter();
  Machine.prototype.command = function(/*...*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log(args);
    console.log(['machine:command', this.uuid].concat(args));
    eventbus.emit.apply(eventbus, ['machine:command', this.uuid].concat(args));
  };

  var machines = {};
  function getMachine(uuid) {
    var machine = machines[uuid];
    if (!machine) {
      machine = machines[uuid] = new Machine(uuid);
    }
    return machine;
  }

  eventbus.on('machine:online', function(machineDescription) {
    var machine = getMachine(machineDescription.uuid);
    machine.host = machineDescription.host;
    machine.emit('online');
  });
  eventbus.on('machine:offline', function(machineDescription) {
    getMachine(machineDescription.uuid).emit('offline');
  });
  eventbus.on('machine:status', function(uuid, status) {
    console.log('machine:status', uuid, status);
    var machine = getMachine(uuid);
    machine.status = status;
    machine.emit('status', status);
  });
  eventbus.on('machine:error', function(uuid, type, error) {
    console.log('machine:error', uuid, type, error);
    getMachine(uuid).emit('error', type, error);
  });
  eventbus.on('machine:display', function(uuid, type, display) {
    console.log('machine:display', uuid, type, display);
    getMachine(uuid).emit('display', type, display);
  });
  eventbus.on('machine:text', function(uuid, type, text) {
    console.log('machine:text', uuid, type, text);
    getMachine(uuid).emit('text', type, text);
  });
  eventbus.on('machine:preview', function(uuid, preview) {
    getMachine(uuid).emit('preview', preview);
  });

  var activeMachine = null;
  var machinelistContainer;
  var machineContainer;

  eventbus.on('machine:active', function(uuid) {
    setActiveMachine(uuid && getMachine(uuid));
  });

  eventbus.on('machine:inactive', function() {
    setActiveMachine(null);
  });

  function setActiveMachine(machine) {
    if (machine === activeMachine) { return; }
    if (activeMachine) {
      activeMachine.emit('inactive');
    }
    activeMachine = machine;
    while (rootElement.firstChild) {
        rootElement.removeChild(rootElement.firstChild);
    }
    if (activeMachine) {
      rootElement.appendChild(control_machine(activeMachine));
      activeMachine.emit('active');
    } else {
      rootElement.appendChild(control_machinelist());
    }
  }

  var rootElement = c.div({ class: 'screen frame' }, [
    control_machinelist()
  ]);

  function onDomLoaded() {
    document.body.appendChild(rootElement);

    // HACK: Haven't found a way to initialize socket.io without connecting to server.
    //       We need to wait until other components are loaded before loading socket.io.
    require(['socket']);
  }

  $(function() {
    onDomLoaded();
  });
});