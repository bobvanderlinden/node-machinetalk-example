define(['c', 'statusbox', 'preview',
  'controls/dpad',
  'controls/height',
  'controls/mode',
  'controls/state',
  'controls/estop',
  'controls/power',
  'controls/mdi',
  'controls/home',
  'controls/program_open',
  'controls/program_run',
  'controls/program_pauseresume'],
  function(c, statusbox, preview,
    control_dpad,
    control_height,
    control_mode,
    control_state,
    control_estop,
    control_power,
    control_mdi,
    control_home,
    control_program_open,
    control_program_run,
    control_program_pauseresume
    ) {
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
      home: control_home(machine),
      program_open: control_program_open(machine),
      program_run: control_program_run(machine),
      program_pauseresume: control_program_pauseresume(machine)
    };

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
      segment('Program', [controls.program_open, controls.program_run, controls.program_pauseresume]),
      statusbox
    ]);
  };
});