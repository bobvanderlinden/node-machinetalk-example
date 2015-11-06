define(['eventbus','c'], function(eventbus,c) {
  return function createPowerControl(machine) {
    var taskState;
    var active;

    var powerButton = c('a', { class: 'ui item' }, [
      c.icon('power'),
      c.text('Power')
    ]);

    powerButton.onclick = power;

    function power() {
      if (active) {
        machine.command('emcTaskSetState', ['execute', 3]);
      } else {
        machine.command('emcTaskSetState', ['execute', 4]);
      }
    }
    machine.on('status', function(status) {
      var newTaskState = status.task && status.task.task_state;
      if (taskState !== newTaskState) {
        taskState = newTaskState;
        active = taskState === 4;
        powerButton.classList.toggle('active', active);
      }
    });
    return powerButton;
  };
});