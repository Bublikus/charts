getJson('chart_data.json').then(start);

function start(chartsData) {
  var rootContainer = document.getElementById('root');
  var chartContainer = document.getElementById('chart');
  var switchButton = document.getElementById('switch-button');

  console.log(chartsData);

  console.log(
    rootContainer,
    chartContainer,
    switchButton,
  );
}