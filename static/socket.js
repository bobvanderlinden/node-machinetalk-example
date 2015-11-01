define(['eventbus'], function(eventbus) {
  var socket = io();

  socket.on('connect', eventbus.emit.bind(eventbus, 'socket:connect'));
  socket.on('reconnecting', eventbus.emit.bind(eventbus, 'socket:reconnecting'));
  socket.on('machine:online', eventbus.emit.bind(eventbus, 'machine:online'));
  socket.on('machine:offline', eventbus.emit.bind(eventbus, 'machine:offline'));
  socket.on('machine:status', eventbus.emit.bind(eventbus, 'machine:status'));
  socket.on('machine:error', eventbus.emit.bind(eventbus, 'machine:error'));
  socket.on('machine:display', eventbus.emit.bind(eventbus, 'machine:display'));
  socket.on('machine:text', eventbus.emit.bind(eventbus, 'machine:text'));
  socket.on('machine:preview', eventbus.emit.bind(eventbus, 'machine:preview'));

  eventbus.on('machine:subscribe', socket.emit.bind(socket, 'machine:subscribe'));
  eventbus.on('machine:unsubscribe', socket.emit.bind(socket, 'machine:unsubscribe'));
  eventbus.on('machine:command', socket.emit.bind(socket, 'machine:command'));

  return socket;
});