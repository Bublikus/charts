/**
 *  {{
 *    chart: {{
 *      renderTo: string | HTMLElement,
 *      width: number,
 *      height: number,
 *    }}
 *    title: {{
 *      text: string,
 *      align: 'start' | 'middle' | 'end',
 *      verticalAlign: 'hanging' | 'middle' | 'baseline',
 *      width: number,
 *      height: number,
 *      x: number,
 *      y: number,
 *      backgroundColor: string,
 *      spacing: {
 *        top: number,
 *        left: number,
 *        right: number,
 *        bottom: number,
 *      },
 *      style: {
 *        color: string,
 *        fontSize: number,
 *        fontWeight: number | string,
 *      },
 *    }},
 *    xAxis: {
 *      spacing: {
 *        top: number,
 *        left: number,
 *        right: number,
 *        bottom: number,
 *      },
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
 *        align: 'start' | 'middle' | 'end',
 *        verticalAlign: 'hanging' | 'middle' | 'baseline',
 *      }
 *    },
 *    yAxis: {
 *      spacing: {
 *        top: number,
 *        left: number,
 *        right: number,
 *        bottom: number,
 *      },
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
 *        align: 'start' | 'middle' | 'end',
 *        verticalAlign: 'hanging' | 'middle' | 'baseline',
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
const chartDefaults = {
  chart: {},
  title: {
    align: 'middle',
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    spacing: {
      top: 5,
      left: 15,
      right: 15,
      bottom: 5,
    },
    style: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    }
  },
  xAxis: {
    spacing: {
      left: 15,
      right: 15,
      bottom: 30,
    },
    line: {
      color: 'grey',
      width: 1,
    },
    labels: {
      align: 'start',
      verticalAlign: 'baseline',
      style: {
        color: 'grey',
        fontSize: 16,
        fontWeight: 'normal',
      },
    }
  },
  yAxis: {
    spacing: {
      top: 5,
      left: 15,
      bottom: 30,
    },
    line: {
      color: 'grey',
      width: 1,
    },
    labels: {
      y: 5,
      verticalAlign: 'middle',
      style: {
        color: 'grey',
        fontSize: 16,
        fontWeight: 'normal',
      },
    }
  },
  legend: {},
};