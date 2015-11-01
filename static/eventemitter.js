define([], function() {
  function EventEmitter() {
    this._eventHandlerMap = {};
  }

  EventEmitter.prototype.emit = function emit(name/*...*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    var eventHandlers = this._eventHandlerMap[name];
    if (!eventHandlers) { return; }
    eventHandlers.forEach(function(eventHandler) {
      eventHandler.apply(null, args);
    });
  };

  EventEmitter.prototype.addEventListener = function addEventListener(name, fn) {
    console.assert(name);
    console.assert(fn);
    var eventHandlers = this._eventHandlerMap[name] = this._eventHandlerMap[name] || [];
    eventHandlers.push(fn);
  };

  EventEmitter.prototype.removeEventListener = function removeEventListener(name, fn) {
    var eventHandlers = this._eventHandlerMap[name];
    if (!eventHandlers) { return; }
    eventHandlers.splice(eventHandlers.indexOf(fn), 1);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;

  return EventEmitter;
});