define(['c'], function(c) {
  return function(machine) {
    var pathinput;

    function onopen() {
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanOpen', ['execute', pathinput.value]);
      machine.command('emcTaskPlanOpen', ['preview', pathinput.value]);
      machine.command('emcTaskPlanRun', ['preview', 0]);
    }

    return c.div({ class: 'ui action input' }, [
      pathinput = c('input'),
      c.button('Open', onopen)
    ]);
  };
});