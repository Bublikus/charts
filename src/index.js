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
 *    yAxis: {}[],
 *    xAxis: {}[],
 *    legend: {},
 *    series: {}[],
 *    title: {text: string},
 *    chart: {renderTo: HTMLElement}
 *  }}
 */
function transformChartDataToConfig(chartsData) {
  var theme = store.theme.styles;

  return {
    chart: {
      renderTo: document.getElementById('chart'),
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
    xAxis: [{

    }],
    yAxis: [{

    }],
    legend: {

    },
    series: [{

    }],
  };
}