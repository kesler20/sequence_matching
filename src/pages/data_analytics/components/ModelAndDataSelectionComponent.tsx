import * as React from "react";
import { getAllSensors } from "../../../apis/requests";
import CustomDropdown from "../../../components/dropdown/CustomDropdown";
import { SelectChangeEvent } from "@mui/material";
import SolidHorizontalLineDivider from "../../../components/divider/SolidHorizontalLineDivider";
import Button, { ButtonState } from "../../../components/buttons/Button";
import { RxCross1 } from "react-icons/rx";
import { ModelType, availableModels } from "../state_machine/types";

export default function ModelAndDataSelectionComponent(props: {
  updateXDataSet: (dataSet: string[]) => void;
  updateYDataSet: (dataSet: string[]) => void;
  currentModel?: ModelType;
  updateModel: (model: ModelType) => void;
  submitButtonClicked: () => void;
  buttonCanSubmit: boolean;
}) {
  
  // a data set is a collection of sensors
  const [variableOptionList, setVariableOptionList] = React.useState<string[]>([]);
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>([]);
  const [variablesWithTopics, setVariablesWithTopics] = React.useState<string[][]>(
    []
  );

  // load all the sensors from the backend
  // update the dataset with the available sensors
  React.useEffect(() => {
    updateVariableOptionList();
  }, []);

  // Call the functions to update the dataset
  // every time the data selected variables are updated.
  React.useEffect(() => {
    const selectedVariableTopics = selectedVariables.map((selectedVariable) => {
      const sensorTopic = variablesWithTopics.filter(
        (variable) => variable[0] === selectedVariable
      );
      if (sensorTopic) {
        return sensorTopic[0][1];
      } else {
        return selectedVariable;
      }
    });
    props.updateXDataSet(selectedVariableTopics);
  }, [selectedVariables]);

  const updateVariableOptionList = async () => {
    // get all the sensors from the sensors from the backend
    const sensorsFromBackend = await getAllSensors();
    // if the sensors are not null
    if (sensorsFromBackend) {
      // set the variableOptionList to all the sensors names from the backend
      setVariableOptionList(() => {
        return sensorsFromBackend.map((sensor) => {
          return sensor.name;
        });
      });

      setVariablesWithTopics(() => {
        return sensorsFromBackend.map((sensor) => {
          return [sensor.name, sensor.topic];
        });
      });
    }
  };

  const addVariable = (event: SelectChangeEvent) => {
    const newVariable = event.target.value;
    setSelectedVariables((prevSelectedVariables) => {
      // Check if the variable is already selected
      if (!prevSelectedVariables.includes(newVariable)) {
        return [...prevSelectedVariables, newVariable];
      }
      // If the variable is already selected, return the previous state
      return prevSelectedVariables;
    });
  };

  const removeVariable = (variableToRemove: string) => {
    setSelectedVariables((prevState) =>
      // only include all the variables which are not the variableToRemove
      prevState.filter((variable) => variable !== variableToRemove)
    );
  };

  return (
    <div
      className={` min-w-[300px] md:w-[500px] w-full h-[600px] rounded-xl bg-primary flex flex-col items-center justify-evenly`}
    >
      <p className="text-tertiary">Select Model & Data Set</p>
      {/* Lighter Container containing the dropdown elements */}
      <div className="min-w-[280px]  md:w-[450px] w-full h-[400px] bg-fourth-color flex flex-col items-center justify-center">
        {/* First dropdown for the model selection */}
        <CustomDropdown
          placeholderText="Select Model"
          options={availableModels as string[]}
          minWidth={205}
          padding={2}
          onChange={(event) => props.updateModel(event.target.value)}
        />
        {/* Second dropdown for the column selection */}
        <CustomDropdown
          placeholderText="Select X Variable"
          options={variableOptionList}
          minWidth={205}
          padding={2}
          onChange={addVariable}
        />
        {/* Third dropdown for the y column if a PLS model was selected */}
        {props.currentModel === "PLS" && (
          <CustomDropdown
            placeholderText="Select Y Variable"
            options={variableOptionList}
            minWidth={205}
            padding={2}
            onChange={addVariable}
          />
        )}
        {/* Container listing all the selected variables */}
        {selectedVariables.length > 0 && (
          <div className="flex flex-col w-full">
            <p className="paragraph-text pl-6">Selected Variables</p>
            <SolidHorizontalLineDivider />
            <div className="flex flex-wrap overflow-y-scroll h-[150px] custom-scrollbar">
              {selectedVariables.map((selectedVariable) => {
                return (
                  <p
                    className="paragraph-text border-default-color rounded-xl border-[1px] hover:cursor-pointer p-2 m-1"
                    onDoubleClick={() => removeVariable(selectedVariable)}
                  >
                    <div className="flex items-center justify-between">
                      {selectedVariable} <RxCross1 size={16} className="m-2" />
                    </div>
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* TODO: Add download data icon */}
      <Button
        inner={"Submit"}
        buttonType={props.buttonCanSubmit ? ButtonState.IDLE : ButtonState.ERROR}
        onClick={props.submitButtonClicked}
      />
    </div>
  );
}
