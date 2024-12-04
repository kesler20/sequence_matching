/**
 * ### The trace object can be used as an interface to create Plotly traces
 * this can be done by chaining functions such as the following to write plotly objects
 * ```javascript
 * // initialise trace builder
 * const traceBuilder = new TraceBuilder("scatter","trace name")
 *
 * // add desired features
 * traceBuilder
 *   .addLineMode()
 *   .addLine()
 *   .addDottedLine()
 *
 * // build trace (return the final object)
 * const trace = traceBuilder.buildTrace()
 *
 * ```
 * this should return
 * ```javascript
 * {
 *   name : name;
 *   type : type;
 *   mode : "lines";
 *   x : [];
 *   y : [];
 *   z : [];
 *   line : {
 *    dash: "dashdot",
 *    width : "5",
 *  }
 * }
 * ```
 * In the same way that tailwind gives you the granularity to control css this
 * builder should give you enough granularity to construct traces in any possible way
 */
export default class TraceBuilder {
  trace: {
    type: string;
    name?: string;
    mode?: string;
    fill?: string;
    line?: any;
    x?: any[];
    y?: any[];
    z?: any[];
    marker?: any;
    orientation?: string;
    opacity?: number;
    error_y?: any;
    error_x?: any;
    values?: any;
    labels?: any;
    domain?: any;
    boxpoints?: any;
    jitter?: any;
    pointpos?: any;
    text?: any;
    textposition?: any;
    textinfo?: any;
    insidetextorientation?: any;
    hoverinfo?: any;
    showLegend?: any;
    colorscale?: any;
    contours?: any;
    ncontours?: any;
    reversescale?: any;
  };

  /**
   * the default trace that will be built is:
   * ```javascript
   * {
   *   name : name,
   *   type : type
   * }
   * ```
   * @param {*} type - this can be one from
   * @param {*} name - the name of the trace
   *
   * @returns this
   */
  constructor(type: string, name?: string) {
    this.trace = { type };
    if (name !== undefined) {
      this.trace.name = name;
    }
  }

  /**
   * add the property of mode to the trace, the default is markers
   * @param {*} mode - this can be "lines" "lines+markers" or "markers"
   * @returns this
   */
  addMode = (mode: string) => {
    this.trace.mode = mode;
    return this;
  };

  /**
   * add property fill ``fill : mode``
   * @param {*} mode - this can be tonexity/ tozeroy
   * @returns this
   */
  addFill = (fillType: string) => {
    if (!fillType) {
      fillType = "tonexity";
    }

    this.trace.fill = fillType;
    return this;
  };

  /**
   * add line
   * ```javascript
   * line {
   *   dash : 'solid',
   *   width : '5',
   * }
   * ```
   * @returns this
   *
   */
  addLine = () => {
    this.trace.line = {
      dash: "solid",
      width: "2",
    };
    return this;
  };

  /**
   * if y add ``y : y``
   * if x add ``x : x``
   * if z add ``z : z``
   * for heatmaps contours and surfaces this.trace can be an array of arrays
   * @param {*} axis - this is the desired axes as a string
   * @param {*} axisData - this is an array, or else can be an array of arrays
   * @returns this
   */
  addAxis = (axis: string, axisData: any[]) => {
    if (axis === "z") {
      this.trace.z = axisData;
    } else if (axis === "y") {
      this.trace.y = axisData;
    } else if (axis === "x") {
      this.trace.x = axisData;
    } else {
      console.log(axis);
    }
    return this;
  };

  /**
   * add a dotted line
   * ```javascript
   * line {
   *   ...line,
   *   dash: "dashdot",
   *   width: "5"
   * }
   * ```
   * @returns this
   *
   */
  addDottedLine = () => {
    this.trace.line = {
      ...this.trace.line,
      dash: "dashdot",
    };
    return this;
  };

  /**
   * add line to the current marker object
   * ```
   * marker {
   *   ...marker,
   *   line {
   *    width : "5"
   *  }
   * }
   * ```
   * @returns this
   *
   */
  addMarkerLine = () => {
    this.trace.marker = {
      ...this.trace.marker,
      line: {
        color: "white",
        width: "1",
      },
    };
    return this;
  };

  /**
   * this.trace sets the orientation ``orientation : 'h'`` and ``orientation : 'v'``
   * @returns this
   */
  addOrientation = (orientation: string) => {
    this.trace.orientation = orientation;
    return this;
  };

  /**
   * add scales to color intensity ``showscale : true``
   * @returns this
   */
  addColorScale = () => {
    this.trace.marker.showscale = true;
    return this;
  };

  /**
   * add opacity to the trace ``opacity : opacity``
   * @param {*} opacity - this is a number from 0 to 1
   * @returns this
   */
  addOpacity = (opacity: number) => {
    this.trace.opacity = opacity;
    return this;
  };

  /**
   * add a marker from scratch
   * ```javascript
   * marker {
   *   opacity : 0.8,
   *   symbol : "circle"
   * }
   * ```
   * @param {*} symbol - this can be a circle, square, triangle etc..
   * @returns this
   */
  addMarker = (symbol?: string) => {
    symbol = symbol === undefined ? "circle" : symbol;
    this.trace.marker = {
      color: "rgb(123,199,253)",
      opacity: 0.7,
      size: 14,
      symbol,
    };
    return this;
  };

  /**
   * adds ``marker : { size : [...size] }``
   * @param {*} size - an array of numbers used for the size dimension
   * @returns
   */
  addMarkerSize = (size: any) => {
    this.trace.marker = {
      ...this.trace.marker,
      size,
    };
    return this;
  };

  /**
   * the types of plots that can be made include:
   * - scatter,
   * - scattergl,
   * - scatter3d,
   * - box,
   * - pie,
   * - heatmap,
   * - bar,
   * - surface,
   * - histogram2dcontour,
   * - contour,
   * - sunburst,
   * - pointcloud,
   * - sankey
   *
   * @param {*} type - this is the type of the plot
   * @returns this
   */
  addPlotType = (type: string) => {
    this.trace.type = type;
    return this;
  };

  /**
   * this.trace is used to resize the markers
   * @param {*} size - this is an array of sizes
   * @returns this
   */
  addRelativeSizeToMarkers = (size: number[]) => {
    const desired_maximum_marker_size = 65;
    this.trace.marker = {
      ...this.trace.marker,
      opacity: 0.6,
      size,
      sizeref: (2.0 * Math.max(...size)) / desired_maximum_marker_size ** 2,
      sizemode: "area",
    };
    return this;
  };

  /**
   * this.trace can be used for scatter and line plots
   * @param {*} type - this can be "percent", "data"
   * @param {*} direction - this cna be x or y and this.trace sets the direction
   * of the error bar to be horizontal or vertical
   * @param {*} value - this is a number which goes from 1 to 10, preferably set at 5
   * @returns this
   */
  addErrorBars = (type: string, direction: string, value: number) => {
    let data = {
      type,
      visible: true,
      value,
      color: "#85144B",
      thickness: 1.5,
      width: 3,
      opacity: 1,
    };
    if (direction === "y") {
      this.trace.error_y = data;
    } else {
      this.trace.error_x = data;
    }

    return this;
  };

  /**
   * ```ts
   * this.trace.line = {
   * ...this.trace.line,
   *    color,
   * };
   * ```
   * @param color
   */
  addColorToLine = (color: string) => {
    this.trace.line = {
      ...this.trace.line,
      color,
    };
    return this;
  };

  /**
   * ```ts
   * this.trace = {
   * ...this.trace,
   *    color,
   * };
   * ```
   * @param color
   */
  addColorToMarker = (color: string) => {
    this.trace.marker = {
      ...this.trace.marker,
      color,
    };
    return this;
  };

  /**
   * this.trace can be usd for pie charts and sunbursts diagrams
   * @param {*} values - this is an array of numbers
   * @returns this
   */
  addValues = (values: number[]) => {
    this.trace.values = values;
    return this;
  };

  /**
   * this.trace can be used for pie charts
   * @param {*} labels - this is an array of strings.
   * @returns this
   */
  addLabels = (labels: string[]) => {
    this.trace.labels = labels;
    return this;
  };

  /**
   * this.trace cna be used for organizing multiple pie
   * charts into rows and columns
   * @param {*} row - this is a number such as 0 or 1
   * @param {*} column - this is a number such as 0 or 1
   * @returns this
   */
  addDomain = (row: number, column: number) => {
    this.trace.domain = {
      row: row,
      column: column,
    };
    return this;
  };

  /**
   * this.trace cna be used for box plots by using ``boxpoint : "suspectedoutliers"`` which displays only the outlier
   * @returns this
   */
  addOutlierDetection = () => {
    this.trace.marker = {
      ...this.trace.marker,
      color: "rgb(8,81,156)",
      outliercolor: "rgba(219, 64, 82, 0.6)",
      line: {
        outliercolor: "rgba(219, 64, 82, 1.0)",
        outlierwidth: 2,
      },
    };
    return this;
  };

  /**
   * if a type of box is set this.trace can be used to also display the underlying data
   * @returns this
   */
  addUnderlyingData = () => {
    this.trace.marker = { ...this.trace.marker, size: 6 };
    this.trace.boxpoints = "all";
    this.trace.jitter = 0.3;
    this.trace.pointpos = -1.8;
    return this;
  };

  /**
   * Boxpoints determines the type of underlying data with the box plot
   *
   *  - boxpoints to "all" - this is used to display all the underlying data
   *  - boxpoints to false - this is used to only display the whiskers
   *  - boxpoints to "suspectedoutliers" - this is used to only display the outlier
   * @param {*} boxpoints - this cna be suspectedoutliers, false or all
   * @returns this
   */
  addBoxPoints = (boxpoints: any) => {
    this.trace.boxpoints = boxpoints;
    return this;
  };

  /**
   * this.trace is the text displayed on hover
   * @param {*} text - this is an array of strings, you cna break into the next line by using the </br> tag
   * @returns this
   */
  addText = (text: string[]) => {
    this.trace.text = text;
    this.trace.textposition = "auto";
    this.trace.textinfo = "none";
    this.trace.insidetextorientation = this.trace.type === "pie" ? "radial" : ""; // this.trace is good for the pie charts
    return this;
  };

  /**
   * this.trace is used to change the hoverinfo
   * @param {*} hoverinfo - the hoverinfo can be "label+percent+name" or "none"
   * @returns this
   */
  addHoverInfo = (hoverinfo: string) => {
    this.trace.hoverinfo = hoverinfo;
    return this;
  };

  /**
   * this.trace sets the legend to false ``showLegend : false``
   * @returns this
   */
  removeLegend = () => {
    this.trace.showLegend = false;
    return this;
  };

  /**
   * this will add an extra dimension to your scatter plot by adding a color to your marker
   * ```javascript
   * marker : {
   *   color : [color]
   * }
   * ```
   * @param {*} color - this is an array which can be used as an extra dimension
   * @returns this
   */
  addColor = (colorData: number[], colorName: string) => {
    this.trace.marker = {
      ...this.trace.marker,
      color: colorData,
      colorbar: {
        title: {
          text: colorName,
        },
        tickfont: {
          size: 16,
        },
      },
    };
    return this;
  };

  /**
   * this.trace can be used to style the colour scale of a colour gradient which cna be introduced by
   * creating a marker with a colour array corresponding to the desired data
   * @param {*} colorscale - this can be "Jet", "Hot", "Viridis"
   * @returns this
   */
  changeColorScale = (colorscale: string) => {
    this.trace.marker = {
      ...this.trace.marker,
      colorscale,
    };
    return this;
  };

  /**
   * this.trace will set a custom colorscale for color gradients
   * @returns this
   */
  addCustomColorScale = () => {
    this.trace.colorscale = [
      [0, "rgb(166,206,227)"],
      [0.25, "rgb(31,120,180)"],
      [0.45, "rgb(178,223,138)"],
      [0.65, "rgb(51,160,44)"],
      [0.85, "rgb(251,154,153)"],
      [1, "rgb(227,26,28)"],
    ];
    return this;
  };
  /**
   * this.trace is for adding a normal contour when you have type contours
   * @param {*} coloring - this can be heating or lines for the contours
   * @param {*} showlabels - this is a boolean whicch dictates whether to show the labels on the contour
   * @returns this
   */
  addContours = (coloring: any, showlabels: any) => {
    this.trace.contours = {
      coloring,
      showlabels,
      labelfont: {
        family: "Raleway",
        size: 12,
        color: "white",
      },
    };
    this.trace.ncontours = 20;
    return this;
  };

  /**
   * this.trace works when the plot is of the type histogram2dcontour
   * make sure that the trace has x and y axis
   * @returns this
   */
  addStyledContours = () => {
    this.trace.colorscale = "Hot";
    this.trace.ncontours = 20;
    this.trace.reversescale = true;
    return this;
  };

  /**
   * this.trace can be used when an existing trace has to be extended
   * @param {*} trace - this is an existing trace object
   * @returns this
   */
  addTraceData = (trace: any) => {
    this.trace = trace;
    return this;
  };

  /**
   * This.trace function should be called at the end of the build to instatiate the final trace
   * ```javascript
   * const trace = traceBuilder.buildTrace()
   * ```
   * @returns this;
   */
  buildTrace = (): any => {
    return this.trace;
  };
}

// TODO: make a defualt lineWidth variable which the user will be able to change
// TODO: make a default opacity and marker size fgor the user to choose two
// implement webgl scattergl when the data exceeds a certain range
