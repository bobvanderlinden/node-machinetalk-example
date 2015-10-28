var machinetalk = require('machinetalk');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

var taskcommandclient;
var statusclient;

var browser = new machinetalk.MachineTalkBrowser();
browser.on('serviceUp', function(machine, serviceName, dsn) {
  if (serviceName !== 'status') { return; }
  statusclient = new machinetalk.StatusClient(dsn);
  statusclient.on('statuschanged', function(status) {
    io.emit('status', status);
  });
  statusclient.connect();
  statusclient.subscribe('task');
  statusclient.subscribe('motion');
  statusclient.subscribe('io');
  statusclient.subscribe('interp');
});
browser.on('serviceUp', function(machine, serviceName, dsn) {
  if (serviceName !== 'command') { return; }
  taskcommandclient = new machinetalk.TaskCommandClient(dsn);
  taskcommandclient.connect();
});
browser.start();

io.on('connection', function(socket) {
  console.log('user connected');
  if (statusclient) {
    socket.emit('status', statusclient.status);
  }
  socket.on('command', function(commandName, args) {
    taskcommandclient[commandName].apply(taskcommandclient, args);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on http://localhost:3000/');
});