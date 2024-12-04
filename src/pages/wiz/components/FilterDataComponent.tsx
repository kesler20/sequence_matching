import * as React from "react";
import CustomizedSlider from "../../../components/slider/Slider";
import CustomDropdown from "../../../components/dropdown/CustomDropdown";

export default function FilterDataComponent(props: {}) {
  return (
    <div className="flex justify-start items-center w-full h-24 p-2">
      <div className="w-[150px] ml-[140px] mr-24">
        <CustomDropdown placeholderText="type of filter" options={["items 1"]} />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <CustomizedSlider
          name="filter above"
          minValue={0}
          maxValue={100}
          handleChangeValue={() => {}}
        />
      </div>
    </div>
  );
}
