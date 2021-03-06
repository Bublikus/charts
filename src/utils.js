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
 * @description Check is property object.
 *
 * @function isObject
 *
 * @param obj: any
 *
 * @return {boolean}
 */
function isObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * @description Check is property array.
 *
 * @function isArray
 *
 * @param obj: any
 *
 * @return {boolean}
 */
function isArray(obj) {
  return Array.isArray(obj);
}

/**
 * @description Check is property number.
 *
 * @function isNumber
 *
 * @param obj: any
 *
 * @return {boolean}
 */
function isNumber(obj) {
  return Number.isFinite(obj);
}

/**
 * @description Get number from any.
 *
 * @function getNumber
 *
 * @param obj: any
 *
 * @param defaultNumber
 * @return {number}
 */
function getNumber(obj, defaultNumber) {
  return isNumber(obj) ? obj : defaultNumber || 0;
}

/**
 * @description Check is property boolean.
 *
 * @function isBoolean
 *
 * @param obj: any
 *
 * @return {boolean}
 */
function isBoolean(obj) {
  return typeof obj === 'boolean';
}

/**
 * @description Apply object of camelCase attributes to element.
 *
 * @function applyAttrsToElement
 *
 * @param element: Node
 * @param attr: object
 *
 * @return void
 */
function applyAttrsToElement(element, attr) {
  for (attrKey in attr) {
    if (attr.hasOwnProperty(attrKey) && attr[attrKey] !== undefined && attr[attrKey] !== null) {
      element[attrKey] = attr[attrKey];
    }
  }
}

/**
 * @description Apply object of camelCase attributes to SVG element.
 *
 * @function applyAttrsToSVGElement
 *
 * @param element: Node
 * @param attr: object
 *
 * @return void
 */
function applyAttrsToSVGElement(element, attr) {
  var validAttr = camelCaseObjToDashObj(attr);
  for (attrKey in validAttr) {
    if (validAttr.hasOwnProperty(attrKey) && validAttr[attrKey] !== undefined && validAttr[attrKey] !== null) {
      element.setAttribute(attrKey, validAttr[attrKey]);
    }
  }
}

/**
 * @description Append children to element container
 *
 * @function appendChildrenToContainer
 *
 * @param container: Node
 * @param children: Node | Node[] | string | string[] | number | number[]
 *
 * @return void
 */
function appendChildrenToContainer(container, children) {
  var arrayOfChildren = [].slice.call(arguments, 1);
  arrayOfChildren.forEach(function (child) {
    if (Array.isArray(child)) {
      return appendChildrenToContainer.apply(null, [container].concat(child));
    }
    var childrenElement = !isBoolean(child) && child !== undefined && child !== null && (
      isNode(child)
        ? child
        : document.createTextNode(child && child.toString())
    );
    childrenElement && container.appendChild(childrenElement);
  });
}

/**
 * @description Create element util.
 *
 * @function createElement
 *
 * @param tag: string
 * @param attr: object
 * @param children: string | node | (string | node)[]
 *
 * @return HTMLElement
 */
function createElement(tag, attr, children) {
  var container = document.createElement(tag);
  var arrayOfChildren = [].slice.call(arguments, 2);
  applyAttrsToElement(container, attr);
  appendChildrenToContainer(container, arrayOfChildren);
  return container;
}

/**
 * @description Create SVG element util.
 *
 * @function createSVGElement
 *
 * @param tag: string
 * @param attr: object
 * @param children: string | node | (string | node)[]
 *
 * @return SVGElement
 */
function createSVGElement(tag, attr, children) {
  var container = document.createElementNS('http://www.w3.org/2000/svg', tag);
  var arrayOfChildren = [].slice.call(arguments, 2);
  applyAttrsToSVGElement(container, attr);
  appendChildrenToContainer(container, arrayOfChildren);
  return container;
}

/**
 * @description Dispatch and subscribe on app store.
 *
 * @object eventAggregator
 *
 * @return {{
 *   dispatch(eventName: string, eventArgs: object): void,
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
 * @description Returns true if it is a DOM element.
 *
 * @function isElement
 *
 * @param obj: any
 *
 * @return boolean
 */
function isElement(obj) {
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

/**
 * @description Returns true if it is a NODE.
 *
 * @function isNode
 *
 * @param obj: any
 *
 * @return boolean
 */
function isNode(obj) {
  return typeof Node === 'object'
    ? obj instanceof Node
    : obj && typeof obj === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string';
}

/**
 * @description Object.entries function.
 *
 * @function getEntriesFromObject
 *
 * @param obj: object
 *
 * @return {[[key, value]]}
 */
function getEntriesFromObject(obj) {
  if (!isObject(obj)) {
    return [];
  }
  return Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
}

/**
 * @description Makes object with camel case keys to string with dashes keys.
 *
 * @function camelCaseObjToDashString
 *
 * @param style: object
 *
 * @return string
 */
function camelCaseObjToDashString(style) {
  if (!isObject(style)) {
    return '';
  }
  return getEntriesFromObject(style).reduce((styleString, prop) => {
    prop[0] = prop[0].replace(/([A-Z])/g, function (matches) {
      return '-' + matches[0].toLowerCase();
    });
    return styleString + prop[0] + ':' + prop[1] + ';';
  }, '');
}

/**
 * @description Makes object with camel case keys to dash keys.
 *
 * @function camelCaseObjToDashObj
 *
 * @param obj: object
 *
 * @return object
 */
function camelCaseObjToDashObj(obj) {
  if (!isObject(obj)) {
    return {};
  }
  return getEntriesFromObject(obj)
    .reduce((acc, prop) => {
      prop[0] = prop[0].replace(/([A-Z])/g, function (matches) {
        return '-' + matches[0].toLowerCase();
      });
      acc[prop[0]] = prop[1];
    return acc;
  }, {});
}

/**
 * @description Makes object attr to valid svg attributes.
 *
 * @function attrObjectToValidObject
 *
 * @param attr: object
 *
 * @return object
 */
function attrObjectToValidObject(attr) {
  if (!isObject(attr)) {
    return {};
  }
  return Object.keys(attr).reduce(function (acc, attrKey) {
    var newKey = attrKey.replace(/([A-Z])/g, function (matches) {
      return '-' + matches[0].toLowerCase();
    });
    acc[newKey] = attr[attrKey];
    return acc;
  }, {});
}

/**
 * @description Merge right side object in left side object with saving params.
 *
 * @function mergeObjectSave;
 *
 * @param defaultObject: object
 * @param configObject: object
 *
 * @return {object}
 */
function mergeObjectSave(defaultObject, configObject) {
  if (!isObject(configObject)) {
    return isObject(defaultObject) ? defaultObject : {};
  }
  if (!isObject(defaultObject)) {
    return isObject(configObject) ? configObject : {};
  }

  function mergeLevelOfObject(defaultObject, configObject) {
    // Merge defaultObject Array first child with every configObject Array item.
    if (Array.isArray(defaultObject)) {
      if (!Array.isArray(configObject)) {
        return defaultObject;
      }
      var defaultArrayItem = defaultObject[0];
      return configObject
        .map(function (configObjectArrayItem) {
          return (
            isArray(defaultArrayItem) || isObject(defaultArrayItem)
          ) && (
            isArray(configObjectArrayItem) || isObject(configObjectArrayItem)
          )
            ? mergeLevelOfObject(defaultArrayItem, configObjectArrayItem)
            : configObjectArrayItem !== undefined
              ? configObjectArrayItem
              : defaultArrayItem;
        });
    }
    // Merge defaultObject object child with every configObject object item.
    return Object.keys(defaultObject)
      .filter(function (defaultObjectKey) {
        return !Object.keys(configObject)
          .some(function (configObjectKey) {
            return defaultObjectKey === configObjectKey;
          });
      })
      .concat(Object.keys(configObject))
      .reduce(function (acc, defaultObjectKey) {
        var defaultValue = defaultObject[defaultObjectKey];
        var configValue = configObject[defaultObjectKey];
        acc[defaultObjectKey] = (
          isArray(defaultValue) || isObject(defaultValue)
        ) && (
          isArray(configValue) || isObject(configValue)
        )
          ? mergeLevelOfObject(defaultValue, configValue)
          : configValue !== undefined
            ? configValue
            : defaultValue;
        return acc;
      }, {});
  }

  return mergeLevelOfObject(
    Object.assign({}, defaultObject),
    Object.assign({}, configObject),
  );
}

/**
 * @description Format date from timestamp.
 *
 * @function formatDate
 *
 * @param timestamp: number
 *
 * @return {string}
 */
function formatDate(timestamp) {
  var date = new Date(timestamp);
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  return monthNames[monthIndex] + ' ' + day;
}

/**
 * @description Get height and width of text.
 *
 * @function getTextSize
 *
 * @param text: string
 *
 * @return {{width: number, height: number}}
 */
function getTextSize(text) {
  var div = createElement('div', {
    style: camelCaseObjToDashString({
      position: 'absolute',
      visibility: 'hidden',
      height: 'auto',
      width: 'auto',
      whiteSpace: 'nowrap',
    }),
  }, text);
  document.body.appendChild(div);
  var width = div.clientWidth;
  var height = div.clientHeight;
  document.body.removeChild(div);
  return {
    width: width,
    height: height,
  };
}