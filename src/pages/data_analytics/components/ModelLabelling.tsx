import * as React from "react";
import CustomTextField from "../../../components/text_field/CustomTextField";
import Button, { ButtonState } from "../../../components/buttons/Button";
import Header from "../../../components/header/Header";

export default function ModelLabelling(props: {
  buttonCanSubmit: boolean;
  onChangeModelLabel: React.ChangeEventHandler<HTMLInputElement>;
  submitButtonClicked: () => void;
  backButtonClicked: () => void;
}) {
  return (
    <div className="flex items-start justify-evenly flex-col h-full">
      <Header title="Select A Name for The Model" category="Model Labelling" />
      <div className="h-[100px] w-full">
        <CustomTextField
          onChange={props.onChangeModelLabel}
          inputType="text"
          placeHolderText="Enter a Unique Name for The Model"
        />
      </div>
      <p className="text-gray-400 text-lg">
        Select a name for the model and visualise the results
      </p>
      <p className="text-gray-400 text-lg mb-20">
        <span className="font-extrabold text-gray-300">Note:</span> the Model Type is{" "}
        <strong>PCA</strong>.
      </p>
      <div className="flex items-center w-full justify-around">
        <Button inner={"Back"} onClick={props.backButtonClicked} />
        <Button
          inner={"Results"}
          buttonType={props.buttonCanSubmit ? ButtonState.IDLE : ButtonState.ERROR}
          onClick={props.submitButtonClicked}
        />
      </div>
    </div>
  );
}
