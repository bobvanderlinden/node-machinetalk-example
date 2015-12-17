define(['eventbus','c'], function(eventbus,c) {
  return function createFeedrateControl(machine) {
    var feedrateSpan = c('span',{},'');
    var plusButton = c('button', {class: 'ui button'}, '+');
    var minusButton = c('button', {class: 'ui button'}, '-');
    machine.on('status', function(status) {
      feedrateSpan.textContent = status.motion
        ? status.motion.feedrate.toString()
        : 'unknown';
    });

    plusButton.onclick = function() {
      machine.command('emcTrajSetScale', [machine.status.motion.feedrate + 0.1]);
    };

    minusButton.onclick = function() {
      machine.command('emcTrajSetScale', [machine.status.motion.feedrate - 0.1]);
    };

    return c('div', {}, [
      c('span',{}, 'Feedrate'),
      feedrateSpan,
      c('div', { class: 'ui buttons' },
        [ plusButton
        , minusButton
        ]
      )
    ]);
  };
});