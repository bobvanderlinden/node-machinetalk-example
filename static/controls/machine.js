define(['c',
  'controls/statusbox',
  'controls/messagelist',
  'controls/preview',
  'controls/dpad',
  'controls/height',
  'controls/mode',
  'controls/state',
  'controls/estop',
  'controls/power',
  'controls/mdi',
  'controls/homeall',
  'controls/homeaxis',
  'controls/program_open',
  'controls/program_run',
  'controls/program_pauseresume'],
  function(c,
    statusbox,
    messagelist,
    preview,
    control_dpad,
    control_height,
    control_mode,
    control_state,
    control_estop,
    control_power,
    control_mdi,
    control_homeall,
    control_homeaxis,
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
      homeall: control_homeall(machine),
      home0: control_homeaxis(machine, 0),
      home1: control_homeaxis(machine, 1),
      home2: control_homeaxis(machine, 2),
      program_open: control_program_open(machine),
      program_run: control_program_run(machine),
      program_pauseresume: control_program_pauseresume(machine),
      statusbox: statusbox(machine),
      messagelist: messagelist(machine)
    };

    function segment(name, children) {
      return c('div', { class: 'ui raised segment' }, [
        // c('a', { class: 'ui ribbon label' }, name)
      ].concat(children));
    }

    function divider() {
      return c.div({ class: 'ui divider' },[]);
    }

    var root, tabMenu;
    root = c.div({ class: 'frame' }, [
      c.div({}, [
        controls.preview
      ]),
      c.div({}, [
        tabMenu = c.div({ class: 'ui tabular menu'}, [
          c('a', { class: 'item', 'data-tab': 'manual' }, 'Manual'),
          c('a', { class: 'item', 'data-tab': 'mdi' }, 'MDI'),
          c('a', { class: 'item', 'data-tab': 'program' }, 'Program'),
          c('a', { class: 'item', 'data-tab': 'status' }, 'Status')
        ]),
        c.div({ class: 'ui tab', 'data-tab': 'manual' }, [
          controls.estop, controls.power,
          divider(),
          controls.homeall,
          divider(),
          controls.home0,
          controls.home1,
          controls.home2,
        ]),
        c.div({ class: 'ui tab', 'data-tab': 'mdi' }, [
          controls.mdi
        ]),
        c.div({ class: 'ui tab', 'data-tab': 'program' }, [
          controls.program_pauseresume,
          divider(),
          controls.program_open
        ]),
        c.div({ class: 'ui tab', 'data-tab': 'status' }, [
          controls.statusbox
        ]),
      ])
    ]);

    $('.menu .item', root).tab({
      context: $(root)
    });

    return root;
  };
});