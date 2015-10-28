define(['eventbus'], function(eventbus) {
  var dpad = document.createElement('div');
  dpad.className = 'control dpad';
  dpad.style.width ='100px';
  dpad.style.height ='100px';


  var interval;
  var velocity;
  var mousedown = false;

  function getVelocity(e) {
    var x = e.pageX - $(dpad).offset().left - $(dpad).scrollLeft();
    var y = e.pageY - $(dpad).offset().top - $(dpad).scrollTop();
    var w = $(dpad).width();
    var h = $(dpad).height();

    return [
      (x/w - 0.5) * 100,
      -(y/h - 0.5) * 100
    ];
  }


  dpad.addEventListener('mousedown', function(e) {
    if (e.buttons === 1) {
      mousedown = true;
      eventbus.emit('command', 'emcTaskSetMode', ['execute', 1]);
      velocity = getVelocity(e);

      document.addEventListener('mouseup', onmouseup);

      clearInterval(interval);
      interval = setInterval(ontick, 100);
    }
  });
  dpad.addEventListener('mousemove', function(e) {
    if (mousedown) {
      velocity = getVelocity(e);
    }
  });

  function onmouseup(e) {
    document.removeEventListener('mouseup', onmouseup);
    clearInterval(interval);
    jog([0,0]);
  }

  function ontick() {
    jog(velocity);
  }

  function jog(velocity) {
    var x = velocity[0];
    var y = velocity[1];
    eventbus.emit('command', 'emcAxisJog', [0, x]);
    eventbus.emit('command', 'emcAxisJog', [1, y]);
  }
  return dpad;
});