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

  this.title = new ChartTitle(this.config.title, this.config);
  this.yAxis = new ChartYAxis(this.config.yAxis, this.config);

  this.svg = createSVGElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: this.config.chart.width,
      height: this.config.chart.height,
      viewBox: '0 0 ' + this.config.chart.width + ' ' + this.config.chart.height,
    },
    this.config.title && this.title.containers.titleGroup,
    this.config.yAxis && this.yAxis.containers.yAxisGroup,
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
  if (!title) {
    return;
  }

  this.config = config;
  this.title = title;

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
 * @description Make a chart yAxis.
 *
 * @constructor ChartYAxis
 *
 * @param yAxis: {{
 *   line: {
 *     x: number,
 *     y: number,
 *     width: number,
 *     color: string,
 *   },
 *   labels: {
 *     x: number,
 *     y: number,
 *     color: string,
 *     fontSize: number,
 *     fontWeight: number | string,
 *   },
 * }}
 * @param config: object
 */
function ChartYAxis(yAxis, config) {
  if (!yAxis || !config.series) {
    return;
  }


  this.config = config;
  this.config.series = config.series;
  this.yAxis = yAxis;
  this.yAxis.line = yAxis.line || {};
  this.yAxis.labels = yAxis.labels || {};

  this.height = this.yAxis.line.height || this.config.chart.height - this.config.title.height;

  this.containers = {};

  var lineCoords = {
    x1: this.yAxis.line.x || 0,
    y1: (this.yAxis.line.y || 0) + (this.config.title.height || 0),
    x2: this.yAxis.line.x || 0,
    y2: this.yAxis.line.height || (this.config.chart.height || 0) + (this.yAxis.line.y || 0),
  };

  if (!Array.isArray(this.config.series)) {
    throw new Error('"Series" must be an array');
  }

  var minY = Math.min.apply(null,
    this.config.series.map(function (seriesItem) {
      return Math.min.apply(null,
        ((seriesItem || {}).data || []).map(function (dataItem) {
          return (dataItem || {}).y || 0;
        })
      );
    })
  );

  var maxY = Math.max.apply(null,
    this.config.series.map(function (seriesItem) {
      return Math.max.apply(null,
        ((seriesItem || {}).data || []).map(function (dataItem) {
          return (dataItem || {}).y || 0;
        })
      );
    })
  );

  var stepY = (maxY - Math.min(minY, 0)) / 5;

  var labelsData = new Array(6).fill(0).map(function (n, i) {
    return +(Math.min(minY, 0) + (i * stepY)).toFixed(2);
  });

  this.containers.yAxisLabels = labelsData.map(function (labelText, i) {
    var tspan = createSVGElement(
      'tspan',
      null,
      labelText,
    );
    var text = createSVGElement(
      'text',
      {
        style: stylesObjectToString(this.yAxis.labels),
        fill: this.yAxis.labels.color,
        x: (this.yAxis.line.x || 0) + (this.yAxis.labels.x || 0),
        y: (this.yAxis.line.y || 0) + (this.yAxis.labels.y || 0) + (lineCoords.y2 - i * ((lineCoords.y2 - lineCoords.y1) / labelsData.length)),
      },
      tspan
    );
    return text;
  }.bind(this));

  this.containers.yAxisLine = createSVGElement(
    'path',
    {
      d: 'M ' + lineCoords.x1 + ',' + lineCoords.y1 + ' v ' + (lineCoords.y2 - lineCoords.y1),
      stroke: this.yAxis.line.color || store.theme.styles.yLines,
      'stroke-width': (this.yAxis.line.width || 1) + 'px',
    },
  );

  this.containers.yAxisGroup = createSVGElement(
    'g',
    null,
    this.containers.yAxisLine,
    this.containers.yAxisLabels
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
