define(['eventbus','c'], function(eventbus,c) {

  var states = [
    { name: 'ESTOP', value: 1 },
    { name: 'ESTOP_RESET', value: 2 },
    { name: 'OFF', value: 3 },
    { name: 'ON', value: 4 }
  ];

  return function createStateControl(machine) {
    var buttons = states.map(function(state) {
      var button = c('button', { class: 'ui button' }, state.name);
      button.onclick = function() {
        machine.command('emcTaskSetState', ['execute', state.value]);
      };
      button.emcstate = state.value;
      return button;
    });

    var task_state = null;
    machine.on('status', function(status) {
      if(!status.task) { return; }
      if (task_state !== status.task.task_state) {
        task_state = status.task.task_state;

        buttons.forEach(function(button) {
          button.classList.toggle('active', button.emcstate === task_state)
        });
      }
    });

    return c('div', { class: 'ui buttons state' }, buttons);
  };
});