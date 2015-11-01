define(['eventbus','c'], function(eventbus, c) {
  return function createMdiControl(machine) {
    var mdiInput = c('input', {placeholder: ''}, []);
    var executeButton = c('button', {class: 'ui button'}, 'Execute');

    executeButton.onclick = function() {
      machine.command('emcTaskSetMode', ['execute', 3]);
      machine.command('emcTaskPlanExecute', ['execute', mdiInput.value]);
      mdiInput.value = '';
    };

    return c('div', {class: 'ui action input'}, [
      mdiInput,
      executeButton
    ]);
  };
});