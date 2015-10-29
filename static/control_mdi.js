define(['eventbus','c'], function(eventbus, c) {
  var mdiInput = c('input', {placeholder: ''}, []);
  var executeButton = c('button', {class: 'ui button'}, 'Execute');

  executeButton.onclick = function() {
    eventbus.emit('command', 'emcTaskSetMode', ['execute', 3]);
    eventbus.emit('command', 'emcTaskPlanExecute', ['execute', mdiInput.value]);
    mdiInput.value = '';
  };

  return c('div', {class: 'ui action input'}, [
    mdiInput,
    executeButton
  ]);
});