define(['c', 'statusbox', 'preview', 'control_dpad', 'control_height', 'control_mode', 'control_state', 'control_estop', 'control_power', 'control_mdi', 'control_home'], function(c, statusbox, preview, control_dpad, control_height, control_mode, control_state, control_estop, control_power, control_mdi, control_home) {
  return function createMachineControl(machine) {
    var controls = {
      preview: preview(machine),
      dpad: control_dpad(machine),
      height: control_height(machine),
      mode: control_mode(machine),
      state: control_state(machine),
      estop: control_estop(machine),
      power: control_power(machine),
      mdi: control_mdi(machine),
      home: control_home(machine)
    };

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
      controls.dpad, controls.height
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

    return c('div', { class: 'ui segments'}, [
      segment('Preview', [controls.preview]),
      segment('Mode', [controls.mode]),
      segment('State', [controls.estop, controls.power]),
      segment('Manual', [controls.home]),
      segment('MDI', [controls.mdi]),
      controlContainer,
      programContainer,
      statusbox
    ]);
  };
});