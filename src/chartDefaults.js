/**
 * @description Default model of Chartic API.
 * Here we define all properties we have for safe getting after merging with user config.
 *
 * @type {{
 *  chart: {
 *   width: number,
 *   height: number,
 *   renderTo: string | HTMLElement,
 *   animationDuration: number,
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
 *   type: 'x' | 'y' | 'xy',
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
 *   onSelect({
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   }, config: object): {
 *    x1: number,
 *    y1: number,
 *    x2: number,
 *    y2: number,
 *   },
 *  },
 *  series: {
 *   type: 'line',
 *   name: string,
 *   spacing: {
 *    top: number,
 *    left: number,
 *    right: number,
 *    bottom: number
 *   },
 *   attr: {
 *    stroke: string,
 *    strokeWidth: number,
 *    strokeDasharray: string,
 *   },
 *   data: {
 *    x: number,
 *    y: number,
 *    info: object,
 *   }[],
 *  }[],
 * }}
 */
var chartDefaults = {
  chart: {
    width: 0,
    height: 0,
    renderTo: null,
    animationDuration: 150,
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
    spacing: {
      top: 20,
      left: 30,
      right: 30,
      bottom: 20,
    }
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
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
    },
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 50,
    },
    onSelect: function (coords) {
      return coords;
    },
  },
  series: [{
    name: '',
    spacing: {
      top: 15,
      left: 30,
      right: 30,
      bottom: 50,
    },
    attr: {
      strokeWidth: 2,
      fill: 'transparent',
    },
  }],
};