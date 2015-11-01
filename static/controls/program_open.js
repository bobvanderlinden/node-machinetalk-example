define(['c'], function(c) {
  return function(machine) {
    var pathinput;

    function onopen() {
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanOpen', ['execute', pathinput.value]);
    }

    return c.div({ class: 'ui action input' }, [
      pathinput = c('input'),
      c.button('Open', onopen)
    ]);
  };
});