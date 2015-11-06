define(['eventbus','c'], function(eventbus,c) {
  return function createEstopMenuItem(machine) {
    var taskState;
    var active;

    var estopButton = c('a', {class: 'ui item'},[
      c.icon('remove circle'),
      c.text('Estop')
    ]);

    estopButton.onclick = estop;

    function estop() {
      if (active) {
        machine.command('emcTaskSetState', ['execute', 2]);
      } else {
        machine.command('emcTaskSetState', ['execute', 1]);
      }
    }
    machine.on('status', function(status) {
      var newTaskState = status.task && status.task.task_state;
      if (taskState !== newTaskState) {
        taskState = newTaskState;
        active = taskState === 1;
        estopButton.classList.toggle('active', active);
      }
    });
    return estopButton;
  };
});