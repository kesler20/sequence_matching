import * as React from "react";
import CustomDropdown from "../../../components/dropdown/CustomDropdown";

export default function ChangePlotComponent(props: {}) {
  return (
    <div className="h-24 w-full flex items-center justify-evenly">
      <CustomDropdown placeholderText="x" options={["items 1"]} />
      <CustomDropdown placeholderText="y" options={["items 1"]} />
      <CustomDropdown placeholderText="z" options={["items 1"]} />
      <CustomDropdown placeholderText="color" options={["items 1"]} />
      <CustomDropdown placeholderText="size" options={["items 1"]} />
      <CustomDropdown placeholderText="plot type" options={["items 1"]} />
    </div>
  );
}
