import * as React from "react";
import Header from "../../../components/header/Header";
import Button from "../../../components/buttons/Button";
import CustomTextField from "../../../components/text_field/CustomTextField";

export default function SelectSequenceLengthPromptComponent(props: {
  onRunButtonClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBackButtonClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChangeInput: (e: any) => void;
  canRun: boolean;
}) {
  const onRun = (e: any) => {
    props.onRunButtonClicked(e);
  };

  const onBack = (e: any) => {
    props.onBackButtonClicked(e);
  };

  return (
    <div className="flex items-start justify-evenly flex-col h-full">
      <Header title="Select Which Scan to Run" category="Scan" />
      <div className="h-[100px] w-full">
        <CustomTextField
          onChange={props.onChangeInput}
          placeHolderText="Sequence Length (4286)"
        />
      </div>
      <p className="text-gray-400 text-lg">
        Enter the sequence length of your scans above
      </p>
      <p className="text-gray-400 text-lg mb-20">
        <span className="font-extrabold text-gray-300">Note:</span> the Sequence
        Matching Analysis can take 5 - 20 minutes.
      </p>
      <div className="flex items-center w-full justify-around">
        <Button inner={"Back"} onClick={onBack} />
        {props.canRun ? (
          <Button inner={"Run"} onClick={onRun} bgColor="rgb(35,197,94)" />
        ) : (
          <Button inner={"Run"} onClick={onRun} />
        )}
      </div>
    </div>
  );
}
