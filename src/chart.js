/**
 * @description Entry point of chart drawing.
 *
 * @function doChart
 *
 * @param config
 *
 * @return void
 */
function doChart(config) {
  config = config || {};
  config.chart = config.chart || {};
  config.chart.renderTo = getChartContainer(config.chart.renderTo);

  window.addEventListener('resize', function () {
    drawChart(config)
  });

  drawChart(config);
}

/**
 * @description Drawing chart.
 *
 * @function drawChart
 *
 * @param config
 *
 * @return chart: any
 */
function drawChart(config) {
  var container = config.chart.renderTo;

  console.log(container);

  const chart = new Chart(config);

  return chart
}

/**
 * @description Chart class
 *
 * @constructor Chart
 *
 * @param config
 */
function Chart(config) {
  this.config = config;
}

/**
 * @description Get chart container.
 *
 * @param container: any
 *
 * @return {Element}
 */
function getChartContainer(container) {
  // Try to get chart container.
  var chartContainer = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!isElement(chartContainer))  {
    throw new Error('"renderTo" property is invalid. Expected string selector or DOM element');
  }

  return chartContainer
}
