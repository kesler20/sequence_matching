import * as React from "react";
import { tertiaryColor } from "../../global_styles/colorPalette";

export type ButtonStateType = "success" | "error" | "loading" | "idle";

// the button states are used to change the color of the button
// the colorCoding is used to access different colors depending on the buttonState
export enum ButtonState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

const colorCoding: { [key in ButtonStateType]: string } = {
  success: "rgb(195,195,250)",
  error: "rgb(250,239,239)",
  loading: "#f5f8ff",
  idle: tertiaryColor,
};


export default function Button(props: {
  inner: React.ReactNode;
  color?: string;
  bgColor?: string;
  buttonType?: ButtonStateType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  //build the styles by setting default values
  const buttonType = props.buttonType ? props.buttonType : ButtonState.IDLE;
  const buttonColor = props.bgColor ? props.bgColor : colorCoding[buttonType];
  const buttonTextColor = props.color ? props.color : "white";

  return (
    <button
      onClick={props.onClick}
      type="submit"
      style={{
        backgroundColor: buttonColor,
        color: buttonTextColor,
        borderRadius: "10px",
      }}
      className={`text-44 p-3 w-24 hover:drop-shadow-xl` + props.className}
    >
      <div className="flex items-center justify-center">{props.inner}</div>
    </button>
  );
};

