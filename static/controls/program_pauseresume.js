define(['c'], function(c) {
  return function(machine) {
    function onpause() {
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanPause', ['execute']);
    }

    function onresume() {
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanResume', ['execute']);
    }

    var button = c.button('Resume', onpause);

    return button;
  };
});