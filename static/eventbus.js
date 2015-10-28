define([], function() {
  var eventHandlerMap = {};

  function emit(name/*...*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    var eventHandlers = eventHandlerMap[name];
    if (!eventHandlers) { return; }
    eventHandlers.forEach(function(eventHandler) {
      eventHandler.apply(null, args);
    });
  }

  function addEventListener(name, fn) {
    console.assert(name);
    console.assert(fn);
    console.log('addEventListener', name, fn);
    var eventHandlers = eventHandlerMap[name] = eventHandlerMap[name] || [];
    eventHandlers.push(fn);
  }

  function removeEventListener(name, fn) {
    var eventHandlers = eventHandlerMap[name];
    if (!eventHandlers) { return; }
    eventHandlers.splice(eventHandlers.indexOf(fn), 1);
  }

  return {
    emit: emit,
    on: addEventListener,
    removeEventListener: removeEventListener
  };
});