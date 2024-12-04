import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import CircularStatic from "../../../components/animated_components/CircularLoading";
import MQTTApi from "../../../apis/mqtt/MQTTApi";
import Button from "../../../components/buttons/Button";
import toastFactory, {
  MessageSeverity,
} from "../../../components/alert_message/ToastMessage";

type Step = {
  label: string;
};

let activeStep = 0;

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
}) {
  // these are the two variables which are used to calculate the displayed percentage
  const [currentValue, setCurrentValue] = React.useState(0);
  const [currentTotal, setCurrentTotal] = React.useState(100);

  // depending on how many files were uploaded, the steps factory will return different components
  let steps: Step[] = stepsFactory(props.numberOfFilesUploaded);

  // this effect is used to listen to the MQTT messages and update the progress bar.
  React.useEffect(() => {
    const messageBus = new MQTTApi();

    messageBus.onConnect(() => {
      messageBus.subscribeClient("sequence_matching_progress/1", () => {
        // listening to the first loop in the sequence matching algorithm
        messageBus.onMessage("sequence_matching_progress/1", (message: string) => {
          const { current, total } = JSON.parse(message);
          updateLinearProgress(current, total);
        });
      });

      messageBus.subscribeClient("sequence_matching_progress/2", () => {
        // listening to the second loop in the sequence matching algorithm
        messageBus.onMessage("sequence_matching_progress/2", (message: string) => {
          const { current, total } = JSON.parse(message);
          updateLinearProgress(current, total);
        });
      });

      messageBus.subscribeClient(
        "sequence_matching_progress/tasks_completed",
        () => {
          // listening for changes in the active step
          messageBus.onMessage(
            "sequence_matching_progress/tasks_completed",
            (message: string) => {
              const tasksCompleted = parseInt(
                JSON.parse(message)["tasks completed"]
              );
              if (Number.isNaN(tasksCompleted)) {
                activeStep = steps.length;
                updateLinearProgress(currentValue, currentTotal);
              } else {
                if (tasksCompleted > activeStep) {
                  activeStep = tasksCompleted;
                  updateLinearProgress(currentValue, currentTotal);
                }
              }
            }
          );
        }
      );

      messageBus.subscribeClient("sequence_matching_progress/plot", () => {
        // listening for the linear plot generation
        let spiralPlots = 0;
        messageBus.onMessage(
          "sequence_matching_progress/plot",
          (message: string) => {
            const plotStatus = JSON.parse(message).step;
            if (plotStatus === "spiral_plot") {
              toastFactory(
                `Generating the Spiral Plot ${spiralPlots}. This may take a minute.`,
                MessageSeverity.INFO
              );
              spiralPlots++;
            } else if (plotStatus === "linear_plot") {
              toastFactory("Generating the Linear Plot...", MessageSeverity.INFO);
            } else if (plotStatus === "completed") {
              toastFactory(
                "The analysis is complete. You can now download the results.",
                MessageSeverity.SUCCESS
              );
            }
          }
        );
      });
    });

    return () => {
      messageBus
        .unsubscribeClient("sequence_matching_progress/1")
        .unsubscribeClient("sequence_matching_progress/2")
        .disconnectClient();
    };
  }, []);

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
      const url = `${process.env.REACT_APP_BACKEND_URL_PROD}/sequencematching/${i}`;
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
