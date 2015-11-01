var debug = require('debug')('machinetalk-example:index');
var machinetalk = require('machinetalk');
var express = require('express');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

var requiredServices = ['status', 'command', 'error'];

function Machine(uuid) {
  this.uuid = uuid;
  this.services = {};
  this.isOnline = false;
  this.isConnected = false;
  this.clients = {};

  this.subscriptions = [];
}
util.inherits(Machine, EventEmitter);
Machine.prototype._handleServiceUp = function(serviceName, dsn) {
  debug('Service ' + serviceName + ' up');
  this.services[serviceName] = dsn;
  this._updateIsOnline();
};
Machine.prototype._handleServiceDown = function(serviceName) {
  debug('Service ' + serviceName + ' down');
  this.services[serviceName] = undefined;
  this._updateIsOnline();
};
Machine.prototype._updateIsOnline = function() {
  var me = this;
  var isOnline = requiredServices.every(function(name) {
    return me.services[name];
  });
  if (isOnline !== me.isOnline) {
    me.isOnline = isOnline;
    if (isOnline) {
      this._handleOnline();
    } else {
      this.handleOffline();
    }
    this.emit('isonlinechanged', isOnline);
  }
};

Machine.prototype._handleOnline = function() {
  debug('Machine ' + this.uuid + ' online');
  this.emit('online');
  if (this.hasSubscriptions()) {
    this.connect();
  }
};
Machine.prototype._handleOffline = function() {
  debug('Machine ' + this.uuid + ' offline');
  this.emit('offline');
  this.disconnect();
};

Machine.prototype.subscribe = function(socket) {
  clearTimeout(this.idleTimeout);
  this.subscriptions.push(socket);
  this.connect();
  socket.emit('machine:status', this.uuid, this.clients.status.status);
};
Machine.prototype.unsubscribe = function(socket) {
  this.subscriptions.splice(this.subscriptions.indexOf(socket), 1);
  if (!this.hasSubscriptions()) {
    this.idleTimeout = setTimeout(this._handleIdle.bind(this), 5000);
  }
};
Machine.prototype.hasSubscriptions = function() {
  return this.subscriptions.length > 0;
};
Machine.prototype._handleIdle = function() {
  this.disconnect();
};

Machine.prototype.connect = function() {
  if (this.isConnected) { return; }
  debug('Machine ' + this.uuid + ' connect');
  this._initializeCommand(this.services.command);
  this._initializeStatus(this.services.status);
  this.isConnected = true;
};
Machine.prototype.disconnect = function() {
  if (!this.isConnected) { return; }
  debug('Machine ' + this.uuid + ' disconnect');
  // TODO: Close command client when this is supported by node-machinetalk
  // this.clients.command.close();
  this.clients.status.close();
  this.clients.command = undefined;
  this.clients.status = undefined;
  isConnected = false;
};
Machine.prototype._initializeStatus = function(dsn) {
  console.log('connecting to', this.services.status);
  var statusclient = this.clients.status = new machinetalk.StatusClient(this.services.status);
  statusclient.on('statuschanged', this._handleStatus.bind(this));
  statusclient.subscribe('task');
  statusclient.subscribe('motion');
  statusclient.subscribe('io');
  statusclient.subscribe('interp');
  statusclient.connect();
};
Machine.prototype._handleStatus = function(status) {
  var me = this;
  me.subscriptions.forEach(function(subscription) {
    subscription.emit('machine:status', me.uuid, status);
  });
};

Machine.prototype._initializeCommand = function(dsn) {
  var commandclient = this.clients.command = new machinetalk.TaskCommandClient(this.services.command);
  commandclient.connect();
};

Machine.prototype._handleCommand = function(commandName, args) {
  var commandclient = this.clients.command;
  commandclient[commandName].apply(commandclient, args);
};




var machines = {};

function getMachine(uuid) {
  var machine = machines[uuid];
  if (!machine) {
    machine = machines[uuid] = new Machine(uuid);
  }
  return machine;
}

function getMachines() {
  return Object.keys(machines).map(function(key) {
    return machines[key];
  });
}





var browser = new machinetalk.MachineTalkBrowser();
browser.on('serviceUp', onMachineServiceUp);
browser.start();

function onMachineServiceUp(machine, serviceName, dsn) {
  getMachine(machine.uuid)._handleServiceUp(serviceName, dsn);
}

function onMachineServiceDown(machine, serviceName) {
  getMachine(machine.uuid)._handleServiceDown(serviceName, dsn);
}





io.on('connection', function(socket) {
  debug('Socket connected');

  var subscribedMachines = [];

  debug('Emitting ' + getMachines().length + ' machines to socket');
  getMachines().forEach(function(machine) {
    socket.emit(machine.isOnline ? 'machine:online' : 'machine:offline', machine.uuid);
  });

  socket.on('machine:subscribe', function(uuid) {
    debug('Socket subscribe to ' + uuid);
    var machine = getMachine(uuid);
    machine.subscribe(socket);
    subscribedMachines.push(machine);
  });

  socket.on('machine:command', function(uuid/*, ...*/) {
    var commandArguments = Array.prototype.slice.call(arguments, 1);
    var machine = getMachine(uuid);
    machine._handleCommand.apply(machine, commandArguments);
  });

  socket.on('machine:unsubscribe', function(uuid) {
    debug('Socket unsubscribe from ' + uuid);
    var machine = getMachine(uuid);
    machine.unsubscribe(socket);
    subscribedMachines.splice(subscribedMachines.indexOf(machine), 1);
  });

  socket.on('disconnect', function() {
    debug('Socket disconnected');
    subscribedMachines.forEach(function(machine) {
      machine.unsubscribe(socket);
    });
  });
});

http.listen(3000, function() {
  console.log('listening on http://localhost:3000/');
});