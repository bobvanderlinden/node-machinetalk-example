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
      while (machinelist.firstChild) {
        machinelist.removeChild(machinelist.firstChild);
      }

      onlineMachines.forEach(function(machineDescription) {
        var machineElement = c('a', {class:'item machine'}, [
          c('h3',{}, machineDescription.host),
          c('p',{}, machineDescription.uuid)
        ]);
        machineElement.classList.toggle('active', activeMachineUuid === machineDescription.uuid);
        machineElement.onclick = function() {
          setActiveMachine(machineDescription.uuid);
        };
        machinelist.appendChild(machineElement);
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

    var machinelist;
    var root = c.div({class: 'machinelist fill'},[
      c.div({ class: 'container'}, [
        c.text('Machines:'),
        machinelist = c('ul', {class: 'ui vertical menu'}, [])
      ])
    ]);
    return root;
  };
});