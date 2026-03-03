import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import CircularStatic from "./animated_components/CircularLoading";
import WebSocketApi from "../WebSocketApi";
import Button from "./buttons/Button";
import toastFactory, { MessageSeverity } from "./alert_message/ToastMessage";

type Step = {
  label: string;
};

let activeStep = 0;

const REACT_APP_BACKEND_URL_DEV = "https://wiz-app-production.up.railway.app";

const stepsFactory = (numberOfFilesToDownload: number): Step[] => {
  if (numberOfFilesToDownload === 1) {
    return [
      {
        label: "Scanning the uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Ready for download",
      },
    ];
  } else if (numberOfFilesToDownload === 2) {
    return [
      {
        label: "Scanning the first uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Scanning the second uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Ready for download",
      },
    ];
  } else if (numberOfFilesToDownload === 3) {
    return [
      {
        label: "Scanning the first uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Scanning the second uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Scanning the third uploaded file",
      },
      {
        label: "Matching pixels",
      },
      {
        label: "Ready for download",
      },
    ];
  } else {
    return [];
  }
};

export default function VerticalLinearStepperComponent(props: {
  onRestartButtonClicked: () => void;
  numberOfFilesUploaded: number;
  onBackButtonClicked: () => void;
  websocket: WebSocketApi | null;
}) {
  // these are the two variables which are used to calculate the displayed percentage
  const [currentValue, setCurrentValue] = React.useState(0);
  const [currentTotal, setCurrentTotal] = React.useState(100);

  // depending on how many files were uploaded, the steps factory will return different components
  let steps: Step[] = stepsFactory(props.numberOfFilesUploaded);

  // this effect is used to listen to the WebSocket messages and update the progress bar.
  React.useEffect(() => {
    if (!props.websocket) return;

    const ws = props.websocket;

    // listening to the first loop in the sequence matching algorithm
    ws.onMessage("sequence_matching_progress/1", (data: any) => {
      const { current, total } = data;
      updateLinearProgress(current, total);
    });

    // listening to the second loop in the sequence matching algorithm
    ws.onMessage("sequence_matching_progress/2", (data: any) => {
      const { current, total } = data;
      updateLinearProgress(current, total);
    });

    // listening for changes in the active step
    ws.onMessage("sequence_matching_progress/tasks_completed", (data: any) => {
      const tasksCompleted = parseInt(data["tasks completed"]);
      if (Number.isNaN(tasksCompleted)) {
        activeStep = steps.length;
        setCurrentValue((prev) => prev);
      } else {
        if (tasksCompleted > activeStep) {
          activeStep = tasksCompleted;
          setCurrentValue((prev) => prev);
        }
      }
    });

    // listening for the plot generation
    let spiralPlots = 0;
    ws.onMessage("sequence_matching_progress/plot", (data: any) => {
      const plotStatus = data.step;
      if (plotStatus === "spiral_plot") {
        toastFactory(
          `Generating the Spiral Plot ${spiralPlots}. This may take a minute.`,
          MessageSeverity.INFO,
        );
        spiralPlots++;
      } else if (plotStatus === "linear_plot") {
        toastFactory("Generating the Linear Plot...", MessageSeverity.INFO);
      } else if (plotStatus === "completed") {
        toastFactory(
          "The analysis is complete. You can now download the results.",
          MessageSeverity.SUCCESS,
        );
      }
    });

    // listening for the final completed signal
    ws.onMessage("completed", () => {
      activeStep = steps.length;
      setCurrentValue(100);
      setCurrentTotal(100);
    });

    ws.onMessage("error", (data: any) => {
      toastFactory(
        `Error: ${data.message || "An unexpected error occurred"}`,
        MessageSeverity.ERROR,
      );
    });

    return () => {
      ws.disconnect();
    };
  }, [props.websocket]);

  const updateLinearProgress = (current: number, total: number) => {
    setCurrentValue(current);
    setCurrentTotal(total);
  };

  const handleRestartButtonClicked = () => {
    activeStep = 0;
    props.onRestartButtonClicked();
  };

  // get all the plots from the results folder at the end of the analysis
  const handleDownload = () => {
    let numberOfFilesToDownload = props.numberOfFilesUploaded;

    // if there is more then one scan uploaded, we need to add one more for the comparisons plot and the linear plot
    if (numberOfFilesToDownload > 1) {
      numberOfFilesToDownload++;
    }

    const generateAndClickDownloadLink = (url: string, filename: string) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    for (let i = -1; i < numberOfFilesToDownload; i++) {
      const url = `${REACT_APP_BACKEND_URL_DEV}/sequencematching/${i}`;
      const filename = i === -1 ? "linear_plot.png" : `plot${i}.png`;
      const waitTime = i === -1 ? 4 : i;

      // download each file with some delay
      setTimeout(() => {
        generateAndClickDownloadLink(url, filename);
      }, waitTime * 1000);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, minHeight: "100vh" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              optional={
                index === steps.length - 1 && activeStep >= steps.length - 1 ? (
                  <div
                    onClick={handleDownload}
                    className="text-tertiary hover:cursor-pointer"
                  >
                    Download Results
                  </div>
                ) : null
              }
            >
              <p className="paragraph-text">{step.label}</p>
            </StepLabel>
            <StepContent>
              <CircularStatic value={currentValue} total={currentTotal} />
            </StepContent>
          </Step>
        ))}
        {activeStep >= steps.length - 1 ? (
          <Button
            inner={"Restart"}
            onClick={handleRestartButtonClicked}
            className="mt-12"
          />
        ) : (
          <Button
            inner={"Back"}
            onClick={props.onBackButtonClicked}
            className="mt-12"
          />
        )}
      </Stepper>
    </Box>
  );
}
