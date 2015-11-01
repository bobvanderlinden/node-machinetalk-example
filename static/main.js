define(['eventbus', 'c', 'eventemitter', 'control_machines', 'control_machine'], function(eventbus, c, EventEmitter, control_machines, control_machine) {
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

  eventbus.on('machine:online', function(uuid) {
    getMachine(uuid).emit('online');
  });
  eventbus.on('machine:offline', function(uuid) {
    getMachine(uuid).emit('offline');
  });
  eventbus.on('machine:status', function(uuid, status) {
    console.log('machine:status', uuid, status);
    getMachine(uuid).emit('status', status);
  });

  var activeMachine = null;
  eventbus.on('machine:active', function(uuid) {
    if (activeMachine) {
      activeMachine.emit('inactive');
    }
    activeMachine = uuid && getMachine(uuid);

    while (machineContainer.firstChild) {
        machineContainer.removeChild(machineContainer.firstChild);
    }
    if (activeMachine) {
      machineContainer.appendChild(control_machine(activeMachine));
      activeMachine.emit('active');
    }
  });


  var machineContainer = c('div', { class: 'machinecontainer' }, []);

  var rootElement = c('div', { class: 'main ui container' }, [
    control_machines(),
    machineContainer
  ]);

  require(['socket']);

  function onDomLoaded() {
    console.log(typeof rootElement);
    document.body.appendChild(rootElement);
  }

  console.log('readystate', document.readyState);
  if (document.readyState === 'complete') {
    onDomLoaded();
  } else {
    document.addEventListener("DOMContentLoaded", onDomLoaded);
  }
});