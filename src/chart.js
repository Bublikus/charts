/**
 * @description Entry point of chart drawing.
 *
 * @function doChart
 *
 * @param config: object
 * @param defaultConfig: object
 *
 * @return void
 */
function doChart(config, defaultConfig) {
  var newConfig = mergeObjectSave(defaultConfig, config);
  newConfig.chart.renderTo = getChartContainer(newConfig.chart.renderTo);
  newConfig.chart.width = newConfig.chart.width || newConfig.chart.renderTo.offsetWidth;
  newConfig.chart.height = newConfig.chart.height || newConfig.chart.renderTo.offsetHeight;

  // Entry draw.
  var chart = drawChart(newConfig);

  // Redraw on window resize.
  window.addEventListener('resize', function () {
    var redrawConfig = mergeObjectSave(defaultConfig, config);
    redrawConfig.chart.renderTo = getChartContainer(redrawConfig.chart.renderTo);
    redrawConfig.chart.width = redrawConfig.chart.width || redrawConfig.chart.renderTo.offsetWidth;
    redrawConfig.chart.height = redrawConfig.chart.height || redrawConfig.chart.renderTo.offsetHeight;
    requestAnimationFrame(function () {
      drawChart(redrawConfig);
    });
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

// ================================================================================================================= //
// ================================================ CHART CONTROLLER =============================================== //
// ================================================================================================================= //

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
  this.xAxis = new ChartXAxis(this.config.xAxis, this.config);
  this.yAxis = new ChartYAxis(this.config.yAxis, this.config);
  this.series = new ChartSeries(this.config.series, this.config);
  this.selectArea = new ChartSelectArea(this.config.selectArea, this.config);

  var svgAttr = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: this.config.chart.width,
    height: this.config.chart.height,
    viewBox: '0 0 ' + this.config.chart.width + ' ' + this.config.chart.height,
  };

  this.svg = createSVGElement('svg', svgAttr, [
    this.series.containers.seriesGroup,
    this.config.title.enabled && this.title.containers && this.title.containers.titleGroup,
    this.config.xAxis.enabled && this.xAxis.containers && this.xAxis.containers.xAxisGroup,
    this.config.yAxis.enabled && this.yAxis.containers && this.yAxis.containers.yAxisGroup,
    !!this.config.selectArea.type && this.selectArea.containers && this.selectArea.containers.selectAreaGroup,
  ]);

  this.config.chart.renderTo.appendChild(this.svg);
}

// ================================================================================================================= //
// ================================================== CHART TITLE ================================================== //
// ================================================================================================================= //

/**
 * @description Make a chart title.
 *
 * @constructor ChartTitle
 *
 * @param title {{
 *  enabled: boolean,
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

// ================================================================================================================= //
// ================================================== CHART Y AXIS ================================================= //
// ================================================================================================================= //

/**
 * @description Make a chart yAxis.
 *
 * @constructor ChartYAxis
 *
 * @param yAxis {{
 *  enabled: boolean,
 *  ticksAmount: number,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  line: {
 *   enabled: boolean,
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
 *  gridLine: {
 *   enabled: boolean,
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
 *  labels: {
 *   enabled: boolean,
 *   x: number,
 *   y: number,
 *   formatter(step: number, index: number, config: object): (number | string | Node),
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
  this.yAxisLabels = new ChartYAxisLabels(this.yAxis.labels, this.config);
  this.yAxisLineGrids = new ChartYAxisLineGrids(this.yAxis.gridLine, this.config);

  this.containers = {};
  this.containers.yAxisGroup = createSVGElement('g', null, [
    this.yAxis.line.enabled && this.yAxisLine.containers && this.yAxisLine.containers.yAxisLine,
    this.yAxis.labels.enabled && this.yAxisLabels.containers && this.yAxisLabels.containers.yAxisLabels,
    this.yAxis.gridLine.enabled && this.yAxisLineGrids.containers && this.yAxisLineGrids.containers.yAxisLineGrids,
  ]);
}

/**
 * @description Create yAxis line.
 *
 * @constructor ChartYAxisLine
 *
 * @param yAxisLine {{
 *  enabled: boolean,
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

  var innerContentCoords = getCoordsUnderTitle(this.config, this.config.yAxis.spacing);
  var dOfPath = 'M ' + innerContentCoords.x1 + ',' + innerContentCoords.y1 + ' V ' + innerContentCoords.y2;

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
 *  enabled: boolean,
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

  var innerContentCoords = getCoordsUnderTitle(this.config, this.config.yAxis.spacing);

  var yAxisLineGridsArray = new Array(this.config.yAxis.ticksAmount)
    .fill(0)
    .map(function (_val, index) {
      return index + 1;
    })
    .filter(Boolean)
    .map(function (index) {
      var gridLineY = innerContentCoords.y2 - index * (innerContentCoords.innerHeight / this.config.yAxis.ticksAmount);
      var dOfPath = 'M ' + innerContentCoords.x1 + ',' + gridLineY + ' H ' + innerContentCoords.x2;
      var yAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.yAxisLineGrids.attr), {
        d: dOfPath,
        style: stylesObjectToString(this.yAxisLineGrids.style),
      });
      return createSVGElement('path', yAxisLineGridsAttr);
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
 *  enabled: boolean,
 *  x: number,
 *  y: number,
 *  formatter(step: number, index: number, config: object): (number | string | Node),
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

  var innerLabelsContentCoords = getCoordsUnderTitle(this.config, {
    top: this.config.yAxis.spacing.top + this.config.yAxis.labels.spacing.top,
    left: this.config.yAxis.spacing.left + this.config.yAxis.labels.spacing.left,
    right: this.config.yAxis.spacing.right + this.config.yAxis.labels.spacing.right,
    bottom: this.config.yAxis.spacing.bottom + this.config.yAxis.labels.spacing.bottom,
  });

  var yAxisLineLabelsArray = new Array(this.config.yAxis.ticksAmount + 1) // +1 for displaying label on last line
    .fill(0)
    .map(function (_tickVal, index) {
      var minMaxY = getMinMaxOfSeriesData(this.config.series, 'y');
      var labelTextStep = (minMaxY.max - Math.min(minMaxY.min, 0)) / this.config.yAxis.ticksAmount;
      var labelText = this.yAxisLineLabels.formatter(Math.round(labelTextStep * index), index, this.config);
      var labelY = innerLabelsContentCoords.y2 - index * (innerLabelsContentCoords.y2 - innerLabelsContentCoords.y1) / this.config.yAxis.ticksAmount;

      var yAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.yAxisLineLabels.attr), {
        x: innerLabelsContentCoords.x1 + this.yAxisLineLabels.x,
        y: labelY + this.yAxisLineLabels.y,
        style: stylesObjectToString(this.yAxisLineLabels.style),
      });

      return createSVGElement('text', yAxisLineGridsAttr, labelText);
    }.bind(this));

  this.containers = {};
  this.containers.yAxisLabels = createSVGElement('g', null, yAxisLineLabelsArray);
}

// ================================================================================================================= //
// ================================================== CHART X AXIS ================================================= //
// ================================================================================================================= //

/**
 * @description Make a chart xAxis.
 *
 * @constructor ChartXAxis
 *
 * @param xAxis {{
 *  enabled: boolean,
 *  x: number,
 *  y: number,
 *  formatter(step: number, index: number, config: object): (number | string | Node),
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
 * }}
 * @param config: object
 */
function ChartXAxis(xAxis, config) {
  this.config = config;
  this.xAxis = xAxis;

  this.xAxisLine = new ChartXAxisLine(this.xAxis.line, this.config);
  this.xAxisLabels = new ChartXAxisLabels(this.xAxis.labels, this.config);
  this.xAxisLineGrids = new ChartXAxisLineGrids(this.xAxis.gridLine, this.config);

  this.containers = {};
  this.containers.xAxisGroup = createSVGElement('g', null, [
    this.xAxis.line.enabled && this.xAxisLine.containers && this.xAxisLine.containers.xAxisLine,
    this.xAxis.labels.enabled && this.xAxisLabels.containers && this.xAxisLabels.containers.xAxisLabels,
    this.xAxis.gridLine.enabled && this.xAxisLineGrids.containers && this.xAxisLineGrids.containers.xAxisLineGrids,
  ]);
}

/**
 * @description Create xAxis line.
 *
 * @constructor ChartXAxisLine
 *
 * @param xAxisLine {{
 *  enabled: boolean,
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
function ChartXAxisLine(xAxisLine, config) {
  this.config = config;
  this.xAxisLine = xAxisLine;

  var innerContentCoords = getCoordsUnderTitle(this.config, this.config.xAxis.spacing);
  var dOfPath = 'M ' + innerContentCoords.x1 + ',' + innerContentCoords.y2 + ' H ' + innerContentCoords.x2;

  var xAxisLineAttr = Object.assign({}, attrObjectToValidObject(this.xAxisLine.attr), {
    d: dOfPath,
    style: stylesObjectToString(this.xAxisLine.style),
  });

  this.containers = {};
  this.containers.xAxisLine = createSVGElement('path', xAxisLineAttr);
}

/**
 * @description Create xAxis line grids.
 *
 * @constructor ChartXAxisLineGrids
 *
 * @param xAxisLineGrids {{
 *  enabled: boolean,
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
function ChartXAxisLineGrids(xAxisLineGrids, config) {
  this.config = config;
  this.xAxisLineGrids = xAxisLineGrids;

  var innerContentCoords = getCoordsUnderTitle(this.config, this.config.xAxis.spacing);

  var xAxisLineGridsArray = new Array(this.config.xAxis.ticksAmount)
    .fill(0)
    .map(function (_val, index) {
      return index + 1;
    })
    .filter(Boolean)
    .map(function (index) {
      var gridLineX = innerContentCoords.x1 + index * (innerContentCoords.innerWidth / this.config.xAxis.ticksAmount);
      var dOfPath = 'M ' + gridLineX + ',' + innerContentCoords.y1 + ' V ' + innerContentCoords.y2;
      var xAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.xAxisLineGrids.attr), {
        d: dOfPath,
        style: stylesObjectToString(this.xAxisLineGrids.style),
      });
      return createSVGElement('path', xAxisLineGridsAttr);
    }.bind(this));

  this.containers = {};
  this.containers.xAxisLineGrids = createSVGElement('g', null, xAxisLineGridsArray);
}

/**
 * @description Create xAxis labels.
 *
 * @constructor ChartXAxisLabels
 *
 * @param xAxisLabels {{
 *  enabled: boolean,
 *  x: number,
 *  y: number,
 *  formatter(step: number, index: number, config: object): (number | string | Node),
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
function ChartXAxisLabels(xAxisLabels, config) {
  this.config = config;
  this.xAxisLineLabels = xAxisLabels;

  var innerLabelsContentCoords = getCoordsUnderTitle(this.config, {
    top: this.config.xAxis.spacing.top + this.config.xAxis.labels.spacing.top,
    left: this.config.xAxis.spacing.left + this.config.xAxis.labels.spacing.left,
    right: this.config.xAxis.spacing.right + this.config.xAxis.labels.spacing.right,
    bottom: this.config.xAxis.spacing.bottom + this.config.xAxis.labels.spacing.bottom,
  });

  var xAxisLineLabelsArray = new Array(this.config.xAxis.ticksAmount + 1) // +1 for displaying label on last line
    .fill(0)
    .map(function (_tickVal, index) {
      var i = index + 1;

      var minMaxX = getMinMaxOfSeriesData(this.config.series, 'x');
      var labelTextStep = (minMaxX.max - minMaxX.min) / this.config.xAxis.ticksAmount;
      var labelText = this.xAxisLineLabels.formatter(Math.round(labelTextStep * i), index, this.config);
      var labelX = innerLabelsContentCoords.x1 + index * (innerLabelsContentCoords.x2 - innerLabelsContentCoords.x1) / this.config.xAxis.ticksAmount;

      var xAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(this.xAxisLineLabels.attr), {
        x: labelX + this.xAxisLineLabels.x,
        y: innerLabelsContentCoords.y2 + this.xAxisLineLabels.y,
        style: stylesObjectToString(this.xAxisLineLabels.style),
      });

      return createSVGElement('text', xAxisLineGridsAttr, labelText);
    }.bind(this));

  this.containers = {};
  this.containers.xAxisLabels = createSVGElement('g', null, xAxisLineLabelsArray);
}

// ================================================================================================================= //
// ================================================== CHART SERIES ================================================= //
// ================================================================================================================= //

/**
 * @description Draw chart series.
 *
 * @constructor ChartSeries
 *
 * @param series {
 *   type: 'line',
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   data: {
 *    x: number,
 *    y: number,
 *    info: object,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    },
 *   }[],
 *  }[],
 * }
 * @param config: object
 */
function ChartSeries(series, config) {
  this.config = config;
  this.series = series;

  var seriesLineType = this.series.filter(function (seriesItem) {
    return seriesItem.type = 'line';
  });

  this.seriesLine = new ChartSeriesLine(seriesLineType, this.config);

  this.containers = {};
  this.containers.seriesGroup = createSVGElement('g', null, [
    this.seriesLine.containers && this.seriesLine.containers.seriesLineGroup,
  ]);
}

/**
 * @description Draw LINE type chart series.
 *
 * @constructor ChartSeriesLine
 *
 * @param series: object
 * @param config: object
 */
function ChartSeriesLine(series, config) {
  if (!series || !series.length) {
    return;
  }

  this.config = config;
  this.series = series;

  var chartSeries = this.series
    .map(function (seriesItem) {

      return Object.assign({}, seriesItem, {
        data: ((seriesItem || {}).data || [])
          .reduce(function (acc, dataItem, i, dataArray) {
            if (!dataItem || (i === dataArray.length - 1)) {
              return acc;
            }
            var newData = Object.assign({}, dataItem, {
              x1: dataItem.x,
              y1: dataItem.y,
              x2: dataArray[i + 1].x,
              y2: dataArray[i + 1].y,
            });
            acc.push(newData);
            return acc;
          }, []),
      });
    })
    .map(function (seriesWithCoords) {
      var minMaxX = getMinMaxOfSeriesData(this.config.series, 'x');
      var minMaxY = getMinMaxOfSeriesData(this.config.series, 'y');
      var areaCoords = getCoordsUnderTitle(this.config, seriesWithCoords.spacing);

      return seriesWithCoords.data
        .map(function (dataWithCoords) {
          var x1 = areaCoords.x1 + areaCoords.innerWidth * ((dataWithCoords.x1 - minMaxX.min) / (minMaxX.max - minMaxX.min));
          var y1 = areaCoords.y2 - areaCoords.innerHeight * ((dataWithCoords.y1 - minMaxY.min) / (minMaxY.max - minMaxY.min));
          var x2 = areaCoords.x1 + areaCoords.innerWidth * ((dataWithCoords.x2 - minMaxX.min) / (minMaxX.max - minMaxX.min));
          var y2 = areaCoords.y2 - areaCoords.innerHeight * ((dataWithCoords.y2 - minMaxY.min) / (minMaxY.max - minMaxY.min));

          var defaultAttr = attrObjectToValidObject({
            strokeWidth: 2,
          });
          var configAttr = attrObjectToValidObject(dataWithCoords.attr);
          var generatedAttr = {
            d: 'M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2,
          };
          var pathAttr = Object.assign({}, defaultAttr, configAttr, generatedAttr);

          return createSVGElement('path', pathAttr);
        });
    }.bind(this));

  this.containers = {};
  this.containers.seriesLineGroup = createSVGElement('g', null, chartSeries);
}

// ================================================================================================================= //
// ================================================ CHART SELECT AREA ============================================== //
// ================================================================================================================= //

/**
 * @description Create select area.
 *
 * @constructor ChartSelectArea
 *
 * @param selectArea {{
 *   type: 'x',
 *   selectAttr: {
 *    fill: string,
 *    stroke: string,
 *   },
 *   bgAttr: {
 *    fill: string,
 *   },
 *   ranges: {
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   },
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   onSelect(min: number, max: number, config: object): void,
 *  }}
 * @param config: object
 */
function ChartSelectArea(selectArea, config) {
  this.config = config;
  this.selectArea = selectArea;

  var verticalBorderdWidth = this.selectArea.type.search('y') !== -1 ? 7 : 2;
  var horizontalBorderdWidth = this.selectArea.type.search('x') !== -1 ? 7 : 2;

  var innerContentCoords = getCoordsUnderTitle(this.config, this.selectArea.spacing);

  var borderTopAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1) + horizontalBorderdWidth,
    y1: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y1),
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2) - horizontalBorderdWidth,
    y2: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y1) + verticalBorderdWidth,
  };
  var borderLeftAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1),
    y1: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y1),
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1) + horizontalBorderdWidth,
    y2: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y2),
  };
  var borderRightAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2) - horizontalBorderdWidth,
    y1: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y1),
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2),
    y2: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y2),
  };
  var borderBottomAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1) + horizontalBorderdWidth,
    y1: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y2) - verticalBorderdWidth,
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2) - horizontalBorderdWidth,
    y2: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y2),
  };

  var overlayTopAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1),
    y1: innerContentCoords.y1,
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2),
    y2: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y1),
  };
  var overlayLeftAreaCoords = {
    x1: innerContentCoords.x1,
    y1: innerContentCoords.y1,
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1),
    y2: innerContentCoords.y2,
  };
  var overlayRightAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2),
    y1: innerContentCoords.y1,
    x2: innerContentCoords.x2,
    y2: innerContentCoords.y2,
  };
  var overlayBottomAreaCoords = {
    x1: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x1),
    y1: innerContentCoords.y1 + (innerContentCoords.innerHeight * this.selectArea.ranges.y2),
    x2: innerContentCoords.x1 + (innerContentCoords.innerWidth * this.selectArea.ranges.x2),
    y2: innerContentCoords.y2,
  };

  var borderRectTop = Object.assign({}, this.selectArea.selectAttr, {
    x: borderTopAreaCoords.x1,
    y: borderTopAreaCoords.y1,
    width: borderTopAreaCoords.x2 - borderTopAreaCoords.x1,
    height: borderTopAreaCoords.y2 - borderTopAreaCoords.y1,
  });
  var borderRectLeft = Object.assign({}, this.selectArea.selectAttr, {
    x: borderLeftAreaCoords.x1,
    y: borderLeftAreaCoords.y1,
    width: borderLeftAreaCoords.x2 - borderLeftAreaCoords.x1,
    height: borderLeftAreaCoords.y2 - borderLeftAreaCoords.y1,
  });
  var borderRectRight = Object.assign({}, this.selectArea.selectAttr, {
    x: borderRightAreaCoords.x1,
    y: borderRightAreaCoords.y1,
    width: borderRightAreaCoords.x2 - borderRightAreaCoords.x1,
    height: borderRightAreaCoords.y2 - overlayRightAreaCoords.y1,
  });
  var borderRectBottom = Object.assign({}, this.selectArea.selectAttr, {
    x: borderBottomAreaCoords.x1,
    y: borderBottomAreaCoords.y1,
    width: borderBottomAreaCoords.x2 - borderBottomAreaCoords.x1,
    height: borderBottomAreaCoords.y2 - borderBottomAreaCoords.y1,
  });

  var bgRectTop = Object.assign({}, this.selectArea.bgAttr, {
    x: overlayTopAreaCoords.x1,
    y: overlayTopAreaCoords.y1,
    width: overlayTopAreaCoords.x2 - overlayTopAreaCoords.x1,
    height: overlayTopAreaCoords.y2 - overlayTopAreaCoords.y1,
  });
  var bgRectLeft = Object.assign({}, this.selectArea.bgAttr, {
    x: overlayLeftAreaCoords.x1,
    y: overlayLeftAreaCoords.y1,
    width: overlayLeftAreaCoords.x2 - overlayLeftAreaCoords.x1,
    height: overlayLeftAreaCoords.y2 - overlayLeftAreaCoords.y1,
  });
  var bgRectRight = Object.assign({}, this.selectArea.bgAttr, {
    x: overlayRightAreaCoords.x1,
    y: overlayRightAreaCoords.y1,
    width: overlayRightAreaCoords.x2 - overlayRightAreaCoords.x1,
    height: overlayRightAreaCoords.y2 - overlayRightAreaCoords.y1,
  });
  var bgRectBottom = Object.assign({}, this.selectArea.bgAttr, {
    x: overlayBottomAreaCoords.x1,
    y: overlayBottomAreaCoords.y1,
    width: overlayBottomAreaCoords.x2 - overlayBottomAreaCoords.x1,
    height: overlayBottomAreaCoords.y2 - overlayBottomAreaCoords.y1,
  });

  this.containers = {};

  this.containers.borderTop = createSVGElement('rect', borderRectTop);
  this.containers.borderLeft = createSVGElement('rect', borderRectLeft);
  this.containers.borderRight = createSVGElement('rect', borderRectRight);
  this.containers.borderBottom = createSVGElement('rect', borderRectBottom);

  this.containers.bgTop = createSVGElement('rect', bgRectTop);
  this.containers.bgLeft = createSVGElement('rect', bgRectLeft);
  this.containers.bgRight = createSVGElement('rect', bgRectRight);
  this.containers.bgBottom = createSVGElement('rect', bgRectBottom);

  this.containers.borderGroup = createSVGElement('g', null,[
    this.containers.borderTop,
    this.containers.borderLeft,
    this.containers.borderRight,
    this.containers.borderBottom,
  ]);

  this.containers.bgGroup = createSVGElement('g', null,[
    this.containers.bgTop,
    this.containers.bgLeft,
    this.containers.bgRight,
    this.containers.bgBottom,
  ]);

  this.containers.selectAreaGroup = createSVGElement('g', null, [
    this.containers.bgGroup,
    this.containers.borderGroup,
  ]);
}