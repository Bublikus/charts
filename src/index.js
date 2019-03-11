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

  return {
    chart: {
      renderTo: document.getElementById('chart'),
    },
    title: {
      text: 'Followers'
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