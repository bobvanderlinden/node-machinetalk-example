define(['c','controls/jog_axis_button'], function(c, createJogButton) {
  return function createJogUpDownControl(machine) {
    return c.div({class: 'jog updown', style: 'position: relative; width: 36px; height: 8rem'}, [
      createJogButton({
        machine: machine,
        axis: 2,
        speed: 10
      }, {class: 'ui icon button', style: 'position: absolute; top: 0; left: 50%; margin-left: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow up')
      ]),
      createJogButton({
        machine: machine,
        axis: 2,
        speed: -10
      }, {class: 'ui icon button', style: 'position: absolute; bottom: 0; left: 50%; margin-left: -18px; width: 36px; height: 36px'}, [
        c.icon('arrow down')
      ]),
    ]);
  };
});