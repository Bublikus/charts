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

/**
 * @description Gets min and max values from {prop} in "data" of "series".
 *
 * @function getMinMaxOfSeriesData
 *
 * @param series: { data: { [prop]: number }[] }[]
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
 * @description Get text align
 *
 * @function getTextAlign
 *
 * @param align: 'left' | 'center' | 'right'
 * @param defaultAlign: 'left' | 'center' | 'right'
 *
 * @return 'start' | 'middle' | 'end'
 */
function getTextAlign(align, defaultAlign) {
  return align === 'left' ? 'start'
    : align === 'center' ? 'middle'
      : align === 'right' ? 'end'
        : align || defaultAlign;
}

/**
 * @description Get text vertical align
 *
 * @function getTextVerticalAlign
 *
 * @param verticalAlign: 'top' | 'center' | 'bottom'
 * @param defaultVerticalAlign: 'top' | 'center' | 'bottom'
 *
 * @return 'hanging' | 'middle' | 'baseline'
 */
function getTextVerticalAlign(verticalAlign, defaultVerticalAlign) {
  return verticalAlign === 'top' ? 'hanging'
    : verticalAlign === 'center' ? 'middle'
      : verticalAlign === 'bottom' ? 'baseline'
        : verticalAlign || defaultVerticalAlign;
}

/**
 * @description Get coords of real chart sizes from spacing.
 *
 * @function getCoordsFromSpacing
 *
 * @param spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number,
 * }
 * @param mainSize: {
 *   width: number,
 *   height: number,
 * }
 *
 * @return {{
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 *   innerWidth: number,
 *   innerHeight: number,
 * }}
 */
function getCoordsFromSpacing(spacing, mainSize) {
  if (!mainSize) {
    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
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
