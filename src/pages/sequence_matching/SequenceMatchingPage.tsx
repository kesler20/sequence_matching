import * as React from "react";
import { useMachine } from "@xstate/react";
import SelectSequenceLengthPromptComponent from "./components/SelectSequenceLengthPromptComponent";
import VerticalLinearStepperComponent from "./components/VerticalStepperComponent";
import CustomStepper from "../../components/steppers/CustomStepper";
import { sequenceMatching } from "./state_machine/sequenceMatchingMachine";
import { sendScansToSequenceMatchingService } from "../../apis/requests";
import { createResourceInCache, getResourceFromCache } from "../../apis/customHooks";
import Upload from "../../components/upload/Upload";
import toastFactory, {
  MessageSeverity,
} from "../../components/alert_message/ToastMessage";

export default function SequenceMatchingPage(props: {}) {
  const sequenceMatchingState = getResourceFromCache("sequence_matching/state");
  const [state, send] = useMachine(sequenceMatching, {
    state: sequenceMatchingState,
  });
  const [currentState, setCurrentState] = React.useState<number>(0);

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
    <div>
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
                  const formData = new FormData();
                  state.context.files?.forEach((file, index) => {
                    formData.append(`uploaded_file${index + 1}`, file);
                  });
                  send("run analysis");
                  toastFactory(
                    "starting the analysis wait a few seconds...",
                    MessageSeverity.INFO
                  );
                  const result = await sendScansToSequenceMatchingService(
                    formData,
                    state.context.sequenceLength,
                    state.context.files !== undefined
                      ? state.context.files?.length
                      : 0
                  );

                  console.log("result", result);

                  // if (result === undefined) {
                  //   toastFactory(
                  //     "Internal error found, please report the issue",
                  //     MessageSeverity.ERROR
                  //   );
                  // }
                }}
                onBackButtonClicked={() => send("back")}
              />
            )}
            {state.matches("download results") && (
              <VerticalLinearStepperComponent
                numberOfFilesUploaded={state.context.files?.length || 0}
                onRestartButtonClicked={() => {
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
  );
}
