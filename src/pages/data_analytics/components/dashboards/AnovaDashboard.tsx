import React from "react";
import PlotBuilder from "../../../../apis/PlotBuilder";

const AnovaDashboard: React.FC = () => {
  const Plotly = new PlotBuilder("plot1").plotly;

  React.useEffect(() => {
    // Sample data for demonstration purposes
    const xData = [1, 2, 3, 4, 5];
    const yData = [2, 3.5, 4, 5, 6];
    const errorData = [0.5, 0.4, 0.3, 0.2, 0.1];

    // 1. OLS Model with Error Bounds
    const olsTrace = {
      type: "scatter",
      x: xData,
      y: yData,
      error_y: {
        type: "data",
        array: errorData,
        visible: true,
      },
    };

    // 2. Violin Plot (You'll need to provide your own data)
    const violinTrace = {
      type: "violin",
      y: yData,
      box: {
        visible: true,
      },
      line: {
        color: "blue",
      },
    };

    // 3. Pareto Chart (You'll need to provide your own data)
    const paretoTrace = {
      x: ["Variable1", "Variable2", "Variable3"],
      y: [10, 5, 2],
      type: "bar",
    };

    // 4. QQ Plot (You'll need to provide your own data)
    const qqTrace = {
      x: xData,
      y: yData,
      mode: "markers",
      type: "scatter",
    };

    // Render the plots
    Plotly.newPlot("olsDiv", [olsTrace]);
    Plotly.newPlot("violinDiv", [violinTrace]);
    Plotly.newPlot("paretoDiv", [paretoTrace]);
    Plotly.newPlot("qqDiv", [qqTrace]);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col w-[300px]">
        <div id="olsDiv"></div>
        <div id="violinDiv"></div>
      </div>
      <div className="flex flex-col w-[300px]">
        <div id="paretoDiv"></div>
        <div id="qqDiv"></div>
      </div>
    </div>
  );
};

export default AnovaDashboard;
