/**
 * @description Default model of Chartic API.
 *
 * @type {{
 * chart: {
 *  width: number,
 *  height: number,
 *  renderTo: string | HTMLElement,
 * },
 * title: {
 *  x: number,
 *  y: number,
 *  text: string,
 *  backgroundColor: string,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number,
 *  },
 *  attr: {
 *   fill: string,
 *   textAnchor: 'start' | 'middle' | 'end',
 *   dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *  },
 *  style: {
 *   fontSize: number
 *   fontWeight: number | string,
 *  },
 * },
 * xAxis: {
 *  ticksAmount: number,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  gridLine: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   }
 *  },
 *  line: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   }
 *  },
 *  labels: {
 *   x: number,
 *   y: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number,
 *    fontWeight: number | string,
 *   },
 *  }
 * },
 * yAxis: {
 *  ticksAmount: number,
 *  spacing: {
 *   top: number,
 *   left: number,
 *   right: number,
 *   bottom: number
 *  },
 *  gridLine: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   }
 *  },
 *  line: {
 *   x: number,
 *   y: number,
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   style: {
 *
 *   }
 *  },
 *  labels: {
 *   x: number,
 *   y: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number,
 *    fontWeight: number | string,
 *   },
 *  }
 * },
 * legend: {
 *
 * },
 * series: [
 *   {
 *     x: number,
 *     y: number,
 *   }
 * ],
 * }}
 */
const chartDefaults = {
  chart: {
    width: 0,
    height: 0,
    renderTo: null,
  },
  title: {
    x: 0,
    y: 0,
    text: '',
    backgroundColor: 'transparent',
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 15,
    },
    attr: {
      textAnchor: 'middle',
      dominantBaseline: 'middle',
    },
    style: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    }
  },
  xAxis: {
    ticksAmount: 6,
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 15,
    },
    gridLine: {
      x: 0,
      y: 0,
      attr: {
        stroke: 'grey',
        strokeWidth: 1,
        strokeDasharray: '',
      },
      style: {

      },
    },
    line: {
      x: 0,
      y: 0,
      attr: {
        stroke: 'grey',
        strokeWidth: 1,
        strokeDasharray: '',
      },
      style: {

      },
    },
    labels: {
      x: 0,
      y: 0,
      spacing: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      attr: {
        textAnchor: 'start',
        dominantBaseline: 'baseline',
      },
      style: {
        color: 'grey',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
  },
  yAxis: {
    ticksAmount: 6,
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 15,
    },
    gridLine: {
      x: 0,
      y: 0,
      attr: {
        stroke: 'grey',
        strokeWidth: 1,
        strokeDasharray: '',
      },
      style: {

      },
    },
    line: {
      x: 0,
      y: 0,
      attr: {
        stroke: 'grey',
        strokeWidth: 1,
        strokeDasharray: '',
      },
      style: {

      },
    },
    labels: {
      x: 0,
      y: 0,
      spacing: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      attr: {
        textAnchor: 'start',
        dominantBaseline: 'baseline',
      },
      style: {
        color: 'grey',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
  },
  legend: {},
  series: [],
};