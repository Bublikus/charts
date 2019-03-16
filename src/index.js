// Get chart data from JSON file.
getJson('chart_data.json').then(start);

/**
 * @description Entry point of app.
 *
 * @function start
 *
 * @param chartsData
 *
 * @return void
 */
function start(chartsData) {
  makeContainers();

  var mainChartConfig = transformChartDataToMainChartConfig(chartsData[0]);
  var subChartConfig = transformChartDataToSubChartConfig(chartsData[0]);

  // Redraw on switch theme.
  eventAggregator.subscribe('switchTheme', function () {
    mainChartConfig = transformChartDataToMainChartConfig(chartsData[0]);
    subChartConfig = transformChartDataToSubChartConfig(chartsData[0]);
    doChart(mainChartConfig, chartDefaults);
    doChart(subChartConfig, chartDefaults);
  });

  doChart(mainChartConfig, chartDefaults);
  doChart(subChartConfig, chartDefaults);
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
 *  areaOptions: {
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *  },
 *  series: {
 *   type: 'line',
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
        }
      }
    },
    yAxis: {
      spacing: {
        top: 30,
      },
      line: {
        attr: {
          stroke: 'transparent',
        }
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
      }
    },
    areaOptions: {
      spacing: {
        top: 30,
      },
    },
    legend: {

    },
    series: series,
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
 *  areaOptions: {
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *  },
 *  series: {
 *   type: 'line',
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
      enabled: false,
    },
    areaOptions: {
      spacing: {
        top: 10,
        bottom: 10,
      },
    },
    series: series,
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
 *  data: {
 *   x: number,
 *   y: number,
 *   info: object,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   },
 *  }[],
 * }[]}
 */
function getSeries(chartData) {
  var nameKeys = Object.keys(chartData.names)
    .map(function (nameKey) {
      return chartData.names[nameKey].replace('#', '');
    });

  var series = nameKeys.map(function (nameKey) {
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
          attr: {
            stroke: color,
          }
        };
      });

    return {
      type: type,
      data: data,
    };
  });

  return series;
}