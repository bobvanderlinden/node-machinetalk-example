define(['eventbus','c'], function(eventbus,c) {
  return function createStatusBox(machine) {
    var status;
    var statusContainer = c.div();

    machine.on('status', function(newStatus) {
      status = newStatus;
    });

    function onrefresh() {
      while (statusContainer.firstChild) {
        statusContainer.removeChild(statusContainer.firstChild);
      }

      statusContainer.appendChild(renderjson(status));
    }

    return c.div({ class:'statusbox' }, [
      c.button('Refresh', onrefresh),
      statusContainer
    ]);
  };
});