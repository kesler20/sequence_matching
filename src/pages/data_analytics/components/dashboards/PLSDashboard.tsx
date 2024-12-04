import * as React from "react";
import { PLSResponse } from "../../state_machine/types";
import PlotBuilder from "../../../../apis/PlotBuilder";
import Header from "../../../../components/header/Header";
import SpeedDialComponent from "../../../../components/speedial/SpeedialComponent";
import Button from "../../../../components/buttons/Button";


export default function PLSDashboard(props: {
  modelName: string;
  onBackButtonClicked: () => void;
  plsData?: PLSResponse;
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
    if (props.plsData === undefined) {
      return;
    }

    const plotID = 0;
    const plot = plots[plotID];


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
    if (props.plsData === undefined) {
      return;
    }

    const plotID = 1;
    const plot = plots[plotID];


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
    if (props.plsData === undefined) {
      return;
    }
    const plotID = 2;
    const plot = plots[plotID];

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
    if (props.plsData === undefined) {
      return;
    }

    const plotID = 3;
    const plot = plots[plotID];

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
    if (props.plsData === undefined) {
      return;
    }

    const plotID = 4;
    const plot = plots[plotID];

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
    if (props.plsData === undefined) {
      return;
    }
    const plotID = 5;
    const plot = plots[plotID];

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
    if (props.plsData === undefined) {
      return;
    }
    const plotID = 6;
    const plot = plots[plotID];

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
    if (props.plsData === undefined) {
      return;
    }
    const plotID = 7;
    const plot = plots[plotID];

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
