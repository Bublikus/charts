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
