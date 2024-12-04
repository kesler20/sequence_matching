import * as React from "react";
import PlotBuilder from "../../../../apis/PlotBuilder";
import SpeedDialComponent from "../../../../components/speedial/SpeedialComponent";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/buttons/Button";
import { PCAResponse } from "../../state_machine/types";

export default function PCADashboard(props: {
  modelName: string;
  onBackButtonClicked: () => void;
  pcaData?: PCAResponse;
  dataSet: string[];
}) {
  // ========================= //
  //                           //
  //   DEFINE INITIAL STATE    //
  //                           //
  // ========================= //

  const [sensorNames, setSensorNames] = React.useState<string[]>([]);
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [plots, setPlots] = React.useState<PlotBuilder[]>([
    new PlotBuilder("plot-1"),
    new PlotBuilder("plot-2"),
    new PlotBuilder("plot-3"),
    new PlotBuilder("plot-4"),
    new PlotBuilder("plot-5"),
    new PlotBuilder("plot-6"),
    new PlotBuilder("plot-7"),
    new PlotBuilder("plot-8"),
  ]);

  // ======================== //
  //                          //
  //   DEFINE SIDE EFFECTS    //
  //                          //
  // ======================== //

  React.useEffect(() => {
    setSensorNames(() => {
      return props.dataSet.map((sensorTopic) => {
        // grab each part of the sensor topic
        const sensorTopicParts: string[] = sensorTopic.split(".");

        // take the last part of the sensor topic name and return that as the name
        return sensorTopicParts[sensorTopicParts.length - 1];
      });
    });
  }, []);

  // When the window resizes update the state
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Build the four plots
  React.useEffect(() => {
    if (sensorNames.length > 0) {
      buildFirstPlot();
      buildSecondPlot();
      buildThirdPlot();
      buildFourthPlot();
      buildFifthPlot();
      buildSixthPlot();
      buildSeventhPlot();
      buildEightPlot();

      plots.forEach((plot) => {
        plot.constructInitialPlot();
      });
    }
  }, [sensorNames]);

  // ================ //
  //                  //
  //     PLOT #1      //
  //                  //
  // ================ //

  const buildFirstPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }

    const plotID = 0;
    const plot = plots[plotID];

    const x = props.pcaData.PCs[0];
    const y = props.pcaData.PCs[1];

    plot
      .removeModeBar()
      .addPlotTitle("2D Score Plot")
      .addTrace("marker", "scores")
      .addAxisDimension("x", x, "t [2]", 0)
      .addAxisDimension("y", y, "t [2]", 0)
      .addDarkMode()
      .addScatterPlot(0);

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #2      //
  //                  //
  // ================ //

  const buildSecondPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }

    const plotID = 1;
    const plot = plots[plotID];

    const x = props.pcaData.PCs[0];
    const y = props.pcaData.PCs[1];
    const z = props.pcaData.PCs[2];

    plot
      .removeModeBar()
      .addPlotTitle("3D Score Plot")
      .addTrace("marker", "scores")
      .addAxisDimension("x", x, "t [1]", 0)
      .addAxisDimension("y", y, "t [2]", 0)
      .addAxisDimension("z", z, "t [3]", 0)
      .addDarkMode()
      .add3DPlot(0)
      .changeMarkerSize(5)
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #3      //
  //                  //
  // ================ //

  const buildThirdPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }
    const plotID = 2;
    const plot = plots[plotID];

    const cumulativeVariance = props.pcaData.cumulative_variance;
    const varianceRatios = props.pcaData.explained_variance_ratios;

    plot
      .removeModeBar()
      .addPlotTitle("Cumulative Variance Explained")
      .addTrace("marker", "variance ratio")
      .addAxisDimension("x", sensorNames, "Sensors", 0)
      .addAxisDimension("y", varianceRatios, "Explained Variance Ratio", 0)
      .addTrace("marker", "cumulative variance")
      .addAxisDimension("x", sensorNames, "Sensors", 1)
      .addAxisDimension("y", cumulativeVariance, "Cumulative Variance", 1)
      .addDarkMode()
      .addBarChart(0)
      .addLinePlot(1)
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #4      //
  //                  //
  // ================ //

  const buildFourthPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }

    const plotID = 3;
    const plot = plots[plotID];

    const firstPCData: number[] = [];
    const secondPCData: number[] = [];
    const thirdPCData: number[] = [];

    props.pcaData.R2xVxPC.forEach((column) => {
      firstPCData.push(column[0]);
      secondPCData.push(column[1]);
      thirdPCData.push(column[2]);
    });

    plot
      .removeModeBar()
      .addPlotTitle("R2xPCxSensor")
      .addTrace("marker", "PC1")
      .addTrace("marker", "PC2")
      .addTrace("marker", "PC3")
      .addAxisDimension("x", sensorNames, "PC1", 0)
      .addAxisDimension("y", firstPCData, "PC1", 0)
      .addAxisDimension("x", sensorNames, "PC2", 1)
      .addAxisDimension("y", secondPCData, "PC2", 1)
      .addAxisDimension("x", sensorNames, "Sensor", 2)
      .addAxisDimension("y", thirdPCData, "R2xPC", 2)
      .addBarChart(0)
      .addBarChart(1)
      .addBarChart(2)
      .addDarkMode()
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #5      //
  //                  //
  // ================ //

  const buildFifthPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }
    if (props.pcaData.time_series_data === undefined) {
      return;
    }
    const plotID = 4;
    const plot = plots[plotID];

    // add global styles to the plot
    plot.removeModeBar().addPlotTitle("Sensor Data");

    // define the x axis for the plot
    const timeSeriesData = props.pcaData.time_series_data;
    const timeSeriesDataColumns = Object.keys(props.pcaData.time_series_data);
    const xAxis = props.pcaData.time_series_data[timeSeriesDataColumns[0]].map(
      (_, index) => {
        return index;
      }
    );

    const sensorTopicToSensorName = (sensorTopic: string) => {
      // grab each part of the sensor topic
      const sensorTopicParts: string[] = sensorTopic.split("/");

      // take the last part of the sensor topic name and return that as the name
      return sensorTopicParts[sensorTopicParts.length - 1];
    };

    // Add a scatter plot for each columns
    timeSeriesDataColumns.forEach((col, index) => {
      plot
        .addTrace("marker", sensorTopicToSensorName(col))
        .addAxisDimension("x", xAxis, "Index", 0)
        .addAxisDimension("y", timeSeriesData[col], "Value", index)
        .addLinePlot(index);
    });

    // add dark mode to the plot
    plot.addDarkMode();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #6      //
  //                  //
  // ================ //

  const buildSixthPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }
    const plotID = 5;
    const plot = plots[plotID];

    const y = props.pcaData.loadings[0];

    plot
      .removeModeBar()
      .addPlotTitle("Loadings Plot PC #1")
      .addTrace("marker", "loadings")
      .addAxisDimension("x", sensorNames, "Sensors", 0)
      .addAxisDimension("y", y, "Loadings PC #1", 0)
      .addDarkMode()
      .addBarChart(0)
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #7      //
  //                  //
  // ================ //

  const buildSeventhPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }
    const plotID = 6;
    const plot = plots[plotID];

    const y = props.pcaData.loadings[1];

    plot
      .removeModeBar()
      .addPlotTitle("Loadings Plot PC #2")
      .addTrace("marker", "loadings")
      .addAxisDimension("x", sensorNames, "Sensors", 0)
      .addAxisDimension("y", y, "Loadings PC #2", 0)
      .addDarkMode()
      .addBarChart(0)
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  // ================ //
  //                  //
  //     PLOT #8      //
  //                  //
  // ================ //

  const buildEightPlot = () => {
    if (props.pcaData === undefined) {
      return;
    }
    const plotID = 7;
    const plot = plots[plotID];

    const y = props.pcaData.loadings[2];

    plot
      .removeModeBar()
      .addPlotTitle("Loadings Plot PC #3")
      .addTrace("marker", "loadings")
      .addAxisDimension("x", sensorNames, "Sensors", 0)
      .addAxisDimension("y", y, "Loadings PC #3", 0)
      .addDarkMode()
      .addBarChart(0)
      .buildPlot();

    setPlots((prevPlots) => {
      return prevPlots.map((prevPlot, index) => {
        if (index === plotID) {
          return plot;
        } else {
          return prevPlot;
        }
      });
    });
  };

  return (
    <div className="flex flex-col w-[90vw]">
      <Header title={props.modelName} category="Dashboard" />
      <div className="flex flex-col md:grid md:grid-cols-3 md:grid-rows-3 md:gap-4">
        {/* This will wrap the children into a 2x2 grid */}
        <div id="plot-1" className="col-span-1"></div>
        <div id="plot-2" className="col-span-2"></div>
        <div id="plot-3" className="col-span-1"></div>
        <div id="plot-4" className="col-span-2"></div>
        <div id="plot-5" className="col-span-3"></div>
        <div id="plot-6" className="col-span-1"></div>
        <div id="plot-7" className="col-span-1"></div>
        <div id="plot-8" className="col-span-1"></div>
      </div>
      {windowSize.width > 768 ? ( // Assuming 768px as the breakpoint for mobile view
        <SpeedDialComponent
          onSaveClicked={props.onBackButtonClicked}
          onDeleteClicked={props.onBackButtonClicked}
          coordinates={{ x: 10, y: 250 }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6"></div>
          <Button inner={"Save"} onClick={props.onBackButtonClicked} />
          <div className="p-6"></div>
          <Button inner={"Delete"} onClick={props.onBackButtonClicked} />
        </div>
      )}
    </div>
  );
}
