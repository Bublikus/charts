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
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();

    request.open('GET', pathToJsonFile);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
      if (request.status >= 200 && request.status < 300) {

        // Success
        resolve(request.response);
      } else {

        // Errors
        alert(request.status + ': ' + request.statusText + '. Path to JSON file: ' + pathToJson);
        reject(request);
      }
    }

    // Errors
    request.onerror = function () {
      reject(request);
    }
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
    if (props.hasOwnProperty(propKey)) {
      element[propKey] = props[propKey];
    }
  }

  function appendRecursivelyArrayOfChildren(childrenElements, container) {
    childrenElements.forEach(function (child) {
      if (Array.isArray(child)) {
        return appendRecursivelyArrayOfChildren(child, container)
      }

      var childrenElement = child instanceof HTMLElement
        ? child
        : document.createTextNode(child && child.toString())

      container.appendChild(childrenElement);
    });
  }

  var arrayOfChildren = [].slice.call(arguments, 2);
  appendRecursivelyArrayOfChildren(arrayOfChildren, element);

  return element;
}
