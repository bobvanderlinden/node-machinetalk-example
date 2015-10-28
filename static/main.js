define(['eventbus', 'c', 'socket', 'statusbox', 'preview', 'control_dpad', 'control_height', 'control_mode', 'control_state'], function(eventbus, c, socket, statusbox, preview, control_dpad, control_height, control_mode, control_state) {
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
    createButton('Home', function() {
      execCommand('emcTaskSetMode', ['execute', 1]);

      execCommand('emcAxisUnhome', [0]);
      execCommand('emcAxisUnhome', [1]);
      execCommand('emcAxisUnhome', [2]);

      execCommand('emcAxisHome', [0]);
      execCommand('emcAxisHome', [1]);
      execCommand('emcAxisHome', [2]);
    }),

    control_dpad, control_height
  ]);

  var mdiContainer = (function() {
    var mdiinput;
    return createContainer('MDI', [
      c('div', {class: 'ui input'}, [
        mdiinput = c('input',{},[])
      ]),
      createButton('Execute', function() {
        execCommand('emcTaskSetMode', ['execute', 3]);
        execCommand('emcTaskPlanExecute', ['execute', mdiinput.value]);
        mdiinput.value = '';
      })
    ]);
  })();

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
      c.div({ class: 'ui input' }, [pathinput = c('input')]),
      c.button('Open', onopen),
      c.button('Init', oninit),
      c.button('Pause', onpause),
      c.button('Resume', onresume),
      c.button('Run', onrun)
    ]);
  })();


  var rootElement = c('div', {}, [
    preview.element,
    c.div({}, [control_mode]),
    c.div({}, [control_state]),
    controlContainer,
    mdiContainer,
    programContainer,
    statusbox
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