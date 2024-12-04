import * as React from "react";
import UploadAFileCardComponent from "./UploadAFileCardComponent";
import CustomDropdown from "../../../components/dropdown/CustomDropdown";

export default function AddDataComponent(props: {
  onUploadAFileClicked: (e: any) => void;
}) {
  return (
    <div className="flex h-[100px] justify-between items-center p-2 ml-12">
      <div className="flex w-1/3 justify-evenly">
        <UploadAFileCardComponent onClick={props.onUploadAFileClicked} />
        <CustomDropdown placeholderText="Add a File" options={["items 1"]}/>
      </div>
    </div>
  );
}
