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
 *    chart: {{
 *      renderTo: string | HTMLElement,
 *      width: number,
 *      height: number,
 *    }}
 *    title: {{
 *      text: string,
 *      align: 'left' | 'center' | 'right',
 *      verticalAlign: 'top' | 'center' | 'bottom',
 *      width: number,
 *      height: number,
 *      x: number,
 *      y: number,
 *      backgroundColor: string,
 *      style: {
 *        color: string,
 *        fontSize: number,
 *        fontWeight: number | string,
 *      },
 *    }},
 *    xAxis: {
 *      line: {
 *        x: number,
 *        y: number,
 *        width: number,
 *        height: number,
 *        color: string,
 *      },
 *      labels: {
 *        x: number,
 *        y: number,
 *        color: string,
 *        fontSize: number,
 *        fontWeight: number | string,
 *        align: 'left' | 'center' | 'right',
 *        verticalAlign: 'top' | 'center' | 'bottom',
 *      }
 *    },
 *    yAxis: {
 *      line: {
 *        x: number,
 *        y: number,
 *        width: number,
 *        height: number,
 *        color: string,
 *      },
 *      labels: {
 *        x: number,
 *        y: number,
 *        color: string,
 *        fontSize: number,
 *        fontWeight: number | string,
 *        align: 'left' | 'center' | 'right',
 *        verticalAlign: 'top' | 'center' | 'bottom',
 *      }
 *    },
 *    legend: {},
 *    series: {
 *      type: 'line',
 *      data: {
 *        x: number,
 *        y: number,
 *      }[],
 *    }[],
 *  }}
 */
function transformChartDataToConfig(chartsData) {
  var theme = store.theme.styles;

  return {
    chart: {
      renderTo: document.getElementById('mainChart'),
    },
    title: {
      text: 'Followers',
      align: 'left',
      verticalAlign: 'bottom',
      height: 50,
      x: 20,
      style: {
        color: theme.mainFont,
      },
    },
    xAxis: {
      line: {
        color: theme.xLines,
        width: -15,
      },
      labels: {
        color: theme.xLabels,
        fontSize: 14,
      }
    },
    yAxis: {
      line: {
        x: 15,
        color: 'transparent',
      },
      labels: {
        color: theme.yLabels,
        fontSize: 14,
        height: -5,
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