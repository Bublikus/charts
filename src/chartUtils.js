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
    throw new Error('"renderTo" property is invalid. Expected string selector or DOM element.');
  }

  return chartContainer;
}

/**
 * @description Get chart sizes.
 *
 * @function getChartSizes
 *
 * @param chartOptions: {
 *  width: number,
 *  height: number,
 *  renderTo: string | HTMLElement,
 *  animationDuration: number,
 * }
 *
 * @return chartOptions {{
 *  width: number,
 *  height: number,
 *  renderTo: string | HTMLElement,
 *  animationDuration: number,
 * }}
 */
function getChartSizes(chartOptions) {
  var renderTo = getChartContainer(chartOptions.renderTo);
  return Object.assign({}, chartOptions, {
    renderTo: renderTo,
    width: chartOptions.width || renderTo.offsetWidth,
    height: chartOptions.height || renderTo.offsetHeight,
  });
}

/**
 * @description Gets min and max values from {prop} in "data" of "series".
 *
 * @function getMinMaxOfSeriesData
 *
 * @param series: [{ data: [{ [prop]: number }] }
 * @param prop: string
 *
 * @return {{
 *  min: number,
 *  max: number,
 * }}
 */
function getMinMaxOfSeriesData(series, prop) {
  if (!Array.isArray(series)) {
    return {
      min: 0,
      max: 0,
    };
  }
  if (!prop) {
    console.error(new Error('You need to define "prop" in "getMinMaxOfSeriesData" function.'));
  }
  var min = Math.min.apply(null,
    series.map(function (seriesItem) {
      return Math.min.apply(null,
        ((seriesItem || {}).data || []).map(function (dataItem) {
          return (dataItem || {})[prop] || 0;
        }),
      );
    }),
  );
  var max = Math.max.apply(null,
    series.map(function (seriesItem) {
      return Math.max.apply(null,
        ((seriesItem || {}).data || []).map(function (dataItem) {
          return (dataItem || {})[prop] || 0;
        }),
      );
    }),
  );
  return {
    min: min,
    max: max,
  };
}

/**
 * @description Get coords of real chart sizes from spacing.
 *
 * @function getCoordsFromSpacing
 *
 * @param spacing: {
 *  top: number,
 *  left: number,
 *  right: number,
 *  bottom: number,
 * }
 * @param mainSize: {
 *  width: number,
 *  height: number,
 * }
 *
 * @return {{
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 *  innerWidth: number,
 *  innerHeight: number,
 * }}
 */
function getCoordsFromSpacing(spacing, mainSize) {
  if (!mainSize) {
    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      innerWidth: 0,
      innerHeight: 0,
    }
  }

  mainSize.width = mainSize.width || 0;
  mainSize.height = mainSize.height || 0;

  if (!spacing) {
    return {
      x1: 0,
      y1: 0,
      x2: mainSize.width,
      y2: mainSize.height,
      innerWidth: mainSize.width,
      innerHeight: mainSize.height,
    }
  }

  spacing.top = spacing.top || 0;
  spacing.left = spacing.left || 0;
  spacing.right = spacing.right || 0;
  spacing.bottom = spacing.bottom || 0;

  return {
    x1: spacing.left,
    y1: spacing.top,
    x2: mainSize.width - spacing.right,
    y2: mainSize.height - spacing.bottom,
    innerWidth: mainSize.width - spacing.left - spacing.right,
    innerHeight: mainSize.height - spacing.top - spacing.bottom,
  }
}

/**
 * @description Get x coords from horizontal text align inside spacing.
 *
 * @function getXFromTextHAlign
 *
 * @param textAnchor: 'start' | 'middle' | 'end'
 * @param spacingCoords {{
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 *   innerWidth: number,
 *   innerHeight: number,
 * }}
 *
 * @return {number}
 */
function getXFromTextHAlign(textAnchor, spacingCoords) {
  return textAnchor === 'middle'
    ? spacingCoords.x1 + spacingCoords.innerWidth / 2
    : textAnchor === 'end'
      ? spacingCoords.x1 + spacingCoords.innerWidth
      : spacingCoords.x1;
}

/**
 * @description Get y coords from vertical text align inside spacing.
 *
 * @function getYFromTextVAlign
 *
 * @param dominantBaseline: 'start' | 'middle' | 'end'
 * @param spacingCoords {{
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 *   innerWidth: number,
 *   innerHeight: number,
 * }}
 * @param fontSizeHeight: number
 *
 * @return {number}
 */
function getYFromTextVAlign(dominantBaseline, spacingCoords, fontSizeHeight) {
  return dominantBaseline === 'middle'
    ? spacingCoords.y1 + spacingCoords.innerHeight / 2
    : dominantBaseline === 'baseline'
      ? spacingCoords.y1 + spacingCoords.innerHeight - (fontSizeHeight || 0)
      : spacingCoords.y1;
}

/**
 * @description Get coords of content inside spacing under title.
 *
 * @function getCoordsUnderTitle
 *
 * @param config: object
 * @param spacing {{
 *  top: number,
 *  left: number,
 *  right: number,
 *  bottom: number,
 * }}
 *
 * @return {{
 *  y1: number,
 *  x1: number,
 *  y2: number,
 *  x2: number,
 *  innerWidth: number,
 *  innerHeight: number,
 * }}
 */
function getCoordsUnderTitle(config, spacing) {
  var titleHeight = config.title.enabled
    ? config.title.spacing.top + config.title.spacing.bottom + config.title.style.fontSize * appConfig.defaultLineHeight
    : 0;
  var spacingCoords = getCoordsFromSpacing(spacing, {
    width: config.chart.width,
    height: config.chart.height,
  });
  var y1 = spacingCoords.y1 + titleHeight;
  return {
    x1: spacingCoords.x1,
    y1: y1,
    x2: spacingCoords.x2,
    y2: spacingCoords.y2,
    innerWidth: spacingCoords.x2 - spacingCoords.x1,
    innerHeight: spacingCoords.y2 - y1,
  };
}