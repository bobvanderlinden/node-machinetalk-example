define(['eventbus'], function(eventbus) {
  return function createStatusBox(machine) {
    var statusBox = document.createElement('pre');
    machine.on('status', function(status) {
      statusBox.textContent = JSON.stringify(status, '  ', '  ');
    });
    return statusBox;
  };
});