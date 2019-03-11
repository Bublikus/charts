getJson('chart_data.json').then(start);

function start(chartsData) {
  makeContainers();

  console.log(chartsData)
}