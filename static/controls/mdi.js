define(['eventbus','c'], function(eventbus, c) {
  return function createMdiControl(machine) {
    var mdiInput = c('input', {placeholder: ''}, []);
    var executeButton = c('button', {class: 'ui button'}, 'Execute');
    var history = c.div({ class: 'history', style: 'overflow: auto; height: 20em;'}, []);

    executeButton.onclick = execute;
    mdiInput.onkeypress = function(e) {
      if (e.keyCode === 13 || e.keyCode === 10) {
        e.preventDefault();
        execute();
      }
    };
    function execute() {
      var command = mdiInput.value;
      machine.command('emcTaskSetMode', ['execute', 3]);
      machine.command('emcTaskPlanExecute', ['execute', command]);

      var historyItem = c.div({}, command);
      historyItem.onclick = fromHistory.bind(null, command);
      history.appendChild(historyItem);
      history.scrollTop = history.scrollHeight;

      mdiInput.value = '';
    }
    function fromHistory(command) {
      mdiInput.value = command;
    }

    return c.div({ }, [
      history,
      c('div', {class: 'ui action input'}, [
        mdiInput,
        executeButton
      ])
    ]);
  };
});