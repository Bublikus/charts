/**
 * Get data of JSON file.
 *
 * @param pathToJson: string
 * @return {Promise<JSON>}
 */
function getJson(pathToJson) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();

    request.open('GET', pathToJson);
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
