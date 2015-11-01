define(['c'], function(c) {
  return function(machine) {
    var messagelist = c.div({class:'ui list messages'},[]);

    machine.on('error', handleMessage);
    machine.on('display', handleMessage);
    machine.on('text', handleMessage);

    function handleMessage(message) {
      messagelist.appendChild(
        createMessageItem(message)
      );
    }

    function createMessageItem(message) {
      var className = message.topic;
      var color = ({
        error: 'red',
        display: 'blue',
        text: ''
      })[message.topic];
      var title = ({
        error: 'Error',
        display: 'Display',
        text: 'Text'
      }[message.topic]);
      var description = message.note.join('\n');
      var item = c('a', {class:'item ' + className + ' '+ color}, [
        c('i', {class:'icon'}),
        c.div({class:'content'}, [
          c('a', {class:'header'}, title),
          c.div({class:'description'}, description)
        ])
      ]);
      item.onclick = function() {
        messagelist.removeChild(item);
      };
      return item;
    }

    return messagelist;
  };
});