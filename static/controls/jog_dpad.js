define(['c','controls/jog_axis_button'], function(c, createJogButton) {
  return function createJogDPadControl(machine) {
    return c.div({class: 'jog dpad', style: 'position: relative; width: 8rem; height: 8rem'}, [
      createJogButton({
        machine: machine,
        axis: 0,
        speed: -10
      }, {class: 'ui icon button', style: 'position: absolute; left: 0; top: 50%; margin-top: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow left')
      ]),
      createJogButton({
        machine: machine,
        axis: 0,
        speed: 10
      }, {class: 'ui icon button', style: 'position: absolute; right: 0; top: 50%; margin-top: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow right')
      ]),
      createJogButton({
        machine: machine,
        axis: 1,
        speed: 10
      }, {class: 'ui icon button', style: 'position: absolute; top: 0; left: 50%; margin-left: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow up')
      ]),
      createJogButton({
        machine: machine,
        axis: 1,
        speed: -10
      }, {class: 'ui icon button', style: 'position: absolute; bottom: 0; left: 50%; margin-left: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow down')
      ]),
    ]);
  };
});