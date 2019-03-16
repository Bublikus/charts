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

  var config = transformChartDataToConfig(chartsData);

  // Redraw on switch theme.
  eventAggregator.subscribe('switchTheme', function () {
    config = transformChartDataToConfig(chartsData);
    doChart(config);
  });

  doChart(config);
}

/**
 * @description Transforms data to chart config.
 *
 * @function transformChartDataToConfig
 *
 * @param chartsData
 *
 * @return {{
 *  chart: {
 *   width: number,
 *   height: number,
 *   renderTo: string | HTMLElement,
 *  },
 *  title: {
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
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
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
 *    x: number,
 *    y: number,
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
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
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
 *    x: number,
 *    y: number,
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
 *
 *  },
 *  series: [{
 *   type: 'line',
 *   data: {
 *    x: number,
 *    y: number,
 *   },
 *  }],
 * }}
 */
function transformChartDataToConfig(chartsData) {
  var theme = store.theme.styles;

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
         stroke: theme.xLines,
        }
      },
      labels: {
        attr: {
          fill: theme.xLabels,
        },
      }
    },
    yAxis: {
      line: {
        attr: {
          stroke: theme.yLines,
        }
      },
      labels: {
        attr: {
          fill: theme.yLabels,
        },
      }
    },
    legend: {

    },
    series: [{
      type: 'line',
      data: [
        {
          y: 10,
        },
        {
          y: 80,
        },
        {
          y: 23,
        },
        {
          y: 127,
        },
        {
          y: 3,
        },
        {
          y: 45,
        }
      ]
    }],
  };
}