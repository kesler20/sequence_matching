import * as React from "react";
import { ResolutionKey } from "../state_machine/monitoringPageTypes";

export default function ChangeChartResolutionDropdownComponent(props: {
  resolutionOptions: string[];
  currentResolution: string;
  setCurrentResolution: React.Dispatch<React.SetStateAction<ResolutionKey>>;
}) {
  const [optionsVisible, setOptionsVisible] = React.useState(false);

  const handleSelection = (option: ResolutionKey) => {
    props.setCurrentResolution(option);
    setOptionsVisible(false);
  };

  return (
    <div className="relative">
      <div className={`absolute -top-[24px] right-8`}>
        <div className="relative">
          <p
            className={`
          paragraph-text text-sm
          w-[80px]
          flex items-center justify-center
          border p-[3px] rounded-lg border-[rgb(52,59,81)]
          hover:bg-[rgb(52,59,81)]
          cursor-pointer
          `}
            onClick={() =>
              setOptionsVisible((prevOptionsVisibility) => !prevOptionsVisibility)
            }
          >
            {props.currentResolution}
          </p>
          {optionsVisible && (
            <ul
              className={`border rounded-lg border-[rgb(52,59,81)] absolute -top-0 left-20`}
            >
              {props.resolutionOptions.map((option, index) => {
                return (
                  <li
                    key={index}
                    className={`
                paragraph-text text-sm
                p-[3px] rounded-lg border-[rgb(52,59,81)]
                hover:bg-[rgb(52,59,81)]
                w-[80px]
                flex items-center justify-center
                cursor-pointer
                    `}
                    onClick={() => handleSelection(option as ResolutionKey)}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
