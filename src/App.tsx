import * as React from "react";
import { useMachine } from "@xstate/react";
import SelectSequenceLengthPromptComponent from "./components/SelectSequenceLengthPromptComponent";
import VerticalLinearStepperComponent from "./components/VerticalStepperComponent";
import CustomStepper from "./components/steppers/CustomStepper";
import { sequenceMatching } from "./state_machines/sequenceMatchingMachine";
import { createResourceInCache, getResourceFromCache } from "./customHooks";
import Upload from "./components/upload/Upload";
import WebSocketApi from "./WebSocketApi";
import toastFactory, {
  MessageSeverity,
} from "./components/alert_message/ToastMessage";
import { ToastContainer } from "react-toastify";
import NavbarComponent from "./components/navbar/NavbarComponent";

export default function App() {
  const sequenceMatchingState = getResourceFromCache("sequence_matching/state");
  const [state, send] = useMachine(sequenceMatching, {
    state: sequenceMatchingState,
  });
  const [currentState, setCurrentState] = React.useState<number>(0);
  const [websocket, setWebsocket] = React.useState<WebSocketApi | null>(null);

  const steps = [
    { title: "upload scans" },
    { title: "seqM" },
    { title: "download results" },
  ];

  // update the current state to change the value of the stepper
  React.useEffect(() => {
    if (typeof state.value === "object") {
      const stateTitle = Object.keys(state.value)[0];
      const stateTitles = steps.map((step) => step.title);
      const stateIndex = stateTitles.indexOf(stateTitle);
      setCurrentState(stateIndex);
    } else {
      const stateTitles = steps.map((step) => step.title);
      const stateIndex = stateTitles.indexOf(state.value);
      setCurrentState(stateIndex);
    }
  }, [state.value]);

  React.useEffect(() => {
    createResourceInCache("sequence_matching/state", state);
  }, [state]);

  return (
    <div className="bg-[rgb(22,29,51)] w-full">
      <NavbarComponent />
      <div className="flex w-full">
        <div
          className={`
            w-full flex-grow overflow-x-hidden
            flex items-center justify-center`}
        >
          <div className="min-h-screen h-full flex items-center justify-center w-full">
            <div className="flex items-center justify-evenly flex-col">
              <div className="rounded-xl m-6 w-full max-w-[550px] hidden md:block">
                <CustomStepper activeStep={currentState} steps={steps} />
              </div>
              <div className="m-24">
                {state.matches("upload scans") && (
                  <Upload
                    title="Upload Scans"
                    submitType="SCANS"
                    allowedFiles={["png", "jpg"]}
                    canSubmit={state.can("upload completed")}
                    onFileChange={(filesAllowedList: any[]) => {
                      send({
                        type: "update form",
                        sequenceLength: state.context.sequenceLength,
                        files: filesAllowedList,
                      });
                    }}
                    onValidScansSubmitted={() => send("upload completed")}
                  />
                )}
                {state.matches("seqM") && (
                  <SelectSequenceLengthPromptComponent
                    canRun={state.can("run analysis")}
                    onChangeInput={(e) => {
                      send({
                        type: "select sequence length",
                        sequenceLength: e.target.value,
                        files: state.context.files as any[],
                      });
                    }}
                    onRunButtonClicked={async () => {
                      send("run analysis");
                      toastFactory(
                        "Starting the analysis, connecting to server...",
                        MessageSeverity.INFO,
                      );

                      // Create a new WebSocket connection and send files directly
                      const ws = new WebSocketApi();
                      setWebsocket(ws);

                      try {
                        await ws.startSequenceMatching(
                          state.context.files as File[],
                          state.context.sequenceLength,
                        );
                        toastFactory(
                          "Connected! The analysis is running...",
                          MessageSeverity.INFO,
                        );
                      } catch (error) {
                        console.error("WebSocket connection failed:", error);
                        toastFactory(
                          "Failed to connect to the server. Please try again.",
                          MessageSeverity.ERROR,
                        );
                      }
                    }}
                    onBackButtonClicked={() => send("back")}
                  />
                )}
                {state.matches("download results") && (
                  <VerticalLinearStepperComponent
                    numberOfFilesUploaded={state.context.files?.length || 0}
                    websocket={websocket}
                    onRestartButtonClicked={() => {
                      setWebsocket(null);
                      send("restart");
                    }}
                    onBackButtonClicked={() => {
                      send("back");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
