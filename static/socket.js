define(['eventbus'], function(eventbus) {
  var socket = io();

  socket.on('status', function(status) {
    eventbus.emit('status', status);
  });

  eventbus.on('command', function(commandName, args) {
    socket.emit('command', commandName, args);
  });

  return socket;
});