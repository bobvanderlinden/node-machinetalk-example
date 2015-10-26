var machinetalk = require('machinetalk');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

var browser = new machinetalk.MachineTalkBrowser();
browser.on('serviceUp', function(machine, serviceName, dsn) {
  if (serviceName !== 'status') { return; }
  var statusclient = new machinetalk.StatusClient(dsn);
  statusclient.on('statuschanged', function(status) {
    io.emit('status', status);
  });
  statusclient.connect();
  statusclient.subscribe('motion');
});
browser.start();

io.on('connection', function(socket) {
  console.log('user connected');
});

http.listen(3000, function() {
  console.log('listening on http://localhost:3000/');
});