import * as React from "react";
import "./CustomTextField.css";

export default function CustomTextField(props: {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeHolderText?: string;
  inputType?: string;
}) {
  const placeholder = props.placeHolderText ? props.placeHolderText : "Enter Scan";
  const inputType = props.inputType ? props.inputType : "number";
  return (
    <div className="inputBox">
      <input type={inputType} required onChange={props.onChange} />
      <span>{placeholder}</span>
    </div>
  );
}
