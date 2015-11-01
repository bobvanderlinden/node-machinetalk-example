define(['c'], function(c) {
  return function(machine) {
    function onrun() {
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanRun', ['execute',0]);
    }

    return c.button('Run', onrun);
  };
});