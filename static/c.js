define([], function() {
  function c(tagName, attributes, children) {
    var element = document.createElement(tagName);

    if (typeof attributes === 'object') {
      for(var k in attributes){ 
        element.setAttribute(k, attributes[k]);
      }
    } else if (typeof attributes === 'undefined') {
      // Do nothing.
    } else {
      throw 'Incorrect type for attributes';
    }

    if (typeof children === 'string') {
      element.textContent = children;
    } else if (typeof children === 'object') {
      children.forEach(function(child) {
        element.appendChild(child);
      });
    } else if (typeof children === 'undefined') {
      // Do nothing.
    } else {
      throw 'Incorrect type for children: ' + typeof children;
    }
    return element;
  }

  c.button = function createButton(name, onclick) {
    var button = c('button', { class: 'ui button' },name);
    button.onclick = onclick;
    return button;
  };

  c.div = c.bind(null, 'div');

  return c;
});