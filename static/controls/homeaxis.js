define(['eventbus','c'], function(eventbus, c) {
  return function createHomeAllControl(machine, axisIndex) {
    var homeButton = c('button', { class: 'ui button icon labeled' }, [
      c.icon('home'),
      c.text('Home ' + axisIndex)
    ]);
    homeButton.onclick = function() {
      machine.command('emcTaskSetMode', ['execute', 1]);

      machine.command('emcAxisUnhome', [axisIndex]);
      machine.command('emcAxisHome', [axisIndex]);
    };

    machine.on('status',function(status) {
      var homed = status.motion.axis[axisIndex].homed;
      homeButton.classList.toggle('primary', !homed);
    });

    return homeButton;
  };
});