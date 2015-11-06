define(['c'], function(c) {
  var ExecState = {
    ERROR: 1,
    DONE: 2,
    WAITING_FOR_MOTION: 3,
    WAITING_FOR_MOTION_QUEUE: 4,
    WAITING_FOR_IO: 5,
    WAITING_FOR_MOTION_AND_IO: 7,
    WAITING_FOR_DELAY: 8,
    WAITING_FOR_SYSTEM_CMD: 9,
    WAITING_FOR_SPINDLE_ORIENTED: 10,
  };
  var TaskMode = {
    MANUAL: 1,
    AUTO: 2,
    MDI: 3
  };
  var TaskState = {
    ESTOP: 1,
    ESTOPRESET: 2,
    OFF: 3,
    ON: 4
  };
  var InterpState = {
    IDLE: 1,
    READING: 2,
    PAUSED: 3,
    WAITING: 4
  };
  return function(machine) {
    function ensureTaskMode(mode) {
      if (machine.status.task.task_mode !== mode) {
        machine.command('emcTaskSetMode', ['execute', mode]);
      }
    }

    function onrun() {
      ensureTaskMode(TaskMode.AUTO);
      machine.command('emcTaskPlanRun', ['execute',0]);
    }

    function onstep() {
      ensureTaskMode(TaskMode.AUTO);
      machine.command('emcTaskPlanStep', ['execute']);
    }

    function onpause() {
      ensureTaskMode(TaskMode.AUTO);
      machine.command('emcTaskPlanPause', ['execute']);
    }

    function onresume() {
      ensureTaskMode(TaskMode.AUTO);
      machine.command('emcTaskPlanResume', ['execute']);
    }

    function onstop() {
      ensureTaskMode(TaskMode.AUTO);
      machine.command('emcTaskAbort', ['execute']);
    }

    function setEnabled(element, condition) {
      element.classList.toggle('disabled', !condition);
    }

    machine.on('status', function(status) {
      var taskPaused = status.task.task_paused;
      var interpState = status.interp.interp_state;

      var isRunning = (status.task.task_mode === TaskMode.AUTO || status.task.task_mode === TaskMode.MDI) && status.interp.interp_state != InterpState.IDLE;

      setEnabled(runButton, !isRunning);
      runButton.classList.toggle('active', isRunning);

      setEnabled(stepButton, true);

      setEnabled(pauseButton, isRunning);
      pauseButton.classList.toggle('active', taskPaused);

      setEnabled(resumeButton, taskPaused);

      setEnabled(stopButton, isRunning);
    });

    function createButton(icon, onclick) {
      var button = c('button',{class:'ui button icon'}, [c.icon(icon)]);
      button.onclick = onclick;
      return button;
    }

    var runButton = createButton('play', onrun);
    var stepButton = createButton('arrow right', onstep);
    var pauseButton = createButton('pause', onpause);
    var resumeButton = createButton('play', onresume);
    var stopButton = createButton('stop', onstop);


    var button = c.div({ class: 'ui buttons' }, [
      runButton,
      stepButton,
      pauseButton,
      resumeButton,
      stopButton
    ]);

    return button;
  };
});