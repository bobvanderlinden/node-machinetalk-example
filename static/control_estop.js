define(['eventbus','c'], function(eventbus,c) {
  var taskState;
  var active;

  var estopButton = c.button('Estop', function() {
    if (active) {
      eventbus.emit('command', 'emcTaskSetState', ['execute', 2]);
    } else {
      eventbus.emit('command', 'emcTaskSetState', ['execute', 1]);
    }
  });
  eventbus.on('status', function(status) {
    if (taskState !== status.task.task_state) {
      taskState = status.task.task_state;
      active = taskState === 1;
      estopButton.classList.toggle('active', active);
    }
  });
  return estopButton;
});