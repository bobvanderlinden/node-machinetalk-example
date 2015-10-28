define(['eventbus'], function(eventbus) {
  var statusBox = document.createElement('pre');
  eventbus.on('status', function(status) {
    statusBox.textContent = JSON.stringify(status, '  ', '  ');
  });
  return statusBox;
});