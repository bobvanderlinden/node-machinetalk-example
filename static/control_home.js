define(['eventbus','c'], function(eventbus, c) {
  var homeButton = c('button', { class: 'ui button' }, 'Home');
  homeButton.onclick = function() {
    eventbus.emit('command', 'emcTaskSetMode', ['execute', 1]);

    eventbus.emit('command', 'emcAxisUnhome', [0]);
    eventbus.emit('command', 'emcAxisUnhome', [1]);
    eventbus.emit('command', 'emcAxisUnhome', [2]);
    eventbus.emit('command', 'emcAxisUnhome', [3]);

    eventbus.emit('command', 'emcAxisHome', [0]);
    eventbus.emit('command', 'emcAxisHome', [1]);
    eventbus.emit('command', 'emcAxisHome', [2]);
    eventbus.emit('command', 'emcAxisHome', [3]);
  };

  eventbus.on('status',function(status) {
    var homed = status.motion.axis.every(function(axis) {
      return axis.homed;
    });
    homeButton.classList.toggle('active', !homed);
    homeButton.classList.toggle('primary', !homed);
  });

  return homeButton;
});