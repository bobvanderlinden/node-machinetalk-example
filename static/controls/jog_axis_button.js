define(['c'], function(c) {
  return function createJogButton(options, attr, children) {
    var machine = options.machine;
    var axis = options.axis;
    var speed = options.speed;
    var button = c('button',attr,children);

    var mousedown = false;
    button.addEventListener('mousedown', function(e) {
      if (e.button === 0) {
        mousedown = true;
        machine.emit('command', 'emcTaskSetMode', ['execute', 1]);
        jog(speed);
        document.addEventListener('mouseup', onmouseup);
      }
    });

    function onmouseup(e) {
      e.preventDefault();
      document.removeEventListener('mouseup', onmouseup);
      jog(0);
    }

    function jog(speed) {
      machine.command('emcAxisJog', [axis, speed]);
    }

    return button;
  };
});