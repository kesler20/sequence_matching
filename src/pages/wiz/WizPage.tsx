import * as React from "react";
import PlotBuilder from "../../apis/PlotBuilder";
import AddData from "./components/AddDataComponent";
import ChangePlot from "./components/ChangePlotComponent";
import FilterDataComponent from "./components/FilterDataComponent";
import { useMachine } from "@xstate/react";
import wizStateMachine from "./state_machine/wizStateMachine";
import Upload from "../../components/upload/Upload";

export default function WizPage(props: {}) {
  const [plot, setPlot] = React.useState(new PlotBuilder("plotDiv"));
  const [state, send] = useMachine(wizStateMachine);

  React.useEffect(() => {
    console.log(state.value);
  }, [state]);

  React.useEffect(() => {
    plot.addDarkMode().constructInitialPlot();
  }, [plot]);

  return (
    <div className="w-full h-screen flex flex-col p-6 pt-0">
      {state.matches("Upload a file") && (
        <div className="flex justify-center items-center w-full h-full">
          <Upload
            title="Upload A file"
            submitType="EXCEL"
            onValidScansSubmitted={(e) => console.log(e)}
            canSubmit={true}
            onFileChange={(e) => console.log(e)}
          />
        </div>
      )}
      {state.matches("No files & No Axis selected") && (
        <>
          <AddData
            onUploadAFileClicked={() => {
              send("upload file clicked");
            }}
          />
          <div className="w-full h-[600px]" id="plotDiv"></div>
          <ChangePlot />
          <FilterDataComponent />
        </>
      )}
    </div>
  );
}
