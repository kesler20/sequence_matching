import * as React from "react";
import "./CustomTextarea.css";

export default function CustomTextarea(props: {
  placeHolderText: string;
  onChange?: (e: any) => void;
  value?: string;
}) {
  const placeholder = props.placeHolderText ? props.placeHolderText : "Enter Scan";
  return (
    <div className="inputBox">
      <textarea required onChange={props.onChange} value={props.value} />
      <span>{placeholder}</span>
    </div>
  );
}
