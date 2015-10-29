define(['eventbus','c'], function(eventbus,c) {
  var taskState;
  var active;

  var estopButton = c.button('Power', function() {
    if (active) {
      eventbus.emit('command', 'emcTaskSetState', ['execute', 3]);
    } else {
      eventbus.emit('command', 'emcTaskSetState', ['execute', 4]);
    }
  });
  eventbus.on('status', function(status) {
    if (taskState !== status.task.task_state) {
      taskState = status.task.task_state;
      active = taskState === 4;
      estopButton.classList.toggle('active', active);
    }
  });
  return estopButton;
});