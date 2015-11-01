define(['eventbus','c'], function(eventbus, c) {
  return function createMachinesControl() {
    var onlineMachines = [];
    var activeMachineUuid = null;

    eventbus.on('socket:reconnecting', function() {
      onlineMachines = [];
      activeMachineUuid = null;
      updateDom();
    });

    eventbus.on('machine:online', function(uuid) {
      console.log('machine online');
      onlineMachines.push(uuid);
      updateDom();
    });
    eventbus.on('machine:offline', function(uuid) {
      onlineMachines.splice(onlineMachines.indexOf(uuid), 1);
      updateDom();
    });

    eventbus.on('socket:reconnecting', function() {
      setActiveMachine(null);
    });


    function updateDom() {
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }

      onlineMachines.forEach(function(uuid) {
        var machineElement = c('li', { class:'item machine'}, uuid);
        machineElement.classList.toggle('active', activeMachineUuid === uuid);
        machineElement.onclick = function() {
          setActiveMachine(uuid);
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

    var root = c('ul', {class: 'ui list machines'}, []);
    return root;
  };
});