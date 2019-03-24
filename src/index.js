// Get chart data from JSON file.
getJson('chart_data.json').then(start);

/**
 * @description Entry point of app.
 *
 * @function start
 *
 * @param chartsData: object
 *
 * @return void
 */
function start(chartsData) {
  makeContainers();

  var mainChartConfig = transformChartDataToMainChartConfig(chartsData[0]);
  var subChartConfig = transformChartDataToSubChartConfig(chartsData[0]);

  // Redraw on switch theme.
  eventAggregator.subscribe('theme', function () {
    mainChartConfig = transformChartDataToMainChartConfig(chartsData[0]);
    subChartConfig = transformChartDataToSubChartConfig(chartsData[0]);
    doChart(mainChartConfig, chartDefaults);
    doChart(subChartConfig, chartDefaults);
  });

  var mainChart = doChart(mainChartConfig, chartDefaults);
  doChart(subChartConfig, chartDefaults);

  eventAggregator.subscribe('selectRange', function (newRanges) {
    var newConfig = mergeObjectSave(chartDefaults, mainChartConfig);
    newConfig.chart = getChartSizes(newConfig.chart);

    var chartSeriesAttrs = makeSeriesPaths(newConfig, newRanges);
    chartSeriesAttrs.forEach(function (attrs, i) {
      applyAttrsToSVGElement(mainChart.series.seriesLine.containers.pathElements[i], { d: attrs.d });
    });

    var xAxisLabels = generateXLabelsProps(newConfig, newRanges);
    xAxisLabels.forEach(function (labelProps, i) {
      mainChart.xAxis.xAxisLabels.containers.xAxisLabels[i].innerHTML = '';
      appendChildrenToContainer(mainChart.xAxis.xAxisLabels.containers.xAxisLabels[i], labelProps.children);
      applyAttrsToSVGElement(mainChart.xAxis.xAxisLabels.containers.xAxisLabels[i], labelProps.attr);
    });

    var yAxisLabels = generateYLabelsProps(newConfig, newRanges);
    yAxisLabels.forEach(function (labelProps, i) {
      mainChart.yAxis.yAxisLabels.containers.yAxisLabels[i].innerHTML = '';
      appendChildrenToContainer(mainChart.yAxis.yAxisLabels.containers.yAxisLabels[i], labelProps.children);
      applyAttrsToSVGElement(mainChart.yAxis.yAxisLabels.containers.yAxisLabels[i], labelProps.attr);
    });

    var yAxisGridLineAttr = generateYAxisGridLineAttr(newConfig, newRanges);
    yAxisGridLineAttr.forEach(function (attr, i) {
      applyAttrsToSVGElement(mainChart.yAxis.yAxisLineGrids.containers.yAxisLineGrids[i], attr);
    });
  });
}

/**
 * @description Transforms data to chart config.
 *
 * @function transformChartDataToConfig
 *
 * @param chartsData: object
 *
 * @return {{
 *  chart: {
 *   width: number,
 *   height: number,
 *   renderTo: string | HTMLElement,
 *   animationDuration: number,
 *  },
 *  title: {
 *   enabled: boolean,
 *   x: number,
 *   y: number,
 *   text: string,
 *   backgroundColor: string,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number,
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number
 *    fontWeight: number | string,
 *   },
 *  },
 *  xAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  yAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  legend: {
 *   enabled: boolean,
 *  },
 *  selectArea: {
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
 *  },
 *  tooltip: {
 *   enabled: boolean,
 *  },
 *  series: {
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
 *  }[]
 * }}
 */
function transformChartDataToMainChartConfig(chartsData) {
  var theme = store.theme.styles;

  var series = getSeries(chartsData);

  return {
    chart: {
      renderTo: document.getElementById('mainChart'),
    },
    title: {
      text: 'Followers',
      attr: {
        fill: theme.mainFont,
        textAnchor: 'start',
        dominantBaseline: 'middle',
      },
    },
    xAxis: {
      line: {
        attr: {
          stroke: theme.xAxisLine,
        },
      },
      gridLine: {
        attr: {
          stroke: 'transparent',
        },
      },
      labels: {
        spacing: {
          left: 10,
          right: 10,
        },
        attr: {
          fill: theme.xLabels,
        },
        formatter: function (step) {
          return formatDate(step);
        },
      },
    },
    yAxis: {
      spacing: {
        top: 30,
      },
      line: {
        attr: {
          stroke: 'transparent',
        },
      },
      gridLine: {
        attr: {
          stroke: theme.xAxisLine,
        },
      },
      labels: {
        y: -10,
        attr: {
          fill: theme.yLabels,
        },
      },
    },
    selectArea: {
      spacing: {
        top: 30,
      },
    },
    legend: {
      enabled: false,
    },
    series: series
      .map(function (seriesItem) {
        return Object.assign({}, seriesItem, {
          spacing: {
            top: 30,
          },
        });
      }),
  };
}

/**
 * @description Transforms data to chart config.
 *
 * @function transformChartDataToConfig
 *
 * @param chartsData: object
 *
 * @return {{
 *  chart: {
 *   width: number,
 *   height: number,
 *   renderTo: string | HTMLElement,
 *   animationDuration: number,
 *  },
 *  title: {
 *   enabled: boolean,
 *   x: number,
 *   y: number,
 *   text: string,
 *   backgroundColor: string,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number,
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number
 *    fontWeight: number | string,
 *   },
 *  },
 *  xAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  yAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  legend: {
 *   enabled: boolean,
 *  },
 *  selectArea: {
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
 *  },
 *  tooltip: {
 *   enabled: boolean,
 *  },
 *  series: {
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
 * }}
 */
function transformChartDataToSubChartConfig(chartsData) {
  var theme = store.theme.styles;

  var series = getSeries(chartsData);

  return {
    chart: {
      renderTo: document.getElementById('subChart'),
    },
    title: {
      enabled: false,
    },
    xAxis: {
      enabled: false,
    },
    yAxis: {
      enabled: false,
    },
    legend: {
      enabled: true,
      spacing: {
        top: 20,
        left: 30,
        right: 30,
        bottom: 20,
      }
    },
    tooltip: {
      enabled: false,
    },
    selectArea: {
      type: 'xy',
      ranges: {
        x1: .3,
        y1: 0,
        x2: .4,
        y2: 1,
      },
      bgAttr: {
        fill: theme.selectFrameOutOverlay,
      },
      selectAttr: {
        fill: theme.selectFrameBorders,
      },
      spacing: {
        top: 10,
        bottom: 100,
      },
    },
    series: series
      .map(function (seriesItem) {
        return Object.assign({}, seriesItem, {
          spacing: {
            top: 10,
            bottom: 100,
          },
        });
      }),
  };
}

/**
 * @description Transform chart data to valid series.
 *
 * @function getSeries
 *
 * @param chartData {{
 *  colors: {
 *   [lineName]: string,
 *  },
 *  columns: [
 *   string,
 *   {...number},
 *  ][],
 *  names: {
 *   [lineName]: string,
 *  },
 *  types: {
 *   [lineName]: 'x' | string,
 *  },
 * }}
 *
 * @return {{
 *  type: 'line',
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  attr: {
 *   stroke: string,
 *   strokeWidth: number,
 *   strokeDasharray: string,
 *  },
 *  data: {
 *   x: number,
 *   y: number,
 *   info: object,
 *  }[],
 * }[]}
 */
function getSeries(chartData) {
  var nameKeys = Object.keys(chartData.names)
    .map(function (nameKey) {
      return chartData.names[nameKey].replace('#', '');
    });

  return nameKeys
    .map(function (nameKey) {
      var keyOfData = 'y' + nameKey;

      var type = chartData.types[keyOfData];
      var name = chartData.names[keyOfData];
      var color = chartData.colors[keyOfData];
      var x = chartData.columns
        .filter(function (column) {
          return column[0] === 'x';
        })[0]
        .filter(function (data) {
          return data !== 'x';
        });
      var y = chartData.columns
        .filter(function (column) {
          return column[0] === keyOfData;
        })[0]
        .filter(function (data) {
          return data !== keyOfData;
        });
      var data = new Array(Math.min(x.length, y.length))
        .fill(0)
        .map(function (_val, i) {
          return {
            x: x[i],
            y: y[i],
            info: {
              name: name,
            },
          };
        });

      return {
        type: type,
        name: name,
        color: color,
        data: data,
        attr: {
          stroke: color,
        },
      };
    });
}