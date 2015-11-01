define(['eventbus','c'], function(eventbus,c) {

  var states = [
    { name: 'Manual', value: 1 },
    { name: 'Auto', value: 2 },
    { name: 'Mdi', value: 3 }
  ];

  return function createModeControl(machine) {
    var buttons = states.map(function(state) {
      var button = c('button', { class: 'ui button' }, state.name);
      button.onclick = function() {
        machine.command('emcTaskSetMode', ['execute', state.value]);
      };
      button.emcstate = state.value;
      return button;
    });

    var task_mode = null;
    machine.on('status', function(status) {
      if(!status.task) { return; }
      if (task_mode !== status.task.task_mode) {
        task_mode = status.task.task_mode;

        buttons.forEach(function(button) {
          button.classList.toggle('active', button.emcstate === task_mode)
        });
      }
    });

    return c('div', { class: 'ui buttons mode' }, buttons);
  };
});