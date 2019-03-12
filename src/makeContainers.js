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

  eventAggregator.subscribe('switchTheme', function (theme) {
    rootContainer.style.backgroundColor = theme.styles.mainBackground;
  });

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
    store.theme.themeKey === 'day' ? 'Switch to Night Mode' : 'Switch to Day Mode',
  );
  var switchButtonContainer = createElement(
    'div',
    { className: 'switch-button-container' },
    switchButton,
  );

  // Subscribe on theme change.
  eventAggregator.subscribe('switchTheme', function (theme) {
    switchButton.innerText = theme.themeKey === 'day'
      ? 'Switch to Night Mode'
      : 'Switch to Day Mode';
  });

  rootContainer.appendChild(mainContainer);
  rootContainer.appendChild(switchButtonContainer);
}

/**
 * @description Switching themes of charts.
 *
 * @function onSwitchTheme
 *
 * @param themeKey?: 'day' | 'night'
 *
 * @return void
 */
function onSwitchTheme(themeKey) {
  var newThemeKey = themeKey || (store.theme.themeKey === 'day' ? 'night' : 'day');
  var newThemeStyles = newThemeKey === 'day' ? themeDay : themeNight;

  var newTheme = {
    themeKey: newThemeKey,
    styles: newThemeStyles,
  };

  store.theme = newTheme;

  eventAggregator.dispatch('switchTheme', newTheme);
}
