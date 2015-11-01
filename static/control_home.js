define(['eventbus','c'], function(eventbus, c) {
  return function createHomeControl(machine) {
    var homeButton = c('button', { class: 'ui button' }, 'Home');
    homeButton.onclick = function() {
      machine.command('emcTaskSetMode', ['execute', 1]);

      machine.command('emcAxisUnhome', [0]);
      machine.command('emcAxisUnhome', [1]);
      machine.command('emcAxisUnhome', [2]);
      machine.command('emcAxisUnhome', [3]);

      machine.command('emcAxisHome', [0]);
      machine.command('emcAxisHome', [1]);
      machine.command('emcAxisHome', [2]);
      machine.command('emcAxisHome', [3]);
    };

    machine.on('status',function(status) {
      var homed = status.motion.axis.every(function(axis) {
        return axis.homed;
      });
      homeButton.classList.toggle('active', !homed);
      homeButton.classList.toggle('primary', !homed);
    });

    return homeButton;
  };
});