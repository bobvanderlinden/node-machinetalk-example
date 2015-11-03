define(['eventbus','c'], function(eventbus, c) {
  return function createMachinesControl() {
    var onlineMachines = [];
    var activeMachineUuid = null;

    eventbus.on('socket:reconnecting', function() {
      onlineMachines = [];
      activeMachineUuid = null;
      updateDom();
    });

    eventbus.on('machine:online', function(machineDescription) {
      console.log('machine online');
      onlineMachines.push(machineDescription);
      updateDom();
    });
    eventbus.on('machine:offline', function(machineDescription) {
      for(var i=0;i<onlineMachines.length;i++) {
        if (onlineMachines[i].uuid === machineDescription.uuid) {
          break;
        }
      }
      onlineMachines.splice(i, 1);
      updateDom();
    });

    eventbus.on('socket:reconnecting', function() {
      setActiveMachine(null);
    });


    function updateDom() {
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }

      onlineMachines.forEach(function(machineDescription) {
        var machineElement = c('li', {class:'machine'}, machineDescription.host);
        machineElement.classList.toggle('active', activeMachineUuid === machineDescription.uuid);
        machineElement.onclick = function() {
          setActiveMachine(machineDescription.uuid);
        };
        root.appendChild(machineElement);
      });
    }

    function setActiveMachine(uuid) {
      if (activeMachineUuid) {
        eventbus.emit('machine:unsubscribe', activeMachineUuid);
      }
      activeMachineUuid = uuid;
      if (activeMachineUuid) {
        eventbus.emit('machine:subscribe', activeMachineUuid);
      }
      eventbus.emit('machine:active', activeMachineUuid);
      updateDom();
    }

    var root = c('ul', {class: 'machines'}, []);
    return root;
  };
});