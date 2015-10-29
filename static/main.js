define(['eventbus', 'c', 'socket', 'statusbox', 'preview', 'control_dpad', 'control_height', 'control_mode', 'control_state', 'control_estop', 'control_power', 'control_mdi', 'control_home'], function(eventbus, c, socket, statusbox, preview, control_dpad, control_height, control_mode, control_state, control_estop, control_power, control_mdi, control_home) {
  function createButton(name, onclick) {
    var button = document.createElement('button');
    button.className = 'ui button';
    button.textContent = name;
    button.onclick = onclick;
    return button;
  }

  function createContainer(name, children) {
    var container = document.createElement('div');
    container.className = 'ui message';
    children.forEach(function(child) {
      container.appendChild(child);
    });
    return container;
  }

  function execCommand(name, args) {
    eventbus.emit('command', name, args);
  }
  function createCommandFn(name, args) {
    return function() {
      return execCommand(name, args);
    };
  }

  var controlContainer = createContainer('Control', [
    control_dpad, control_height
  ]);

  var programContainer = (function() {
    var pathinput;

    function onopen() {
      execCommand('emcTaskPlanOpen', ['execute', pathinput.value]);
    }

    function oninit() {
      //execCommand('emcTaskPlanInit', ['execute']);
    }

    function onpause() {
      execCommand('emcTaskPlanPause', ['execute']);
    }

    function onresume() {
      execCommand('emcTaskPlanResume', ['execute']);
    }

    function onrun() {
      execCommand('emcTaskPlanRun', ['execute',0]);
    }

    return createContainer('Program', [
      c.div({ class: 'ui action input' }, [
        pathinput = c('input'),
        c.button('Open', onopen)
      ]),
      c.button('Init', oninit),
      c.button('Pause', onpause),
      c.button('Resume', onresume),
      c.button('Run', onrun)
    ]);
  })();

  function segment(name, children) {
    return c('div', { class: 'ui raised segment' }, [
      // c('a', { class: 'ui ribbon label' }, name)
    ].concat(children));
  }

  var segments = c('div', { class: 'ui segments'}, [
    segment('Preview', [preview.element]),
    segment('Mode', [control_mode]),
    segment('State', [control_estop, control_power]),
    segment('Manual', [control_home]),
    segment('MDI', [control_mdi]),
    controlContainer,
    programContainer,
    statusbox
  ]);

  var rootElement = c('div', { class: 'main ui container' }, [
    segments
  ]);

  function onDomLoaded() {
    console.log(typeof rootElement);
    document.body.appendChild(rootElement);
  }

  console.log('readystate', document.readyState);
  if (document.readyState === 'complete') {
    onDomLoaded();
  } else {
    document.addEventListener("DOMContentLoaded", onDomLoaded);
  }
});