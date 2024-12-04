import TraceBuilder from "./plotly/TraceBuilder";
import LayoutBuilder from "./plotly/LayoutBuilder";
import { primaryColor } from "../global_styles/colorPalette";

/**
 * This class represents a PlotBuilder interface for the Plotly Library.
 * It provides methods for constructing and updating plots using Plotly.
 *
 * Example usage:
 *
 * ```ts
 * useEffect(() => {
 *   const plot = plotData();
 *   if (sensorValues.Timestamp !== undefined) {
 *     plot.updateInitialPlot([[sensorValues.Value]], [[sensorValues.Timestamp/1600000000]], [0, 3]);
 *   }
 * }, [sensorValues]);
 *
 * const plotData = () => {
 *   const plot = plotBuilder
 *     .addPlotTitle(Array.from(sensors as any[])[0].name)
 *     .addTrace("marker", "sensor")
 *     .addAxisDimension("x", [0], "Time", 0)
 *     .addAxisDimension("y", [0], "Value", 0);
 *   plot.constructInitialPlot();
 *   return plot;
 * };
 * ```
 *
 * @param canvasID - The ID of the div where the plot will be generated.
 * @param plotly - The Plotly object from the window.
 *
 * Properties:
 * - fontColor: Changes the font color of the title and y/x axis labels.
 * - plotColor: Changes the color of the paper and the plot.
 * - gridColor: Changes the color of the grid within the plot.
 */
export default class PlotBuilder {
  canvasID: string;
  plotly: any;
  plotData: any[];
  layout: any;
  config: any;

  /**
   * Constructs a new PlotBuilder instance.
   * An example of constructing a barChart and a line chart
   *
   *
   * ```ts
   * import PlotBuilder from "apis"
   * import * as React from "react"
   *
   * const plotBuilder = new PlotBuilder("1")
   *
   * const plot = plotBuilder
   *  .addPlotTitle("Test title")
   *  .addTrace("marker", "sensor")
   *  .addAxisDimension("x", x, "Time", 0)
   *  .addAxisDimension("y", y, "Value", 0)
   *  .addDarkMode()
   *  .addBarChart(0)
   *  .addTrace("marker", "sensor2")
   *  .addAxisDimension("x", x, "Time", 1)
   *  .addAxisDimension("y", y, "Value", 1)
   *  .addLinePlot(1)
   *  .addColorToLine("rgb(128,252,254)",1)
   *  .removeModeBar()
   *  .buildPlot();
   *
   * const App = () => {
   *
   *    //build the plot from a useEffect
   *    // this is because the plot looks for the div with id 1 onMount
   *    React.useEffect(() => {
   *      plot.constructInitialPlot();
   *    }, [])
   *
   *    return <div id="1" >
   * }
   * ```
   *
   * @param canvasID - The ID of the div where the plot will be generated.
   */
  constructor(canvasID: string) {
    this.canvasID = canvasID;
    const Window: any = window;
    this.plotly = Window.Plotly;

    this.plotData = []; // Collection of traces
    this.layout = {};
    this.config = {
      responsive: true,
      editable: true,
      displaylogo: false,
      displayModeBar: true,
      scrollZoom: false,
      showLink: false,
      linkText: "This text is custom!",
      plotlyServerURL: "https://chart-studio.plotly.com",
    };
  }

  buildPlot() {
    return this;
  }

  addYAxisRange(range: any) {
    this.layout.yaxis = { ...this.layout.yaxis, range };
    return this;
  }

  getRandomData(numPoints: number) {
    // Generate random data
    const x: number[] = [];
    const y: number[] = [];

    for (let i = 0; i < numPoints; i++) {
      x.push(i);
      y.push(Math.random());
    }
    return { x, y };
  }

  addXAxisRange(range: any) {
    this.layout.xaxis = { ...this.layout.xaxis, range };
    return this;
  }

  // the trace removal function should keep the traceIDs as they are
  addTrace(type: string, name: string) {
    const traceBuilder = new TraceBuilder(type, name);
    traceBuilder.addMode("markers");
    const trace = traceBuilder.buildTrace();
    this.plotData.push(trace);
    return this;
  }

  removeTrace(traceID: number) {
    this.plotData = this.plotData.filter((trace, index) => index == traceID);
    return this;
  }

  addPlotTitle(title: string) {
    const layoutBuilder = new LayoutBuilder(title);
    layoutBuilder.addLayoutData(this.layout);
    layoutBuilder.addTitle(title);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addZoomScroll() {
    this.config.scrollZoom = true;
    return this;
  }

  removeZoomScroll() {
    this.config.scrollZoom = false;
    return this;
  }

  // this function can be passed to the layout builder
  removeLegends() {
    this.layout = { ...this.layout, showlegend: false };
    return this;
  }

  addLegends() {
    this.layout = { ...this.layout, showlegend: true };
    return this;
  }

  removeAllAxis() {
    const layoutBuilder = new LayoutBuilder("title");
    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .removeZeroLine("x")
      .removeZeroLine("y")
      .buildLayout();
    return this;
  }

  importTrace(trace: any, traceID: number) {
    if (this.plotData.length === 0) {
      this.plotData = [trace];
    } else {
      this.plotData.splice(traceID, 0, trace);
    }
    return this;
  }

  importLayout(layout: any) {
    this.layout = layout;
    return this;
  }

  addAxis(axis: string, label: string) {
    let layoutBuilder = new LayoutBuilder("title");
    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .addAxis(axis, label)
      .buildLayout();
    return this;
  }

  /**
   * this function can be called like a plot
   * which means that it can be called after setting the x and y axis and by passing the traceID
   * the function ll set x -> labels, y -> values
   * @param {*} traceID
   * @returns
   */
  addLabelsAndValues(traceID: number) {
    let trace = this.plotData[traceID];
    let traceBuilder = new TraceBuilder("scatter");

    traceBuilder
      .addTraceData(trace)
      .addLabels(traceBuilder.buildTrace().x)
      .addValues(traceBuilder.buildTrace().y);

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addArrayData(traceID: number) {
    let trace = this.plotData[traceID];
    let traceBuilder = new TraceBuilder("scatter");

    traceBuilder.addTraceData(trace).trace.z = [traceBuilder.buildTrace().z];

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addAxisDimension(axis: string, data: any[], label: string, traceID: number) {
    // get the desired trace to add dimensions to
    let trace = this.plotData[traceID];

    // initialize a builder for trace and layout and pass it the current data
    // then add the axis, data and the label
    const traceBuilder = new TraceBuilder("scatter");
    const layoutBuilder = new LayoutBuilder("Default Title");
    traceBuilder.addTraceData(trace).addAxis(axis, data);
    layoutBuilder.addLayoutData(this.layout).addAxis(axis, label);

    // style the layout in case of a 3d plot
    if (axis === "z") {
      this.config.scrollZoom = true;
      layoutBuilder.add3DStyles();
    }

    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  changeMarkerSize(size: number) {
    this.layout = { ...this.layout, marker: { size } };
    return this;
  }

  addColorDimension(data: number[], colorDimensionName: string, traceID: number) {
    // assuming that the marker has already being created,
    // and so make sure that no marker has been created after
    let trace = this.plotData[traceID];

    const traceBuilder = new TraceBuilder("scatter");
    traceBuilder
      .addTraceData(trace)
      .addColor(data, colorDimensionName)
      .addColorScale()
      .changeColorScale("Jet");
    return this;
  }

  addSizeDimension(data: number[], traceID: number) {
    // assuming that the marker has already being created,
    // and so make sure that no marker has been created after
    let trace = this.plotData[traceID];

    let traceBuilder = new TraceBuilder("scatter");
    traceBuilder.addTraceData(trace).addRelativeSizeToMarkers(data);
    return this;
  }

  addScatterPlot(traceID: number) {
    // get the desired trace
    let plotType = "scatter";
    let trace = this.plotData[traceID];

    if (trace.x !== undefined && trace.y !== undefined) {
      if (trace.x.length >= 1500 || trace.y.length >= 1500) {
        plotType = "scattergl";
      }
    }

    const traceBuilder = new TraceBuilder(plotType);
    traceBuilder.addTraceData(trace).addPlotType("scatter").addMode("markers");

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addColorToMarker(color: string, traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter");
    traceBuilder.addTraceData(trace).addColorToMarker(color);

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addColorToLine(color: string, traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter");
    traceBuilder.addTraceData(trace).addColorToLine(color);

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addLinePlot(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter");
    traceBuilder
      .addTraceData(trace)
      .addLine()
      .addPlotType("scatter")
      .addMode("lines");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  add3DPlot(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    const traceBuilder = new TraceBuilder("scatter3d");

    traceBuilder.addTraceData(trace).addPlotType("scatter3d").addMode("markers");

    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .removeGrid("x")
      .removeGrid("y")
      .buildLayout();

    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  remove3DStyles() {
    // get the desired trace
    const layoutBuilder = new LayoutBuilder(this.layout.title);

    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .remove3DStyles()
      .buildLayout();

    return this;
  }

  removeGrid() {
    // get the desired trace
    const layoutBuilder = new LayoutBuilder(this.layout.title);

    this.layout = layoutBuilder
      .addLayoutData(this.layout)
      .removeGrid("x")
      .removeGrid("y")
      .buildLayout();

    return this;
  }

  addBoxPlot(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder
      .addTraceData(trace)
      .addPlotType("box")
      .addBoxPoints("all")
      .addUnderlyingData();
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addPieChart(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder
      .addTraceData(trace)
      .addPlotType("pie")
      .addHoverInfo("label+percent+name")
      .addValues(traceBuilder.buildTrace().x)
      .addLabels(traceBuilder.buildTrace().y);
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addHeatmap(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder.addTraceData(trace).addPlotType("heatmap");

    let newTrace = traceBuilder.buildTrace();
    newTrace.colorscale = "Hot";
    this.plotData[traceID] = newTrace;
    return this;
  }

  /**
   * For a bar chart the X need to be the label data and the y the values
   * @param traceID
   * @returns
   */
  addBarChart(traceID: number) {
    // get the desired trace
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("scatter3d");
    traceBuilder.addTraceData(trace).addPlotType("bar");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addSurface(traceID: number) {
    // implement
    // var data = [
    //   {
    //     z: z_data,
    //     type: "surface",
    //   },
    // ];

    // var layout = {
    //   title: "Mt Bruno Elevation",
    //   autosize: false,
    //   width: 500,
    //   height: 500,
    //   margin: {
    //     l: 65,
    //     r: 50,
    //     b: 65,
    //     t: 90,
    //   },
    // };
    let trace = this.plotData[traceID];
    const traceBuilder = new TraceBuilder("surface");
    traceBuilder.addTraceData(trace).addPlotType("surface");
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addHistogram(traceID: number) {
    const traceBuilder = new TraceBuilder("histogram");
    traceBuilder.addTraceData({}).addPlotType("histogram").addOpacity(0.5);
    this.plotData[traceID] = traceBuilder.buildTrace();
    return this;
  }

  addIndicators(
    value: any,
    reference: any,
    size: { width: number; height: number } = { width: 250, height: 250 },
    text: string = "UV Sample"
  ) {
    this.plotData = [
      {
        type: "indicator",
        value,
        delta: { reference },
        gauge: { axis: { visible: false, range: [0, value + 50] } },
        domain: { row: 1, column: 0 },
      },
      {
        type: "indicator",
        mode: "number+delta",
        value,
        domain: { row: 0, column: 0 },
      },
    ];

    this.config = {
      editable: false,
    };

    this.layout = {
      title: "",
      width: size.width,
      height: size.height,
      // t was 25
      margin: { t: 55, b: 25, l: 25, r: 25 },
      grid: { rows: 2, columns: 1, pattern: "independent" },
      template: {
        data: {
          indicator: [
            {
              title: { text },
              mode: "number+delta+gauge",
              delta: { reference },
            },
          ],
        },
      },
    };
    return this;
  }

  addDarkMode() {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    let backgroundColor = primaryColor;
    let paperBgColor = primaryColor;
    let gridColor = "#768db7";
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("rgb(118,141,183)", "Segoe UI, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "y")
      .addZeroLine("y", gridColor)
      .removeZeroLine("x");
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addLightMode() {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    const backgroundColor = "white";
    const paperBgColor = "white";
    const gridColor = "#edf3f4";
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("black", "Segoe UI, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "x")
      .addZeroLine("x", gridColor);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  addModeBar() {
    this.config.displayModeBar = true;
    return this;
  }

  removeModeBar() {
    this.config.displayModeBar = false;
    return this;
  }

  addBackgroundColor(color: string, gridcolor?: string, paperColor?: string) {
    const layoutBuilder = new LayoutBuilder(this.layout.title);
    const backgroundColor = color;
    const paperBgColor = paperColor === undefined ? color : paperColor;
    const gridColor = gridcolor === undefined ? "#edf3f4" : gridcolor;
    layoutBuilder
      .addLayoutData(this.layout)
      .styleFont("black", "Arial, sans-serif", 14)
      .styleBgColor(paperBgColor, backgroundColor)
      .addGridColor(gridColor, "y")
      .addGridColor(gridColor, "x")
      .addZeroLine("x", gridColor)
      .addZeroLine("y", gridColor);
    this.layout = layoutBuilder.buildLayout();
    return this;
  }

  /**
   * Build a plot from scratch
   *
   * @param {*} plotData - array containing the traces of the plot
   *  - i.e. plotData = [ trace1, trace2, ....]
   *  - where traces are { x: [], y: [], mode: "markers", markers : {color : 'blue'}}
   */
  constructInitialPlot(plotData?: any, layout?: any) {
    this.plotData = plotData === undefined ? this.plotData : plotData;
    this.layout = layout === undefined ? this.layout : layout;
    this.plotly.newPlot(this.canvasID, this.plotData, this.layout, this.config);
  }

  /**
   * Add traces to the initial plot
   *
   * @param newDataY - this is an array of arrays containing the last y value of each trace
   * @param newDataX - this is an array of arrays containing the last x value of each trace
   */
  updateInitialPlot(newDataY: any[], newDataX: any[], xaxisRange: any) {
    const traceIDs = [];
    for (let i = 0; i < newDataY.length; i++) {
      traceIDs.push(i);
    }

    this.plotly.extendTraces(
      this.canvasID,
      {
        y: [...newDataY],
        x: [...newDataX],
      },
      traceIDs
    );

    let dataMatrix: any = [];
    newDataY.forEach((val: any) => {
      dataMatrix.push(val[0]);
    });

    if (newDataY.length > 0) {
      this.plotly.relayout(this.canvasID, {
        yaxis: {
          ...this.layout.yaxis,
          range: [Math.min(...dataMatrix) - 40, Math.max(...dataMatrix) + 40],
        },
        xaxis: {
          ...this.layout.xaxis,
          range: xaxisRange,
        },
      });
    }
  }
}
