define(['c'], function(c) {
  return function(machine) {
    var pathinput;

    function onopen() {
      var path = pathinput.value;
      if (path[0] !== '/') {
        // Add remote_path in front of path.
        // for instance $HOME/machinekit/nc_files
        path = machine.status.config.remote_path + '/' + path;
      }
      machine.command('emcTaskSetMode', ['execute', 2]);
      machine.command('emcTaskPlanOpen', ['execute', pathinput.value]);
    }

    return c.div({ class: 'ui action input' }, [
      pathinput = c('input'),
      c.button('Open', onopen)
    ]);
  };
});