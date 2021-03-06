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
  rootContainer.style.backgroundColor = store.theme.styles.mainBackground;

  eventAggregator.subscribe('theme', function (theme) {
    rootContainer.style.backgroundColor = theme.styles.mainBackground;
  });

  var mainChartContainer = createElement('div', { id: 'mainChart' });
  var subChartContainer = createElement('div', { id: 'subChart' });
  var mainContainer = createElement('div',{ className: 'main-container' }, [
    mainChartContainer,
    subChartContainer,
  ]);

  var switchButton = createElement('button',
    {
      type: 'button',
      id: 'switch-button',
      onclick: function () {
        onSwitchTheme();
      },
    },
    store.theme.themeKey === 'day' ? 'Switch to Night Mode' : 'Switch to Day Mode',
  );
  var switchButtonContainer = createElement('div',{ className: 'switch-button-container' }, switchButton);

  // Subscribe on theme change.
  eventAggregator.subscribe('theme', function (theme) {
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

  eventAggregator.dispatch('theme', newTheme);
}
