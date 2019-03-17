/**
 * @description Default model of Chartic API.
 * Here we define all properties we have for safe getting after merging with user config.
 *
 * @type {{
 *  chart: {
 *   width: number,
 *   height: number,
 *   renderTo: string | HTMLElement,
 *  },
 *  title: {
 *   enabled: boolean,
 *   x: number,
 *   y: number,
 *   text: string,
 *   backgroundColor: string,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number,
 *   },
 *   attr: {
 *    fill: string,
 *    textAnchor: 'start' | 'middle' | 'end',
 *    dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *   },
 *   style: {
 *    fontSize: number
 *    fontWeight: number | string,
 *   },
 *  },
 *  xAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  yAxis: {
 *   enabled: boolean,
 *   ticksAmount: number,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   gridLine: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   line: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *    style: {
 *
 *    }
 *   },
 *   labels: {
 *    enabled: boolean,
 *    x: number,
 *    y: number,
 *    formatter(step: number, index: number, config: object): (number | string | Node),
 *    spacing: {
 *     top: number,
 *     left: number,
 *     right: number,
 *     bottom: number
 *    },
 *    attr: {
 *     fill: string,
 *     textAnchor: 'start' | 'middle' | 'end',
 *     dominantBaseline: 'hanging' | 'middle' | 'baseline',
 *    },
 *    style: {
 *     fontSize: number,
 *     fontWeight: number | string,
 *    },
 *   }
 *  },
 *  legend: {
 *   enabled: boolean,
 *  },
 *  selectArea: {
 *   type: 'x',
 *   selectAttr: {
 *    fill: string,
 *    stroke: string,
 *   },
 *   bgAttr: {
 *    fill: string,
 *   },
 *   ranges: {
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   },
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   onSelect(min: number, max: number, config: object): void,
 *  },
 *  series: {
 *   type: 'line',
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   data: {
 *    x: number,
 *    y: number,
 *    info: object,
 *    attr: {
 *     stroke: string,
 *     strokeWidth: number,
 *     strokeDasharray: string,
 *    },
 *   }[],
 *  }[],
 * }}
 */
var chartDefaults = {
  chart: {
    width: 0,
    height: 0,
    renderTo: null,
  },
  title: {
    enabled: true,
    x: 0,
    y: 0,
    text: 'Chart title',
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
    enabled: true,
    ticksAmount: 6,
    spacing: {
      top: 0,
      left: 30,
      right: 30,
      bottom: 50,
    },
    gridLine: {
      enabled: false,
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
      enabled: true,
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
      enabled: true,
      x: 0,
      y: 0,
      formatter: function(step, index, config) {
        return step;
      },
      spacing: {
        top: 0,
        left: 0,
        right: 0,
        bottom: -25,
      },
      attr: {
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      },
      style: {
        color: 'grey',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
  },
  yAxis: {
    enabled: true,
    ticksAmount: 6,
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 50,
    },
    gridLine: {
      enabled: true,
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
      enabled: true,
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
      enabled: true,
      x: 0,
      y: 0,
      formatter: function(step, index, config) {
        return step;
      },
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
  legend: {
    enabled: true,
  },
  selectArea: {
    type: '',
    selectAttr: {
      fill: 'rgba(0,0,0,.5)',
    },
    bgAttr: {
      fill: 'rgba(0,0,0,.2)',
    },
    ranges: {
      x1: .1,
      y1: 0,
      x2: .9,
      y2: 1,
    },
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 50,
    },
    onSelect: function () {}
  },
  series: [{
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 50,
    },
  }],
};