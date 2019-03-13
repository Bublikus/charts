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
 *        align: 'start' | 'middle' | 'end',
 *        verticalAlign: 'hanging' | 'middle' | 'baseline',
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
    style: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    }
  },
  xAxis: {
    line: {
      color: 'grey',
      width: 1,
      y: -30,
    },
    labels: {
      y: -10,
      color: 'grey',
      fontSize: 16,
      fontWeight: 'normal',
      align: 'start',
      verticalAlign: 'baseline',
    }
  },
  yAxis: {
    line: {
      y: 30,
      color: 'grey',
      width: 1,
    },
    labels: {
      y: 15,
      color: 'grey',
      fontSize: 16,
      fontWeight: 'normal',
      verticalAlign: 'bottoms',
    }
  },
  legend: {},
};