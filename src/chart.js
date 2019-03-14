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
  config.chart = config.chart || chartDefaults.chart;
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
  this.xAxis = new ChartXAxis(this.config.xAxis, this.config);

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
    this.config.xAxis && this.xAxis.containers.xAxisGroup,
  );

  this.container.appendChild(this.svg);
}

/**
 * @description Make a chart title.
 *
 * @constructor ChartTitle
 *
 * @param title: {
 *   text: string,
 *   align: 'left' | 'center' | 'right',
 *   verticalAlign: 'top' | 'center' | 'bottom',
 *   width: number,
 *   height: number,
 *   x: number,
 *   y: number,
 *   backgroundColor: string,
 *   spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number,
 *   },
 *   style: {
 *     color: string,
 *     fontSize: number,
 *     fontWeight: number | string,
 *   },
 * }
 * @param config: object
 */
function ChartTitle(title, config) {
  if (!title) {
    return;
  }

  this.config = config;
  this.title = title;

  var style = Object.assign({}, chartDefaults.title.style, this.title.style);

  this.width = this.title.width || this.config.chart.width;
  this.height = this.title.height || style.fontSize * appConfig.defaultLineHeight;

  var alignH = getTextAlign(this.title.align, (chartDefaults.title || {}).align);
  var alignV = getTextVerticalAlign(this.title.verticalAlign, (chartDefaults.title || {}).verticalAlign);
  var spacingCoords = getCoordsFromSpacing(this.title.spacing, { width: this.width, height: this.height });
  var fillRect = this.title.backgroundColor || chartDefaults.title.backgroundColor;
  var xTextAlign = (this.title.x || 0) + alignH === 'middle'
    ? spacingCoords.x1 + spacingCoords.innerWidth / 2
    : alignH === 'end'
      ? spacingCoords.x1 + spacingCoords.innerWidth
      : spacingCoords.x1;
  var yTextAlign = (this.title.y || 0) + alignV === 'middle'
    ? spacingCoords.y1 + spacingCoords.innerHeight / 2
    : alignV === 'baseline'
      ? spacingCoords.y1 + spacingCoords.innerHeight - (style.fontSize * appConfig.defaultLineHeight - style.fontSize) / 2
      : spacingCoords.y1;

  var titleRectProps = {
    fill: fillRect,
    x: spacingCoords.x1,
    y: spacingCoords.y1,
    width: spacingCoords.innerWidth,
    height: spacingCoords.innerHeight,
  };

  var titleTextProps = {
    style: stylesObjectToString(style),
    fill: style.color,
    x: xTextAlign,
    y: yTextAlign,
    'text-anchor': alignH,
    'dominant-baseline': alignV,
  };

  this.containers = {};
  this.containers.titleRect = createSVGElement('rect', titleRectProps);
  this.containers.titleTspan = createSVGElement('tspan', null, this.title.text);
  this.containers.titleText = createSVGElement('text', titleTextProps, this.containers.titleTspan);
  this.containers.titleGroup = createSVGElement('g', null,
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
 *   spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number,
 *   },
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
 *     align: 'start' | 'middle' | 'end',
 *     verticalAlign: 'hanging' | 'middle' | 'baseline',
 *   },
 * }}
 * @param config: object
 */
function ChartYAxis(yAxis, config) {
  if (!yAxis || !Array.isArray(config.series)) {
    return;
  }

  this.config = config;
  this.yAxis = yAxis || {};
  this.yAxis.line = this.yAxis.line || {};
  this.yAxis.labels = this.yAxis.labels || {};

  this.yAxisLine = new ChartYAxisLine(this.yAxis.line, this.config);
  this.yAxisLabels = new ChartYAxisLabels(this.yAxis.labels, this.config);

  this.containers = {};
  this.containers.yAxisGroup = createSVGElement('g',null,
    this.yAxisLine.containers && this.yAxisLine.containers.yAxisLine,
    this.yAxisLabels.containers && this.yAxisLabels.containers.yAxisLabels,
  );
}

/**
 * @description Create yAxis line.
 *
 * @constructor ChartYAxisLine
 *
 * @param yAxisLine: {
 *   x: number,
 *   y: number,
 *   width: number,
 *   color: string,
 * },
 * @param config: object
 */
function ChartYAxisLine(yAxisLine, config) {
  if (!yAxisLine) {
    return;
  }

  this.config = config;
  this.yAxisLine = yAxisLine || {};
  this.yAxis = this.config.yAxis || {};
  this.yAxis.spacing = Object.assign({}, this.yAxis.spacing, (chartDefaults.yAxis || {}).spacing);
  this.title = this.config.title || {};
  this.title.spacing = Object.assign({}, this.title.spacing, (chartDefaults.title || {}).spacing);
  this.title.style = Object.assign({}, chartDefaults.title.style, this.title.style);
  this.title.height = this.title.height || (this.title.style.fontSize * appConfig.defaultLineHeight + (this.title.spacing.top || 0) + (this.title.spacing.bottom || 0));

  var spacingCoords = getCoordsFromSpacing(this.yAxis.spacing, { width: this.config.chart.width, height: this.config.chart.height - this.title.height });
  var dOfPath = 'M ' + spacingCoords.x1 + ',' + (spacingCoords.y1 + this.title.height) + ' v ' + spacingCoords.y2;
  var stroke = this.yAxisLine.color || ((chartDefaults.yAxis || {}).line || {}).color;
  var strokeWidth = (this.yAxisLine.width || ((chartDefaults.yAxis || {}).line || {}).width) + 'px';

  var yAxisLineProps = {
    d: dOfPath,
    stroke: stroke,
    'stroke-width': strokeWidth,
  };

  this.containers = {};
  this.containers.yAxisLine = createSVGElement('path', yAxisLineProps);
}

/**
 * @description Create yAxis labels.
 *
 * @constructor ChartYAxisLabels
 *
 * @param yAxisLabels: {
 *   x: number,
 *   y: number,
 *   align: 'start' | 'middle' | 'end',
 *   verticalAlign: 'hanging' | 'middle' | 'baseline',
 *   style: {
 *     color: string,
 *     fontSize: number,
 *     fontWeight: number | string,
 *   }
 * },
 * @param config: object
 */
function ChartYAxisLabels(yAxisLabels, config) {
  if (!yAxisLabels) {
    return;
  }

  this.config = config;
  this.config.series = config.series;
  this.yAxisLabels = yAxisLabels || {};
  this.yAxisLabels.style = yAxisLabels.style || {};
  this.yAxis = this.config.yAxis || {};
  this.yAxis.spacing = Object.assign({}, this.yAxis.spacing, (chartDefaults.yAxis || {}).spacing);
  this.title = this.config.title || {};
  this.title.spacing = Object.assign({}, this.title.spacing, (chartDefaults.title || {}).spacing);
  this.title.style = Object.assign({}, chartDefaults.title.style, this.title.style);
  this.title.height = this.title.height || (this.title.style.fontSize * appConfig.defaultLineHeight + (this.title.spacing.top || 0) + (this.title.spacing.bottom || 0));

  var alignH = getTextAlign(this.yAxisLabels.align, ((chartDefaults.yAxis || {}).labels || {}).align);
  var alignV = getTextVerticalAlign(this.yAxisLabels.verticalAlign, ((chartDefaults.yAxis || {}).labels || {}).verticalAlign);
  var spacingCoords = getCoordsFromSpacing(this.yAxis.spacing, { width: this.config.chart.width, height: this.config.chart.height - this.title.height });

  var minYMaxY = getMinMaxOfSeriesData(this.config.series, 'y');
  var stepY = (minYMaxY.max - Math.min(minYMaxY.min, 0)) / 5;
  var labelsData = new Array(6).fill(0).map(function (n, i) {
    return +(Math.min(minYMaxY.min, 0) + (i * stepY)).toFixed(2);
  });

  var yAxisLabelsText = labelsData.map(function (labelText, i) {
    var fillTextProps = this.yAxisLabels.style.color || (((chartDefaults.yAxis || {}).labels || {}).style || {}).color;
    var xTextProps = (spacingCoords.x1 + (this.yAxisLabels.x || 0)) || ((chartDefaults.yAxis || {}.labels || {}).x || 0);
    var yTextProps = (this.title.height + (this.yAxisLabels.y || 0)) || ((chartDefaults.yAxis || {}.labels || {}).y || 0);
    var steppedYTextProp = (yTextProps + spacingCoords.y2) - i * spacingCoords.y2 / 5;


    var textProps = {
      style: stylesObjectToString(this.yAxisLabels.style),
      fill: fillTextProps,
      x: xTextProps,
      y: steppedYTextProp,
      'text-anchor': alignH,
      'dominant-baseline': alignV,
    };

    var tspan = createSVGElement('tspan',null, labelText);
    var text = createSVGElement('text', textProps, tspan);

    return text;
  }.bind(this));

  this.containers = {};
  this.containers.yAxisLabels = yAxisLabelsText;
}

/**
 * @description Make a chart xAxis.
 *
 * @constructor ChartXAxis
 *
 * @param xAxis: {{
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
 *     align: 'start' | 'middle' | 'end',
 *     verticalAlign: 'hanging' | 'middle' | 'baseline',
 *   },
 * }}
 * @param config: object
 */
function ChartXAxis(xAxis, config) {
  if (!xAxis || !config.series) {
    return;
  }

  this.config = config;
  this.config.series = config.series;
  this.xAxis = xAxis || {};
  this.xAxis.line = this.xAxis.line || {};
  this.xAxis.labels = this.xAxis.labels || {};
  this.yAxis = this.config.yAxis || {};
  this.yAxis.line = this.yAxis.line || {};

  this.containers = {};

  var lineCoords = {
    x1: (this.xAxis.line.x || 0) + (this.config.yAxis.line.x || 0),
    y1: (this.config.chart.height) + (chartDefaults.xAxis.line.y || 0) + (this.xAxis.line.y || 0),
    x2: (this.xAxis.line.x || 0) + (this.xAxis.line.width || 0) - (this.config.yAxis.line.x || 0) + this.config.chart.width,
    y2: (this.config.chart.height) + (chartDefaults.xAxis.line.y || 0) + (this.xAxis.line.y || 0),
  };

  var alignH = getTextAlign(this.xAxis.labels.align, (chartDefaults.xAxis.labels || {}).align);
  var alignV = getTextVerticalAlign(this.xAxis.labels.verticalAlign, (chartDefaults.xAxis.labels || {}).verticalAlign);

  if (!Array.isArray(this.config.series)) {
    throw new Error('"Series" must be an array');
  }

  var minXMaxX = getMinMaxOfSeriesData(this.config.series, 'x');

  var stepX = (minXMaxX.max - Math.min(minXMaxX.min, 0)) / 5;

  var labelsData = new Array(6).fill(0).map(function (n, i) {
    return +(Math.min(minXMaxX.min, 0) + (i * stepX)).toFixed(2);
  });

  this.containers.xAxisLabels = labelsData.map(function (labelText, i) {
    var tspan = createSVGElement(
      'tspan',
      null,
      labelText,
    );
    var text = createSVGElement(
      'text',
      {
        style: stylesObjectToString(this.xAxis.labels),
        fill: this.xAxis.labels.color,
        'text-anchor': alignH,
        'dominant-baseline': alignV,
        x: (this.xAxis.line.x || 0) + (this.yAxis.line.x || 0) + (this.xAxis.labels.x || 0) + (i * ((lineCoords.x2 - lineCoords.x1) / labelsData.length)),
        y: (this.config.chart.height) + (this.xAxis.line.y || 0) + (this.xAxis.labels.y || 0) + (chartDefaults.xAxis.labels.y || 0),
      },
      tspan,
    );
    return text;
  }.bind(this));

  this.containers.xAxisLine = createSVGElement(
    'path',
    {
      d: 'M ' + lineCoords.x1 + ',' + lineCoords.y1 + ' h ' + (lineCoords.x2 - lineCoords.x1),
      stroke: this.xAxis.line.color || store.theme.styles.xLines,
      'stroke-width': (this.xAxis.line.width || 1) + 'px',
    },
  );

  this.containers.xAxisGroup = createSVGElement(
    'g',
    null,
    this.containers.xAxisLine,
    this.containers.xAxisLabels,
  );
}
