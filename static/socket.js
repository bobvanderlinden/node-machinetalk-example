define(['eventbus'], function(eventbus) {
  var socket = io();

  socket.on('connect', eventbus.emit.bind(eventbus, 'socket:connect'));
  socket.on('reconnecting', eventbus.emit.bind(eventbus, 'socket:reconnecting'));
  socket.on('machine:online', eventbus.emit.bind(eventbus, 'machine:online'));
  socket.on('machine:offline', eventbus.emit.bind(eventbus, 'machine:offline'));
  socket.on('machine:status', eventbus.emit.bind(eventbus, 'machine:status'));

  eventbus.on('machine:subscribe', socket.emit.bind(socket, 'machine:subscribe'));
  eventbus.on('machine:unsubscribe', socket.emit.bind(socket, 'machine:unsubscribe'));
  eventbus.on('machine:command', socket.emit.bind(socket, 'machine:command'));

  return socket;
});