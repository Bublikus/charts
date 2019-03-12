/**
 * @description Get data of JSON file.
 *
 * @function getJson
 *
 * @param pathToJsonFile: string
 *
 * @return {Promise<JSON>}
 */
function getJson(pathToJsonFile) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();

    request.open('GET', pathToJsonFile);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
      if (request.status >= 200 && request.status < 300) {

        // Success
        resolve(request.response);
      } else {

        // Errors
        alert(request.status + ': ' + request.statusText + '. Path to JSON file: ' + pathToJson);
        reject(request);
      }
    };

    // Errors
    request.onerror = function () {
      reject(request);
    };
  });
}

/**
 * @description Create element util.
 *
 * @function createElement
 *
 * @param tag: string
 * @param props: object
 * @param children: string | node | (string | node)[]
 *
 * @return HTMLElement
 */
function createElement(tag, props, children) {
  var element = document.createElement(tag);

  for (propKey in props) {
    if (props.hasOwnProperty(propKey) && props[propKey] !== undefined && props[propKey] !== null) {
      element[propKey] = props[propKey];
    }
  }

  function appendRecursivelyArrayOfChildren(childrenElements, container) {
    childrenElements.forEach(function (child) {
      if (Array.isArray(child)) {
        return appendRecursivelyArrayOfChildren(child, container);
      }

      var childrenElement = isNode(child)
        ? child
        : document.createTextNode(child && child.toString());

      container.appendChild(childrenElement);
    });
  }

  var arrayOfChildren = [].slice.call(arguments, 2);
  appendRecursivelyArrayOfChildren(arrayOfChildren, element);

  return element;
}

/**
 * @description Create SVG element util.
 *
 * @function createSVGElement
 *
 * @param tag: string
 * @param props: object
 * @param children: string | node | (string | node)[]
 *
 * @return SVGElement
 */
function createSVGElement(tag, props, children) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  for (propKey in props) {
    if (props.hasOwnProperty(propKey) && props[propKey] !== undefined && props[propKey] !== null) {
      element.setAttribute(propKey, props[propKey]);
    }
  }

  function appendRecursivelyArrayOfChildren(childrenElements, container) {
    childrenElements.forEach(function (child) {
      if (Array.isArray(child)) {
        return appendRecursivelyArrayOfChildren(child, container);
      }

      var childrenElement = isNode(child)
        ? child
        : document.createTextNode(child && child.toString());

      container.appendChild(childrenElement);
    });
  }

  var arrayOfChildren = [].slice.call(arguments, 2);
  appendRecursivelyArrayOfChildren(arrayOfChildren, element);

  return element;
}

/**
 * @description Dispatch and subscribe on app store.
 *
 * @object eventAggregator
 *
 * @return {{
 *   dispatch(eventName: string, eventArgs: any): void,
 *   subscribe(eventName: string, handler: Function): void,
 * }}
 */
function Event(name) {
  this._handlers = [];
  this.name = name;
}

// Function of adding handlers.
Event.prototype.addHandler = function (handler) {
  this._handlers.push(handler);
};

// Function of removing handlers
Event.prototype.removeHandler = function (handler) {
  for (var i = 0; i < handlers.length; i++) {
    if (this._handlers[i] === handler) {
      this._handlers.splice(i, 1);
      break;
    }
  }
};

// Call all handlers.
Event.prototype.fire = function (eventArgs) {
  this._handlers.forEach(function (h) {
    h(eventArgs);
  });
};

var eventAggregator = (function () {
  var events = [];

  function getEvent(eventName) {
    return events.filter(function (event) {
      return event.name === eventName;
    })[0];
  }

  return {
    dispatch: function (eventName, eventArgs) {
      var event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }
      event.fire(eventArgs);
    },

    subscribe: function (eventName, handler) {
      var event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }
      event.addHandler(handler);
    },
  };
})();

/**
 * @description Returns true if it is a DOM element
 *
 * @function isElement
 *
 * @param obj: any
 *
 * @return boolean
 */
function isElement(obj) {
  return (
    typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
  );
}

/**
 * @description Returns true if it is a NODE
 *
 * @function isNode
 *
 * @param obj: any
 *
 * @return boolean
 */
function isNode(obj) {
  return (
    typeof Node === 'object'
      ? obj instanceof Node
      : obj && typeof obj === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string'
  );
}

/**
 * @description Object.entries function.
 *
 * @function getEntriesFromObject
 *
 * @param obj: object
 *
 * @return {[key, value][]}
 */
function getEntriesFromObject(obj) {
  if (!(obj instanceof Object) || obj === null) {
    return [];
  }
  return Object.keys(obj || {}).map(function (key) {
    return [key, obj[key]];
  });
}

/**
 * @description Makes object styles to string.
 *
 * @function stylesObjectToString
 *
 * @param style: object
 *
 * @return string
 */
function stylesObjectToString(style) {
  return getEntriesFromObject(style).reduce((styleString, prop) => {
    prop[0] = prop[0].replace(/([A-Z])/g, function (matches) {
      return '-' + matches[0].toLowerCase();
    });
    return styleString + prop[0] + ':' + prop[1] + ';';
  }, '');
}

