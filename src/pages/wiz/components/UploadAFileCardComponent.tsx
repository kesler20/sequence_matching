import * as React from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { tertiaryColor } from "../../../global_styles/colorPalette";

export default function UploadAFileCardComponent(props: {
  onClick: (e: any) => void;
}) {
  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`
        w-[80%] h-14
        bg-primary 
        flex items-center justify-center rounded-xl 
        border-dotted border-default-color border-4 
        hover:brightness-110 hover:cursor-pointer hover:border-gray-700`}
        onClick={props.onClick}
      >
        <AiFillPlusCircle size={20} color={tertiaryColor} />
        <p className="text-tertiary m-5">Upload a file Card</p>
      </div>
    </div>
  );
}
