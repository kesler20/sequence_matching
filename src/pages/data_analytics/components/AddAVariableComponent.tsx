import * as React from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { tertiaryColor } from "../../../global_styles/colorPalette";

export default function AddAVariableComponent(props: {
  onClick: (e: any) => void;
  styles?: any;
}) {
  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`
        bg-primary 
        flex items-center justify-center rounded-xl 
        border-dotted border-default-color border-4 
        hover:brightness-110 hover:cursor-pointer hover:border-gray-700`}
        onClick={props.onClick}
        style={props.styles}
      >
        <AiFillPlusCircle size={20} color={tertiaryColor} />
        <p className="text-tertiary m-5">Add a Variable</p>
      </div>
    </div>
  );
}
