/**
 * @description Entry point of chart drawing.
 *
 * @function doChart
 *
 * @param config: object
 * @param defaultConfig: object
 *
 * @return chart: object
 */
function doChart(config, defaultConfig) {
  var newConfig = mergeObjectSave(defaultConfig, config);
  newConfig.chart = getChartSizes(newConfig.chart);

  // Redraw on window resize.
  window.addEventListener('resize', function () {
    var redrawConfig = mergeObjectSave(defaultConfig, config);
    redrawConfig.chart = getChartSizes(newConfig.chart);
    requestAnimationFrame(function () {
      drawChart(redrawConfig);
    });
  });

  return drawChart(newConfig);
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
  return new Chartic(config);
}

// ================================================================================================================= //
// ================================================ CHART CONTROLLER =============================================== //
// ================================================================================================================= //

/**
 * @description Chart class.
 *
 * @constructor Chartic
 *
 * @param config: object
 */
function Chartic(config) {
  this.config = config;
  this.config.id = Math.random().toString().replace('.', '');

  this.title = new ChartTitle(this.config.title, this.config);
  this.xAxis = new ChartXAxis(this.config.xAxis, this.config);
  this.yAxis = new ChartYAxis(this.config.yAxis, this.config);
  this.series = new ChartSeries(this.config.series, this.config);
  this.selectArea = new ChartSelectArea(this.config.selectArea, this.config);
  this.legend = new ChartLegend(this.config.legend, this.config);
  this.tooltip = new ChartTooltip(this.config.tooltip, this.config);

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
    this.config.legend.enabled && this.legend.containers && this.legend.containers.legendGroup,
    this.config.tooltip.enabled && this.tooltip.containers && this.tooltip.containers.tooltipGroup,
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
    style: camelCaseObjToDashString(Object.assign({}, { userSelect: 'none' }, this.title.style)),
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

  var clipId = this.config.id + '_xAxis-visible-area-id';
  var areaCoords = getCoordsUnderTitle(config, Object.assign({}, this.xAxis.spacing, {
    bottom: 0,
  }));
  var rectAttr = {
    x: areaCoords.x1,
    y: areaCoords.y1,
    width: areaCoords.innerWidth,
    height: areaCoords.innerHeight,
  };

  this.containers = {};
  this.containers.clipRects = createSVGElement('rect', rectAttr);
  this.containers.clipPath = createSVGElement('clipPath', { id: clipId }, this.containers.clipRects);
  this.containers.xAxisGroup = createSVGElement('g', null, [
    this.containers.clipPath,
    this.xAxis.line.enabled && this.xAxisLine.containers && this.xAxisLine.containers.xAxisLine,
    this.xAxis.labels.enabled && this.xAxisLabels.containers && this.xAxisLabels.containers.xAxisLabelsGroup,
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
    style: camelCaseObjToDashString(this.xAxisLine.style),
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
        style: camelCaseObjToDashString(this.xAxisLineGrids.style),
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

  var labels = generateXLabelsProps(this.config);

  this.containers = {};
  this.containers.xAxisLabels = labels.map(function (labelProps) {
    return createSVGElement('text', labelProps.attr, labelProps.children);
  });
  this.containers.xAxisLabelsGroup = createSVGElement('g', {
    className: 'chartic_xAsix-labels-group',
    clipPath: 'url(#' + (this.config.id + '_xAxis-visible-area-id') + ')'
  }, this.containers.xAxisLabels);
}

/**
 * @description Generate attributes and children for labels of an axis.
 *
 * @function generateXLabelsProps
 *
 * @param config: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 *
 * @return {{children, attr}[]}
 */
function generateXLabelsProps(config, selectedArea) {
  return new Array(config.xAxis.ticksAmount + 1) // +1 for displaying label on last line
    .fill(0)
    .map(function (_tickVal, index) {
      return generateXLabelAttrs(config, selectedArea, index);
    });
}

/**
 * @description Generate attributes for a label.
 *
 * @function generateXLabelAttrs
 *
 * @param config: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 * @param index: number
 *
 * @return {{children, attr}}}
 */
function generateXLabelAttrs(config, selectedArea, index) {
  var xAxisLineLabels = config.xAxis.labels;
  var areaVisible = getCoordsUnderTitle(config, config.xAxis.spacing);
  var safeArea = {
    x1: getNumber((selectedArea || {}).x1, 0),
    y1: getNumber((selectedArea || {}).y1, 0),
    x2: getNumber((selectedArea || {}).x2, 1),
    y2: getNumber((selectedArea || {}).y2, 1),
  };
  var innerLabelsVisibleCoords = {
    x1: safeArea.x1 * areaVisible.innerWidth / (safeArea.x2 - safeArea.x1),
    x2: (1 - safeArea.x2) * areaVisible.innerWidth / (safeArea.x2 - safeArea.x1),
  };
  var innerLabelsContentCoords = getCoordsUnderTitle(config, {
    top: config.xAxis.spacing.top + config.xAxis.labels.spacing.top - getNumber(innerLabelsVisibleCoords.y1, 0),
    left: config.xAxis.spacing.left + config.xAxis.labels.spacing.left - getNumber(innerLabelsVisibleCoords.x1, 0),
    right: config.xAxis.spacing.right + config.xAxis.labels.spacing.right - getNumber(innerLabelsVisibleCoords.x2, 0),
    bottom: config.xAxis.spacing.bottom + config.xAxis.labels.spacing.bottom - getNumber(innerLabelsVisibleCoords.y2, 0),
  });

  var minMaxX = getMinMaxOfSeriesData(config.series, 'x');
  var labelTextStep = (minMaxX.max - minMaxX.min) / config.xAxis.ticksAmount;
  var labelText = xAxisLineLabels.formatter(Math.round(labelTextStep * (index + 1)), index, config);
  var labelX = innerLabelsContentCoords.x1 + index * (innerLabelsContentCoords.x2 - innerLabelsContentCoords.x1) / config.xAxis.ticksAmount;

  var xAxisLineGridsAttr = Object.assign({}, attrObjectToValidObject(xAxisLineLabels.attr), {
    x: 0,
    y: 0,
    style: camelCaseObjToDashString(Object.assign({}, { userSelect: 'none' }, xAxisLineLabels.style, {
      transition: config.chart.animationDuration + 'ms ease-out',
      transform: 'translate(' + (labelX + xAxisLineLabels.x) + 'px,' + (innerLabelsContentCoords.y2 + xAxisLineLabels.y) + 'px)',
    })),
  });

  return {
    attr: xAxisLineGridsAttr,
    children: labelText,
  };
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

  var clipId = this.config.id + '_yAxis-visible-area-id';
  var areaCoords = getCoordsUnderTitle(config, this.yAxis.spacing);
  var rectAttr = {
    x: areaCoords.x1,
    y: areaCoords.y1,
    width: areaCoords.innerWidth,
    height: areaCoords.innerHeight,
  };

  this.containers = {};
  this.containers.clipRects = createSVGElement('rect', rectAttr);
  this.containers.clipPath = createSVGElement('clipPath', { id: clipId }, this.containers.clipRects);
  this.containers.yAxisGroup = createSVGElement('g', null, [
    this.containers.clipPath,
    this.yAxis.line.enabled && this.yAxisLine.containers && this.yAxisLine.containers.yAxisLine,
    this.yAxis.labels.enabled && this.yAxisLabels.containers && this.yAxisLabels.containers.yAxisLabelsGroup,
    this.yAxis.gridLine.enabled && this.yAxisLineGrids.containers && this.yAxisLineGrids.containers.yAxisLineGridsGroup,
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
    style: camelCaseObjToDashString(this.yAxisLine.style),
    clipPath: 'url(#' + (this.config.id + '_yAxis-visible-area-id') + ')',
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

  var yAxisGridLineAttr = generateYAxisGridLineAttr(this.config);

  this.containers = {};
  this.containers.yAxisLineGrids = yAxisGridLineAttr.map(function (labelAttr) {
    return createSVGElement('path', labelAttr);
  }.bind(this));
  this.containers.yAxisLineGridsGroup = createSVGElement('g', {
    clipPath: 'url(#' + (this.config.id + '_yAxis-visible-area-id') + ')'
  }, this.containers.yAxisLineGrids);
}

/**
 * @description Generate attributes for yAxis grid lines.
 *
 * @function generateYAxisGridLineAttr
 *
 * @param config: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 *
 * @return {object[]}
 */
function generateYAxisGridLineAttr(config, selectedArea) {
  var safeArea = {
    x1: getNumber((selectedArea || {}).x1, 0),
    y1: getNumber((selectedArea || {}).y1, 0),
    x2: getNumber((selectedArea || {}).x2, 1),
    y2: getNumber((selectedArea || {}).y2, 1),
  };
  var areaSpacing = getCoordsUnderTitle(config, config.yAxis.spacing);
  var innerContentCoords = Object.assign({}, areaSpacing, {
    y1: areaSpacing.y1 - safeArea.y1 * areaSpacing.innerHeight / (safeArea.y2 - safeArea.y1),
    y2: areaSpacing.y2 + (1 - safeArea.y2) * areaSpacing.innerHeight / (safeArea.y2 - safeArea.y1),
  });
  return new Array(config.yAxis.ticksAmount)
    .fill(0)
    .map(function (_val, index) {
      return index + 1;
    })
    .filter(Boolean)
    .map(function (index) {
      var gridLineY = innerContentCoords.y2 - index * ((innerContentCoords.y2 - innerContentCoords.y1) / (config.yAxis.ticksAmount + 1)); // -1 for correct hiding last grid line
      var dOfPath = 'M ' + innerContentCoords.x1 + ',' + 0 + ' H ' + innerContentCoords.x2;
      return Object.assign({}, attrObjectToValidObject(config.yAxis.gridLine.attr), {
        d: dOfPath,
        style: camelCaseObjToDashString(Object.assign({}, config.yAxis.gridLine.style, {
          transform: 'translate(0,' + gridLineY + 'px)',
          transition: config.chart.animationDuration + 'ms ease-out',
        })),
      });
    });
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

  var labels = generateXLabelsProps(this.config);

  this.containers = {};
  this.containers.yAxisLabels = labels.map(function (labelProps) {
    return createSVGElement('text', labelProps.attr, labelProps.children);
  }.bind(this));
  this.containers.yAxisLabelsGroup = createSVGElement('g', {
    clipPath: 'url(#' + (this.config.id + '_yAxis-visible-area-id') + ')',
  }, this.containers.yAxisLabels);
}

/**
 * @description Generate attributes and children for labels of an axis.
 *
 * @function generateYLabelsProps
 *
 * @param config: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 *
 * @return {{children, attr}[]}
 */
function generateYLabelsProps(config, selectedArea) {
  return new Array(config.yAxis.ticksAmount + 1) // +1 for displaying label on last line
    .fill(0)
    .map(function (_tickVal, index) {
      return generateYLabelAttrs(config, selectedArea, index);
    });
}

/**
 * @description Generate attributes for a label.
 *
 * @function generateYLabelAttrs
 *
 * @param config: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 * @param index: number
 *
 * @return {{children, attr}}}
 */
function generateYLabelAttrs(config, selectedArea, index) {
  var yAxisLineLabels = config.yAxis.labels;
  var areaVisible = getCoordsUnderTitle(config, config.yAxis.spacing);
  var safeArea = {
    x1: getNumber((selectedArea || {}).x1, 0),
    y1: getNumber((selectedArea || {}).y1, 0),
    x2: getNumber((selectedArea || {}).x2, 1),
    y2: getNumber((selectedArea || {}).y2, 1),
  };
  var innerLabelsVisibleCoords = {
    y1: safeArea.y1 * areaVisible.innerHeight / (safeArea.y2 - safeArea.y1),
    y2: (1 - safeArea.y2) * areaVisible.innerHeight / (safeArea.y2 - safeArea.y1),
  };
  var innerLabelsContentCoords = getCoordsUnderTitle(config, {
    top: config.yAxis.spacing.top + yAxisLineLabels.spacing.top - getNumber(innerLabelsVisibleCoords.y1, 0),
    left: config.yAxis.spacing.left + yAxisLineLabels.spacing.left - getNumber(innerLabelsVisibleCoords.x1, 0),
    right: config.yAxis.spacing.right + yAxisLineLabels.spacing.right - getNumber(innerLabelsVisibleCoords.x2, 0),
    bottom: config.yAxis.spacing.bottom + yAxisLineLabels.spacing.bottom - getNumber(innerLabelsVisibleCoords.y2, 0),
  });

  var filteredSeries = filterSeriesDataBySelectArea(config.series, safeArea, 'x');
  var minMaxY = getMinMaxOfSeriesData(filteredSeries, 'y');
  var labelTextStep = (minMaxY.max - Math.min(minMaxY.min, 0)) / config.yAxis.ticksAmount;
  var labelText = yAxisLineLabels.formatter(Math.round(labelTextStep * index), index, config);
  var labelY = innerLabelsContentCoords.y2 - index * (innerLabelsContentCoords.y2 - innerLabelsContentCoords.y1) / (config.yAxis.ticksAmount + 1); // -1for correct hiding last grid line

  var yAxisLabelsAttr = Object.assign({}, attrObjectToValidObject(yAxisLineLabels.attr), {
    x: 0,
    y: 0,
    style: camelCaseObjToDashString(Object.assign({}, { userSelect: 'none' }, yAxisLineLabels.style, {
      transition: config.chart.animationDuration + 'ms ease-out',
      transform: 'translate(' + (innerLabelsContentCoords.x1 + yAxisLineLabels.x) + 'px,' + (labelY + yAxisLineLabels.y) + 'px)',
    })),
  });

  return {
    attr: yAxisLabelsAttr,
    children: labelText,
  };
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
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   data: {
 *    x: number,
 *    y: number,
 *    info: object,
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
 * @param series: object[]
 * @param config: object
 */
function ChartSeriesLine(series, config) {
  if (!series || !series.length) {
    return;
  }

  this.config = config;
  this.series = series;
  this.clipPathId = this.config.id + '_series-visible-area-id';

  var chartSeriesAttrs = makeSeriesPaths(this.config);

  this.containers = {};
  this.containers.clipRects = this.series.map(function (seriesItem) {
    var areaCoords = getCoordsUnderTitle(config, seriesItem.spacing);
    var rectAttr = {
      x: areaCoords.x1,
      y: areaCoords.y1,
      width: areaCoords.innerWidth,
      height: areaCoords.innerHeight,
    };
    return createSVGElement('rect', rectAttr);
  }.bind(this));
  this.containers.pathElements = chartSeriesAttrs.map(function (attr) {
    var pathAttr = Object.assign({}, attr, {
      clipPath: 'url(#' + this.clipPathId + ')',
      style: camelCaseObjToDashString({
        transition: this.config.chart.animationDuration + 'ms ease-out',
      }),
    });
    return createSVGElement('path', pathAttr);
  }.bind(this));
  this.containers.clipPath = createSVGElement('clipPath', { id: this.clipPathId }, this.containers.clipRects);
  this.containers.seriesLineGroup = createSVGElement('g', null, [
    this.containers.clipPath,
    this.containers.pathElements,
  ]);
}

/**
 * @description Generate series attributes with paths.
 *
 * @function makeSeriesPaths
 *
 * @param config: object
 * @param areaSize {{
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 * }}
 *
 * @return attr {{
 *   d: string,
 *   ...
 * }}
 */
function makeSeriesPaths(config, areaSize) {
  return config.series
    .map(function (seriesItem) {

      return Object.assign({}, seriesItem, {
        data: ((seriesItem || {}).data || [])
          .reduce(function (acc, dataItem) {
            if (!dataItem) {
              return acc;
            }
            var newData = Object.assign({}, dataItem, {
              x: dataItem.x,
              y: dataItem.y,
            });
            acc.push(newData);
            return acc;
          }, []),
      });
    })
    .map(function (seriesWithCoords) {
      var areaVisible = getCoordsUnderTitle(config, seriesWithCoords.spacing);
      var safeArea = {
        x1: getNumber((areaSize || {}).x1, 0),
        y1: getNumber((areaSize || {}).y1, 0),
        x2: getNumber((areaSize || {}).x2, 1),
        y2: getNumber((areaSize || {}).y2, 1),
      };
      var areaSpacing = {
        top: seriesWithCoords.spacing.top - safeArea.y1 * areaVisible.innerHeight / (safeArea.y2 - safeArea.y1),
        left: seriesWithCoords.spacing.left - safeArea.x1 * areaVisible.innerWidth / (safeArea.x2 - safeArea.x1),
        right: seriesWithCoords.spacing.right - (1 - safeArea.x2) * areaVisible.innerWidth / (safeArea.x2 - safeArea.x1),
        bottom: seriesWithCoords.spacing.bottom - (1 - safeArea.y2) * areaVisible.innerHeight / (safeArea.y2 - safeArea.y1),
      };

      var filteredSeries = filterSeriesDataBySelectArea(config.series, safeArea, 'x');
      var minMaxY = getMinMaxOfSeriesData(filteredSeries, 'y', 0);
      var minMaxX = getMinMaxOfSeriesData(config.series, 'x');
      var areaCoords = getCoordsUnderTitle(config, areaSpacing);
      var defaultAttr = attrObjectToValidObject(seriesWithCoords.attr);

      var path = seriesWithCoords.data
        .reduce(function (acc, dataWithCoords, i) {
          var x = areaCoords.x1 + areaCoords.innerWidth * ((dataWithCoords.x - minMaxX.min) / (minMaxX.max - minMaxX.min));
          var y = areaCoords.y1 - areaCoords.innerHeight * ((dataWithCoords.y - minMaxY.min) / (minMaxY.max - minMaxY.min)) + areaCoords.innerHeight;
          acc += (i === 0 ? 'M ' : ' L ') + x + ',' + y;
          return acc;
        }, '');

      return Object.assign({}, defaultAttr, { d: path });
    });
}

/**
 * @description Filter series data by selected area.
 *
 * @function filterSeriesDataBySelectArea
 *
 * @param series: object
 * @param selectedArea {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 * }}
 * @param axis: string
 *
 * @return {object[]}
 */
function filterSeriesDataBySelectArea(series, selectedArea, axis) {
  return series
    .map(function (seriesItem) {
      var data = (seriesItem || {}).data || [];
      var minOfSelectedData = Math.floor(data.length * selectedArea[axis + '1']);
      var maxOfSelectedData = Math.round(data.length * selectedArea[axis + '2']);
      return Object.assign({}, seriesItem, {
        data: data.slice(minOfSelectedData, maxOfSelectedData + 1), // +1 for correct view from right side
      });
    });
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
 *   type: 'x' | 'y' | 'xy',
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
 *   onSelect({
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   }, config: object): {
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   },
 *  }}
 * @param config: object
 */
function ChartSelectArea(selectArea, config) {
  this.config = config;
  this.selectArea = selectArea;

  store.selectRanges = this.selectArea.ranges;

  var chartContainer = this.config.chart.renderTo;
  var onSelect = this.selectArea.onSelect;
  var commonStyles = {
    transition: this.config.chart.animationDuration + 'ms ease-out',
  };

  var isXZoomable = this.selectArea.type.search('x') !== -1;
  var isYZoomable = this.selectArea.type.search('y') !== -1;

  var horizontalBorderWidth = isXZoomable ? 8 : 2;
  var verticalBorderWidth = isYZoomable ? 8 : 2;

  var dragAreaStyles = camelCaseObjToDashString(Object.assign({}, commonStyles, {
    cursor: 'move',
    fill: 'transparent',
  }));
  var borderVStyles = camelCaseObjToDashString(Object.assign({}, commonStyles, {
    cursor: isYZoomable ? 'ns-resize' : 'default',
  }));
  var borderHStyles = camelCaseObjToDashString(Object.assign({}, commonStyles, {
    cursor: isXZoomable ? 'ew-resize' : 'default',
  }));

  var innerContentCoords = getCoordsUnderTitle(this.config, this.selectArea.spacing);

  var dragAreaRect = Object.assign({}, { style: dragAreaStyles });
  var borderRectTop = Object.assign({}, this.selectArea.selectAttr, {
    style: borderVStyles,
    height: verticalBorderWidth + 'px',
  });
  var borderRectLeft = Object.assign({}, this.selectArea.selectAttr, {
    style: borderHStyles,
    width: horizontalBorderWidth + 'px',
  });
  var borderRectRight = Object.assign({}, this.selectArea.selectAttr, {
    style: borderHStyles,
    width: horizontalBorderWidth + 'px',
  });
  var borderRectBottom = Object.assign({}, this.selectArea.selectAttr, {
    style: borderVStyles,
    height: verticalBorderWidth + 'px',
  });
  var bgAttrs = Object.assign({}, this.selectArea.bgAttr, {
    style: camelCaseObjToDashString(Object.assign({}, this.selectArea.bgAttr.style, commonStyles)),
  });

  this.containers = {};

  this.containers.dragAreaRect = createSVGElement('rect', dragAreaRect);
  this.containers.borderTop = createSVGElement('rect', borderRectTop);
  this.containers.borderLeft = createSVGElement('rect', borderRectLeft);
  this.containers.borderRight = createSVGElement('rect', borderRectRight);
  this.containers.borderBottom = createSVGElement('rect', borderRectBottom);

  this.containers.borderTop.addEventListener('mousedown', function () {
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', moveBorder);
    });
    document.addEventListener('mousemove', moveBorder);

    var that = this; // Need to bind this for correct removing event from document.
    function moveBorder(e) {
      if (isYZoomable) {
        var relativeY = e.clientY - chartContainer.getBoundingClientRect().top - innerContentCoords.y1 - verticalBorderWidth / 2;
        var newY = relativeY / (innerContentCoords.innerHeight - verticalBorderWidth);
        var newSelectRanges = Object.assign({}, store.selectRanges, { y1: newY });
        redrawSelectArea.call(that, newSelectRanges);
      }
    }
  }.bind(this));
  this.containers.borderLeft.addEventListener('mousedown', function () {
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', moveBorder);
    });
    document.addEventListener('mousemove', moveBorder);

    var that = this; // Need to bind this for correct removing event from document.
    function moveBorder(e) {
      if (isXZoomable) {
        var relativeX = e.clientX - chartContainer.getBoundingClientRect().left - innerContentCoords.x1 - horizontalBorderWidth / 2;
        var newX = relativeX / (innerContentCoords.innerWidth - horizontalBorderWidth);
        var newSelectRanges = Object.assign({}, store.selectRanges, { x1: newX });
        redrawSelectArea.call(that, newSelectRanges);
      }
    }
  }.bind(this));
  this.containers.borderRight.addEventListener('mousedown', function () {
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', moveBorder);
    });
    document.addEventListener('mousemove', moveBorder);

    var that = this; // Need to bind this for correct removing event from document.
    function moveBorder(e) {
      if (isXZoomable) {
        var relativeX = e.clientX - chartContainer.getBoundingClientRect().left - innerContentCoords.x1 - horizontalBorderWidth / 2;
        var newX = relativeX / (innerContentCoords.innerWidth - horizontalBorderWidth);
        var newSelectRanges = Object.assign({}, store.selectRanges, { x2: newX });
        redrawSelectArea.call(that, newSelectRanges);
      }
    }
  }.bind(this));
  this.containers.borderBottom.addEventListener('mousedown', function () {
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', moveBorder);
    });
    document.addEventListener('mousemove', moveBorder);

    var that = this; // Need to bind this for correct removing event from document.
    function moveBorder(e) {
      if (isYZoomable) {
        var relativeY = e.clientY - chartContainer.getBoundingClientRect().top - innerContentCoords.y1 - verticalBorderWidth / 2;
        var newY = relativeY / (innerContentCoords.innerHeight - verticalBorderWidth);
        var newSelectRanges = Object.assign({}, store.selectRanges, { y2: newY });
        redrawSelectArea.call(that, newSelectRanges);
      }
    }
  }.bind(this));
  this.containers.dragAreaRect.addEventListener('mousedown', function (e) {
    var globX = e.clientX - chartContainer.getBoundingClientRect().left - innerContentCoords.x1 - horizontalBorderWidth / 2;
    var globY = e.clientY - chartContainer.getBoundingClientRect().top - innerContentCoords.y1 - verticalBorderWidth / 2;
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', moveBorder);
    });
    document.addEventListener('mousemove', moveBorder);

    var that = this; // Need to bind this for correct removing event from document.
    function moveBorder(e) {
      var localX = e.clientX - chartContainer.getBoundingClientRect().left - innerContentCoords.x1 - horizontalBorderWidth / 2;
      var localY = e.clientY - chartContainer.getBoundingClientRect().top - innerContentCoords.y1 - verticalBorderWidth / 2;

      var newX = isXZoomable ? (localX - globX) / (innerContentCoords.innerWidth - horizontalBorderWidth) : 0;
      var newY = isYZoomable ? (localY - globY) / (innerContentCoords.innerHeight - verticalBorderWidth) : 0;

      globX = localX;
      globY = localY;

      var newSelectRanges = Object.assign({}, store.selectRanges, {
        x1: store.selectRanges.x1 + newX,
        y1: store.selectRanges.y1 + newY,
        x2: store.selectRanges.x2 + newX,
        y2: store.selectRanges.y2 + newY,
      });
      redrawSelectArea.call(that, newSelectRanges);
    }
  }.bind(this));

  this.containers.bgTop = createSVGElement('rect', bgAttrs);
  this.containers.bgLeft = createSVGElement('rect', bgAttrs);
  this.containers.bgRight = createSVGElement('rect', bgAttrs);
  this.containers.bgBottom = createSVGElement('rect', bgAttrs);

  redrawSelectArea.call(this, this.selectArea.ranges);

  function redrawSelectArea(newSelectRangesIn) {
    requestAnimationFrame(function () {
      if (
        newSelectRangesIn.x1 < 0 || newSelectRangesIn.x1 > newSelectRangesIn.x2
        || newSelectRangesIn.x2 > 1 || newSelectRangesIn.x2 < newSelectRangesIn.x1
        || newSelectRangesIn.y1 < 0 || newSelectRangesIn.y1 > newSelectRangesIn.y2
        || newSelectRangesIn.y2 > 1 || newSelectRangesIn.y2 < newSelectRangesIn.y1
      ) {
        return;
      }

      var newSelectRanges = onSelect(newSelectRangesIn) || newSelectRangesIn;
      store.selectRanges = newSelectRanges;
      eventAggregator.dispatch('selectRange', newSelectRanges);

      var relativeCoords = {
        xStart: innerContentCoords.x1,
        yStart: innerContentCoords.y1,
        xEnd: innerContentCoords.x2,
        yEnd: innerContentCoords.y2,
        x1: newSelectRanges.x1 * (innerContentCoords.innerWidth - horizontalBorderWidth) + innerContentCoords.x1 + horizontalBorderWidth / 2,
        y1: newSelectRanges.y1 * (innerContentCoords.innerHeight - verticalBorderWidth) + innerContentCoords.y1 + verticalBorderWidth / 2,
        x2: newSelectRanges.x2 * (innerContentCoords.innerWidth - horizontalBorderWidth) + innerContentCoords.x1 + horizontalBorderWidth / 2,
        y2: newSelectRanges.y2 * (innerContentCoords.innerHeight - verticalBorderWidth) + innerContentCoords.y1 + verticalBorderWidth / 2,
      };

      this.containers.borderTop.style.x = relativeCoords.x1 + horizontalBorderWidth / 2;
      this.containers.borderTop.style.y = relativeCoords.y1 - verticalBorderWidth / 2;
      this.containers.borderTop.style.width = relativeCoords.x2 - relativeCoords.x1 - horizontalBorderWidth;
      this.containers.borderLeft.style.x = relativeCoords.x1 - horizontalBorderWidth / 2;
      this.containers.borderLeft.style.y = relativeCoords.y1 - verticalBorderWidth / 2;
      this.containers.borderLeft.style.height = relativeCoords.y2 - relativeCoords.y1 + verticalBorderWidth;
      this.containers.borderRight.style.x = relativeCoords.x2 - horizontalBorderWidth / 2;
      this.containers.borderRight.style.y = relativeCoords.y1 - verticalBorderWidth / 2;
      this.containers.borderRight.style.height = relativeCoords.y2 - relativeCoords.y1 + verticalBorderWidth;
      this.containers.borderBottom.style.x = relativeCoords.x1 + horizontalBorderWidth / 2;
      this.containers.borderBottom.style.y = relativeCoords.y2 - verticalBorderWidth / 2;
      this.containers.borderBottom.style.width = relativeCoords.x2 - relativeCoords.x1 - horizontalBorderWidth;

      this.containers.bgTop.style.x = relativeCoords.x1 - horizontalBorderWidth / 2;
      this.containers.bgTop.style.y = relativeCoords.yStart;
      this.containers.bgTop.style.width = relativeCoords.x2 - relativeCoords.x1 + horizontalBorderWidth;
      this.containers.bgTop.style.height = (relativeCoords.y1 - verticalBorderWidth / 2) - relativeCoords.yStart;
      this.containers.bgLeft.style.x = relativeCoords.xStart;
      this.containers.bgLeft.style.y = relativeCoords.yStart;
      this.containers.bgLeft.style.width = (relativeCoords.x1 - horizontalBorderWidth / 2) - relativeCoords.xStart;
      this.containers.bgLeft.style.height = relativeCoords.yEnd - relativeCoords.yStart;
      this.containers.bgRight.style.x = relativeCoords.x2 + horizontalBorderWidth / 2;
      this.containers.bgRight.style.y = relativeCoords.yStart;
      this.containers.bgRight.style.width = relativeCoords.xEnd - (relativeCoords.x2 + horizontalBorderWidth / 2);
      this.containers.bgRight.style.height = relativeCoords.yEnd - relativeCoords.yStart;
      this.containers.bgBottom.style.x = relativeCoords.x1 - horizontalBorderWidth / 2;
      this.containers.bgBottom.style.y = relativeCoords.y2 + verticalBorderWidth / 2;
      this.containers.bgBottom.style.width = relativeCoords.x2 - relativeCoords.x1 + horizontalBorderWidth;
      this.containers.bgBottom.style.height = relativeCoords.yEnd - (relativeCoords.y2 + verticalBorderWidth / 2);

      this.containers.dragAreaRect.style.x = relativeCoords.x1 + horizontalBorderWidth / 2;
      this.containers.dragAreaRect.style.y = relativeCoords.y1 + verticalBorderWidth / 2;
      this.containers.dragAreaRect.style.width = relativeCoords.x2 - relativeCoords.x1 - horizontalBorderWidth;
      this.containers.dragAreaRect.style.height = relativeCoords.y2 - relativeCoords.y1 - verticalBorderWidth;
    }.bind(this));
  }

  this.containers.borderGroup = createSVGElement('g', null, [
    this.containers.borderTop,
    this.containers.borderLeft,
    this.containers.borderRight,
    this.containers.borderBottom,
    this.containers.dragAreaRect,
  ]);

  this.containers.bgGroup = createSVGElement('g', null, [
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

// ================================================================================================================= //
// ================================================== CHART LEGEND ================================================= //
// ================================================================================================================= //

/**
 * @description Create legend.
 *
 * @constructor ChartLegend
 *
 * @param legend {{
 *  enabled: boolean,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 * }}
 * @param config: object
 */
function ChartLegend(legend, config) {
  this.config = config;
  this.legend = legend;

  var legendItems = generateLegends(this.config, this.legend);

  eventAggregator.subscribe('legendClick', function (storeLegend) {
    this.config.series.forEach(function (item, i) {
      this.containers.unCheckCircle[i].setAttribute('r', storeLegend[item.name] ? 10 : 0);
    }.bind(this));
  }.bind(this));

  this.containers = {};
  this.containers.unCheckCircle = legendItems.map(function (legendItem) {
    return legendItem.unCheckCircle;
  });
  this.containers.legendItems = legendItems.map(function (legendItem) {
    return legendItem.group;
  });
  this.containers.legendGroup = createSVGElement('g', null, this.containers.legendItems);
}

/**
 * @description Generate legend.
 *
 * @function generateLegends
 *
 * @param config: object
 * @param legend {{
 *  enabled: boolean,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 * }}
 *
 * @return {object[]}
 */
function generateLegends(config, legend) {
  return config.series.map(function (seriesItem, i) {
    var textSize = getTextSize(seriesItem.name);
    var x = legend.spacing.left + i * (textSize.width + 60 + 10);
    var y = config.chart.height - legend.spacing.top - legend.spacing.bottom - 35;
    function callbackClick() {
      var isUncheck = !store.legend[seriesItem.name];
      store.legend = Object.assign({}, store.legend, { [seriesItem.name]: isUncheck });
      eventAggregator.dispatch('legendClick', store.legend);
    }
    return legendTemplate(x, y, seriesItem.name, seriesItem.color, !store.legend[seriesItem.name], callbackClick);
  }.bind(this));
}

/**
 * @description Generate a legend item template.
 *
 * @function legendTemplate
 *
 * @param x: number
 * @param y: number
 * @param text: string
 * @param color: string
 * @param isCheck: boolean
 * @param callback: Function
 *
 * @return {SVGElement}
 */
function legendTemplate(x, y, text, color, isCheck, callback) {
  var textSize = getTextSize(text);
  var legendHeight = 35;
  var legendWidth = textSize.width + 60;

  var rectAttr = {
    x: x,
    y: y,
    height: legendHeight,
    width: legendWidth,
    rx: legendHeight / 2,
    ry: legendHeight / 2,
    strokeWidth: 1,
    stroke: 'grey',
    fill: 'transparent',
    style: camelCaseObjToDashString({
      cursor: 'pointer',
    })
  };
  var circleAttr = {
    cx: x + 20,
    cy: y + legendHeight / 2,
    r: 10,
    fill: color,
    stroke: color,
    strokeWidth: 3,
  };
  var textAttr = {
    x: x + 40,
    y: y + legendHeight / 2,
    dominantBaseline: 'middle',
    style: camelCaseObjToDashString({
      userSelect: 'none',
    }),
  };
  var checkStateAttr1 = {
    x: x + 15,
    y: y + legendHeight / 2,
    height: 3,
    width: 7,
    fill: 'white',
  };
  var checkStateAttr2 = {
    x: x + 15 + 4,
    y: y + legendHeight / 2 - 8,
    height: 8,
    width: 3,
    fill: 'white',
  };
  var checkStateGroupAttr = {
    style: camelCaseObjToDashString({
      transformOrigin: (x + 15 + 2) + 'px ' + (y + legendHeight / 2) + 'px',
      transform: 'rotateZ(45deg)'
    })
  };
  var unCheckCircleAttr = {
    cx: x + 20,
    cy: y + legendHeight / 2,
    r: isCheck ? 0 : 10,
    fill: 'white',
    stroke: 'transparent',
    strokeWidth: 3,
    style: camelCaseObjToDashString({
      transition: '150ms ease-out',
    }),
  };

  var containers = {};
  containers.rect = createSVGElement('rect', rectAttr);
  containers.rect.onclick = callback;
  containers.circle = createSVGElement('circle', circleAttr);
  containers.textElement = createSVGElement('text', textAttr, text);
  containers.checkState1 = createSVGElement('rect', checkStateAttr1);
  containers.checkState2 = createSVGElement('rect', checkStateAttr2);
  containers.unCheckCircle = createSVGElement('circle', unCheckCircleAttr);
  containers.checkStateGroup = createSVGElement('g', checkStateGroupAttr, [containers.checkState1, containers.checkState2]);
  containers.group = createSVGElement('g', null, [
    containers.circle,
    containers.textElement,
    containers.checkStateGroup,
    containers.unCheckCircle,
    containers.rect,
  ]);

  return containers;
}

// ================================================================================================================= //
// ================================================== CHART TOOLTIP ================================================ //
// ================================================================================================================= //

function ChartTooltip(tooltip, config) {
  this.config = config;
  this.tooltip = tooltip;

  this.containers = {};
  this.containers.tooltipGroup = createSVGElement('g', null, []);
}
