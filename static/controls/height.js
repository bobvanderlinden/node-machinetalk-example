define(['eventbus'], function(eventbus) {
  return function createHeightControl(machine) {
    var dpad = document.createElement('div');
    dpad.className = 'control height';
    dpad.style.width ='20px';
    dpad.style.height ='100px';


    var interval;
    var velocity;
    var mousedown = false;

    function getVelocity(e) {
      var y = e.pageY - $(dpad).offset().top - $(dpad).scrollTop();
      var h = $(dpad).height();

      return [
        (y/h - 0.5) * 100
      ];
    }


    dpad.addEventListener('mousedown', function(e) {
      if (e.button === 0) {
        mousedown = true;
        velocity = getVelocity(e);
        eventbus.emit('command', 'emcTaskSetMode', ['execute', 1]);

        document.addEventListener('mouseup', onmouseup);
        document.addEventListener('mousemove', onmousemove, true);
        clearInterval(interval);
        interval = setInterval(ontick, 100);
      }
    });
    function onmousemove(e) {
      if (mousedown) {
        velocity = getVelocity(e);
      }
    }

    function onmouseup(e) {
      document.removeEventListener('mouseup', onmouseup);
      clearInterval(interval);
      jog([0,0]);
    }

    function ontick() {
      jog(velocity);
    }

    function jog(velocity) {
      var z = velocity[0];
      machine.command('emcAxisJog', [2, z]);
    }
    return dpad;
  };
});