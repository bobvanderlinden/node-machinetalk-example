define(['eventbus','c'], function(eventbus, c) {
  return function createHomeAllControl(machine) {
    var homeButton = c('button', { class: 'ui button icon labeled' }, [
      c.icon('home'),
      c.text('Home All')
    ]);
    var axesCount = 0;
    homeButton.onclick = function() {
      machine.command('emcTaskSetMode', ['execute', 1]);

      for(var i=0;i<axesCount;i++) {
        machine.command('emcAxisUnhome', [i]);
      }

      for(var i=0;i<axesCount;i++) {
        machine.command('emcAxisHome', [i]);
      }
    };

    machine.on('status',function(status) {
      var homed = status.motion.axis.every(function(axis) {
        return axis.homed;
      });
      axesCount = status.motion.axis.length;
      homeButton.classList.toggle('primary', !homed);
    });

    return homeButton;
  };
});