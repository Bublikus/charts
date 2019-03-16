/**
 * @description Entry point of chart drawing.
 *
 * @function doChart
 *
 * @param config: object
 *
 * @return void
 */
function doChart(config) {
  var newConfig = mergeObjectSave(chartDefaults, config);
  newConfig.chart.renderTo = getChartContainer(newConfig.chart.renderTo);
  newConfig.chart.width = newConfig.chart.width || newConfig.chart.renderTo.offsetWidth;
  newConfig.chart.height = newConfig.chart.height || newConfig.chart.renderTo.offsetHeight;

  // Entry draw.
  var chart = drawChart(newConfig);

  // Redraw on window resize.
  window.addEventListener('resize', function () {
    var redrawConfig = mergeObjectSave(chartDefaults, config);
    redrawConfig.chart.renderTo = getChartContainer(redrawConfig.chart.renderTo);
    redrawConfig.chart.width = redrawConfig.chart.width || redrawConfig.chart.renderTo.offsetWidth;
    redrawConfig.chart.height = redrawConfig.chart.height || redrawConfig.chart.renderTo.offsetHeight;
    drawChart(redrawConfig);
  });
}

/**
 * @description Drawing chart.
 *
 * @function drawChart
 *
 * @param config: object
 *
 * @return chart: any
 */
function drawChart(config) {
  config.chart.renderTo.innerHTML = '';

  var chartic = new Chartic(config);

  return chartic;
}

/**
 * @description Chartic class.
 *
 * @constructor Chartic
 *
 * @param config: object
 */
function Chartic(config) {
  this.config = config;

  this.title = new ChartTitle(this.config.title, this.config);
  this.yAxis = new ChartYAxis(this.config.yAxis, this.config);
  // this.xAxis = new ChartXAxis(this.config.xAxis, this.config);

  var svgAttr = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: this.config.chart.width,
    height: this.config.chart.height,
    viewBox: '0 0 ' + this.config.chart.width + ' ' + this.config.chart.height,
  };

  this.svg = createSVGElement('svg', svgAttr, [
    this.config.title && this.title.containers.titleGroup,
    this.config.yAxis && this.yAxis.containers.yAxisGroup,
    // this.config.xAxis && this.xAxis.containers.xAxisGroup,
  ]);

  this.config.chart.renderTo.appendChild(this.svg);
}

/**
 * @description Make a chart title.
 *
 * @constructor ChartTitle
 *
 * @param title {{
 *  x: number,
 *  y: number,
 *  text: string,
 *  backgroundColor: string,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number,
 *  },
 *  attr: {
 *   fill: string,
 *   textAnchor: 'start' | 'middle' | 'end',
 *   dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *  },
 *  style: {
 *   fontSize: number
 *   fontWeight: number | string,
 *  },
 * }}
 * @param config: object
 */
function ChartTitle(title, config) {
  this.title = title;
  this.config = config;

  var spacingCoords = getCoordsFromSpacing(this.title.spacing, {
    width: this.config.chart.width,
    height: this.title.spacing.top + this.title.spacing.bottom + this.title.style.fontSize * appConfig.defaultLineHeight,
  });

  var fontSizeHeight = (this.title.style.fontSize * appConfig.defaultLineHeight - this.title.style.fontSize) / 2;
  var xTextAlign = getXFromTextHAlign(this.title.attr.textAnchor, spacingCoords);
  var yTextAlign = getYFromTextVAlign(this.title.attr.dominantBaseline, spacingCoords, fontSizeHeight);

  var titleRectAttr = {
    x: spacingCoords.x1,
    y: spacingCoords.y1,
    width: spacingCoords.innerWidth,
    height: spacingCoords.innerHeight,
    fill: this.title.backgroundColor,
  };

  var titleTextAttr = Object.assign({}, attrObjectToValidObject(this.title.attr), {
    x: this.title.x + xTextAlign,
    y: this.title.y + yTextAlign,
    style: stylesObjectToString(this.title.style),
  });

  this.containers = {};
  this.containers.titleRect = createSVGElement('rect', titleRectAttr);
  this.containers.titleText = createSVGElement('text', titleTextAttr, this.title.text);
  this.containers.titleGroup = createSVGElement('g', null, [
    this.containers.titleRect,
    this.containers.titleText,
  ]);
}

/**
 * @description Make a chart yAxis.
 *
 * @constructor ChartYAxis
 *
 * @param yAxis {{
 *  ticksAmount: number,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  gridLine: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   },
 *  },
 *  line: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   }
 *  },
 *  labels: {
 *   x: number,
 *   y: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number,
 *    fontWeight: number | string,
 *   },
 *  }
 * }}
 * @param config: object
 */
function ChartYAxis(yAxis, config) {
  this.config = config;
  this.yAxis = yAxis;

  this.yAxisLine = new ChartYAxisLine(this.yAxis.line, this.config);
  this.yAxisLineGrids = new ChartYAxisLineGrids(this.yAxis.line, this.config);
  this.yAxisLabels = new ChartYAxisLabels(this.yAxis.labels, this.config);

  this.containers = {};
  this.containers.yAxisGroup = createSVGElement('g', null, [
    this.yAxisLine.containers && this.yAxisLine.containers.yAxisLine,
    this.yAxisLineGrids.containers && this.yAxisLineGrids.containers.yAxisLineGrids,
    this.yAxisLabels.containers && this.yAxisLabels.containers.yAxisLabels,
  ]);
}

/**
 * @description Create yAxis line.
 *
 * @constructor ChartYAxisLine
 *
 * @param yAxisLine {{
 *  x: number,
 *  y: number,
 *  attr: {
 *   stroke: string,
 *   strokeWidth: number,
 *   strokeDasharray: string,
 *  },
 *  style: {
 *
 *  }
 * }},
 * @param config: object
 */
function ChartYAxisLine(yAxisLine, config) {
  this.config = config;
  this.yAxisLine = yAxisLine;

  var innerContentCoords = getCoordsUnderTitle(config, this.config.yAxis.spacing);
  var dOfPath = 'M ' + innerContentCoords.x1 + ',' + innerContentCoords.y1 + ' v ' + innerContentCoords.y2;

  var yAxisLineAttr = Object.assign({}, attrObjectToValidObject(this.yAxisLine.attr), {
    d: dOfPath,
    style: stylesObjectToString(this.yAxisLine.style),
  });

  this.containers = {};
  this.containers.yAxisLine = createSVGElement('path', yAxisLineAttr);
}

/**
 * @description Create yAxis line grids.
 *
 * @constructor ChartYAxisLineGrids
 *
 * @param yAxisLineGrids {{
 *  x: number,
 *  y: number,
 *  attr: {
 *   stroke: string,
 *   strokeWidth: number,
 *   strokeDasharray: string,
 *  },
 *  style: {
 *
 *  },
 * }}
 * @param config: object
 */
function ChartYAxisLineGrids(yAxisLineGrids, config) {
  this.config = config;
  this.yAxisLineGrids = yAxisLineGrids;

  var innerContentCoords = getCoordsUnderTitle(config, this.config.yAxis.spacing);

  var yAxisLineGridsArray = new Array(this.config.yAxis.ticksAmount).fill(0).map(function (_tickVal, index) {
    var gridLineY = innerContentCoords.y2 - index * (innerContentCoords.innerHeight / this.config.yAxis.ticksAmount);
    var dOfPath = 'M ' + innerContentCoords.x1 + ',' + gridLineY + ' h ' + innerContentCoords.x2;
    var yAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.yAxisLineGrids.attr), {
      d: dOfPath,
      style: stylesObjectToString(this.yAxisLineGrids.style),
    });
    return createSVGElement('path', yAxisLineGridsAttr)
  }.bind(this));

  this.containers = {};
  this.containers.yAxisLineGrids = createSVGElement('g', null, yAxisLineGridsArray);
}

/**
 * @description Create yAxis labels.
 *
 * @constructor ChartYAxisLabels
 *
 * @param yAxisLabels {{
 *  x: number,
 *  y: number,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  attr: {
 *   fill: string,
 *   textAnchor: 'start' | 'middle' | 'end',
 *   dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *  },
 *  style: {
 *   fontSize: number,
 *   fontWeight: number | string,
 *  },
 * }},
 * @param config: object
 */
function ChartYAxisLabels(yAxisLabels, config) {
  this.config = config;
  this.yAxisLineLabels = yAxisLabels;

  var innerContentCoords = getCoordsUnderTitle(config, this.config.yAxis.spacing);
  var innerLabelsContentCoords = getCoordsUnderTitle(config, {
    top: innerContentCoords.y1 + this.config.yAxis.labels.spacing.top,
    left: innerContentCoords.x1 + this.config.yAxis.labels.spacing.left,
    right: innerContentCoords.x2 + this.config.yAxis.labels.spacing.right,
    bottom: innerContentCoords.y2 + this.config.yAxis.labels.spacing.bottom,
  });

  console.log(innerLabelsContentCoords)

  var yAxisLineLabelsArray = new Array(this.config.yAxis.ticksAmount).fill(0).map(function (_tickVal, index) {
    var minMaxY = getMinMaxOfSeriesData(this.config.series);
    var labelTextStep = (minMaxY.max - Math.min(minMaxY.min, 0)) / this.config.yAxis.ticksAmount;
    var labelText = Math.round(labelTextStep * index);
    var labelY = innerLabelsContentCoords.y2 - index * (innerLabelsContentCoords.y2 - innerLabelsContentCoords.y1) / this.config.yAxis.ticksAmount;
    var yAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.yAxisLineLabels.attr), {
      x: innerLabelsContentCoords.x1 + this.yAxisLineLabels.x,
      y: labelY + this.yAxisLineLabels.y,
      style: stylesObjectToString(this.yAxisLineLabels.style),
    });
    return createSVGElement('text', yAxisLineGridsAttr, labelText);
  }.bind(this));

  this.containers = {};
  this.containers.yAxisLabels = yAxisLineLabelsArray;
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
