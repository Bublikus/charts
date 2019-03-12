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
  config.chart.width = config.chart.width || config.chart.renderTo.offsetWidth;
  config.chart.height = config.chart.height || config.chart.renderTo.offsetHeight;

  // Entry draw.
  var chart = drawChart(config);

  // Redraw on window resize.
  window.addEventListener('resize', function () {
    drawChart(config);
  });
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
  container.innerHTML = '';

  var chart = new Chart(config);

  return chart;
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
  this.container = this.config.chart.renderTo;

  this.title = new ChartTitle(this.config.title, config);

  this.svg = createSVGElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.config.chart.width,
      height: this.config.chart.height,
      viewBox: '0 0 ' + this.config.chart.width + ' ' + this.config.chart.height,
    },
    this.title.containers.titleGroup,
  );

  this.container.appendChild(this.svg);
}

/**
 * @description Make a chart title.
 *
 * @constructor ChartTitle
 *
 * @param title: {{
 *   text: string,
 *   align: 'left' | 'center' | 'right',
 *   verticalAlign: 'top' | 'center' | 'bottom',
 *   width: number,
 *   height: number,
 *   x: number,
 *   y: number,
 *   backgroundColor: string,
 *   style: {
 *     color: string,
 *     fontSize: number,
 *     fontWeight: number | string,
 *   },
 * }}
 * @param config: object
 */
function ChartTitle(title, config) {
  this.config = config;
  this.title = title || {};

  var alignH =
    this.title.align === 'left' ? 'start'
      : this.title.align === 'center' ? 'middle'
      : this.title.align === 'right' ? 'end'
        : this.title.align || 'start';
  var alignV =
    this.title.verticalAlign === 'top' ? 'hanging'
      : this.title.verticalAlign === 'center' ? 'middle'
      : this.title.verticalAlign === 'bottom' ? 'baseline'
        : this.title.verticalAlign || 'hanging';
  var style = Object.assign({}, { fontSize: 16, fontWeight: 'bold' }, this.title.style);

  this.width = this.title.width || this.config.chart.width;
  this.height = this.title.height || style.fontSize * appConfig.defaultLineHeight;

  this.containers = {};
  this.containers.titleTspan = createSVGElement(
    'tspan',
    null,
    this.title.text,
  );
  this.containers.titleRect = createSVGElement(
    'rect',
    {
      fill: this.title.backgroundColor || 'transparent',
      width: this.width - (this.title.x || 0),
      height: this.height,
      x: this.title.x,
      y: this.title.y,
    },
  );
  this.containers.titleText = createSVGElement(
    'text',
    {
      style: stylesObjectToString(style),
      fill: style.color,
      'text-anchor': alignH,
      'dominant-baseline': alignV,
      x: (this.title.x || 0)
        + (
          alignH === 'middle'
            ? this.config.chart.width / 2
            : alignH === 'end'
            ? this.config.chart.width
            : 0
        ),
      y: (this.title.y || 0)
        + (
          alignV === 'middle'
            ? this.height / 2
            : alignV === 'baseline'
            ? this.height - (style.fontSize * appConfig.defaultLineHeight - style.fontSize) / 2
            : 0
        ),
    },
    this.containers.titleTspan,
  );
  this.containers.titleGroup = createSVGElement(
    'g',
    null,
    this.containers.titleRect,
    this.containers.titleText,
  );
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

  if (!isElement(chartContainer)) {
    throw new Error('"renderTo" property is invalid. Expected string selector or DOM element');
  }

  return chartContainer;
}
