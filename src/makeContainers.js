/**
 * @description Make containers for chart and switch theme button.
 *
 * @function makeContainers
 *
 * @return void
 */
function makeContainers() {
  // Get root container
  var rootContainer = document.getElementById('root');

  var chartContainer = createElement(
    'div',
    { id: 'chart' },
  );
  var mainContainer = createElement(
    'div',
    { className: 'main-container' },
    chartContainer,
  );

  var switchButton = createElement(
    'button',
    {
      type: 'button',
      id: 'switch-button',
      onclick: function () {
        onSwitchTheme();
      },
    },
    store.theme === 'day' ? 'Switch to Night Mode' : 'Switch to Day Mode',
  )
  var switchButtonContainer = createElement(
    'div',
    { className: 'switch-button-container' },
    switchButton,
  )

  // Subscribe on theme change.
  eventAggregator.subscribe('switchTheme', function (theme) {
    switchButton.innerText = theme === 'day'
      ? 'Switch to Night Mode'
      : 'Switch to Day Mode';

    store.theme = store.theme === 'day' ? 'night' : 'day';
  });

  rootContainer.appendChild(mainContainer)
  rootContainer.appendChild(switchButtonContainer)
}

/**
 * @description Switching themes of charts.
 *
 * @function onSwitchTheme
 *
 * @param theme?: 'day' | 'night'
 *
 * @return void
 */
function onSwitchTheme(theme) {
  eventAggregator.dispatch('switchTheme', theme || (store.theme === 'day' ? 'night' : 'day'));
}
