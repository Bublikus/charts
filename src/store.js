/**
 * @description Default values of the app store.
 *
 * @type {{
 *  theme: {
 *   themeKey: 'day' | 'night',
 *   styles: {
 *    mainFont: string,
 *    xAxisLine: string,
 *    xLabels: string,
 *    mainBackground: string,
 *    selectFrameOutOverlay: string,
 *    xCursorLine: string,
 *    selectFrameBorders: string,
 *    yAxisLine: string,
 *    line2: string,
 *    yCursorLine: string,
 *    line1: string,
 *    yLabels: string,
 *   },
 *  },
 *
 *  selectRanges: {
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 *  },
 *
 *  legend: {
 *   [name]: boolean,
 *  },
 * }}
 */
var store = {
  theme: {
    themeKey: 'night',
    styles: themeNight,
  },
  selectRanges: {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: 1,
  },
  legend: {

  },
};