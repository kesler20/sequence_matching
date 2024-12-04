import React from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Range, ResolutionKey } from "../state_machine/monitoringPageTypes";
import { ButtonStateType } from "../../../components/buttons/Button";
import { RiExchangeFundsLine } from "react-icons/ri";

// RiExchangeFundsLine  loading animation

export function XAxisComponent(props: {
  xAxisRanges: string[];
  xAxisResolutions: string[];
  currentRange: Range;
  setCurrentRange: React.Dispatch<React.SetStateAction<Range>>;
  currentResolution: ResolutionKey;
  buttonState: ButtonStateType;
}) {
  const [areResolutionOptionsVisible, setAreResolutionOptionsVisible] =
    React.useState(false);
  const [areRangeOptionsVisible, setAreRangeOptionsVisible] = React.useState(false);

  const handleXAxisSelection = (
    option: string,
    optionType: "resolution" | "range"
  ) => {
    if (optionType === "range") {
      setAreRangeOptionsVisible(false);
      props.setCurrentRange((prevRange: Range) => {
        return [prevRange[0], parseInt(option)];
      });
      setAreResolutionOptionsVisible(false);
      setAreRangeOptionsVisible(false);
    } else {
      props.setCurrentRange((prevRange: Range) => {
        return [option as ResolutionKey, prevRange[1]];
      });
      setAreRangeOptionsVisible(false);
      setAreResolutionOptionsVisible(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`
      paragraph-text text-sm 
      w-[185px] 
      flex items-center justify-center 
      absolute -top-[20px] left-20 
      border p-[3px] rounded-full border-[rgb(52,59,81)]
      `}
      >
        <div className="flex items-center justify-between w-full">
          {props.buttonState !== "loading" ? (
            <>
              <BiLeftArrowAlt
                className="rounded-full border border-[rgb(52,59,81)] hover:bg-[rgb(52,59,81)] cursor-pointer"
                onClick={() => {
                  setAreRangeOptionsVisible(
                    (prevOptionsVisibility) => !prevOptionsVisibility
                  );
                  setAreResolutionOptionsVisible(false);
                }}
                size={"20"}
              />
              <div className="flex justify-center items-center w-full">
                {/* RANGE */}
                <p
                  className="hover:bg-[rgb(52,59,81)] cursor-pointer"
                  onClick={() => {
                    setAreRangeOptionsVisible(
                      (prevOptionsVisibility) => !prevOptionsVisibility
                    );
                    setAreResolutionOptionsVisible(false);
                  }}
                >
                  Last {props.currentRange[1]}
                </p>
                <p className="pl-[4px] pr-[4px]">|</p>
                {/* RESOLUTION */}
                <p
                  className="hover:bg-[rgb(52,59,81)] cursor-pointer"
                  onClick={() => {
                    setAreResolutionOptionsVisible(
                      (prevOptionsVisibility) => !prevOptionsVisibility
                    );
                    setAreRangeOptionsVisible(false);
                  }}
                >
                  {props.currentResolution}
                </p>
              </div>
            </>
          ) : (
            <>
              <RiExchangeFundsLine
                className="rounded-full border border-[rgb(52,59,81)] hover:bg-[rgb(52,59,81)] cursor-pointer rotate-continuously"
                size={"20"}
              />
              <div className="flex justify-center items-center w-full">
                <p className="hover:bg-[rgb(52,59,81)] cursor-pointer">
                  Loading last {props.currentRange[1]} {props.currentResolution}
                </p>
              </div>
            </>
          )}
        </div>
        {areRangeOptionsVisible && (
          <ul className="border rounded-lg border-[rgb(52,59,81)] absolute -top-0 left-[155px]">
            {props.xAxisRanges.map((option, index) => {
              return (
                <li
                  key={index}
                  className={`
                paragraph-text text-sm
                p-[3px] rounded-lg border-[rgb(52,59,81)]
                hover:bg-[rgb(52,59,81)]
                w-[130px]
                flex items-center justify-center
                cursor-pointer
                    `}
                  onClick={() => handleXAxisSelection(option, "range")}
                >
                  {
                    <p>
                      Last {option} {props.currentResolution}
                    </p>
                  }
                </li>
              );
            })}
          </ul>
        )}
        {areResolutionOptionsVisible && (
          <ul className="border rounded-lg border-[rgb(52,59,81)] absolute -top-0 left-[185px]">
            {props.xAxisResolutions.map((option, index) => {
              return (
                <li
                  key={index}
                  className={`
                paragraph-text text-sm
                p-[3px] rounded-lg border-[rgb(52,59,81)]
                hover:bg-[rgb(52,59,81)]
                w-[130px]
                flex items-center justify-center
                cursor-pointer
                    `}
                  onClick={() => handleXAxisSelection(option, "resolution")}
                >
                  {<p>{option}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function YAxisComponent(props: {
  currentYMax: number;
  setCurrentYMax: React.Dispatch<React.SetStateAction<number>>;
  currentYMin: number;
  setCurrentYMin: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [listenToUserInputYMax, setListenToUserInputYMax] = React.useState(false);
  const [listenToUserInputYMin, setListenToUserInputYMin] = React.useState(false);
  const [currentYMaxOption, setCurrentYMaxOption] = React.useState<string | number>(
    props.currentYMax
  );
  const [currentYMinOption, setCurrentYMinOption] = React.useState<string | number>(
    props.currentYMin
  );
  const size = "40";
  const isNumber = /^\d+(\.\d+)?$/;

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (listenToUserInputYMax && isNumber.test(e.key)) {
        props.setCurrentYMax(parseInt(e.key));
        setCurrentYMaxOption(parseInt(e.key));
      } else if (listenToUserInputYMin && isNumber.test(e.key)) {
        props.setCurrentYMin(parseInt(e.key));
        setCurrentYMinOption(parseInt(e.key));
      } else if (e.key === "Enter") {
        setListenToUserInputYMax(false);
        setListenToUserInputYMin(false);
      } else {
        console.log(e.key);
      }
    };

    if (listenToUserInputYMax || listenToUserInputYMin) {
      document.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [listenToUserInputYMax, listenToUserInputYMin]);

  const handleYAxisSelection = (minMax: string) => {
    if (minMax === "max") {
      setCurrentYMaxOption("_");
      setListenToUserInputYMax(true);
    } else {
      setCurrentYMinOption("_");
      setListenToUserInputYMin(true);
    }
  };

  return (
    <div className="flex flex-col h-full items-start justify-evenly md:justify-between">
      <div
        className={`
    paragraph-text text-sm 
    w-[${size}px] h-[${size}px] 
    flex items-center justify-center 
    border ml-[6px] p-[3px] rounded-full border-[rgb(52,59,81)]
    bg-[rgb(12,19,41)]
    hover:bg-[rgb(52,59,81)]
    cursor-pointer
    `}
        onClick={() => handleYAxisSelection("max")}
      >
        <p className={`${listenToUserInputYMax && "animate-flicker"}`}>
          {currentYMaxOption}
        </p>
      </div>
      <div
        className={`
    paragraph-text text-sm 
    w-[${size}px] h-[${size}px]
    flex items-center justify-center 
    border ml-[6px] p-[3px] rounded-full border-[rgb(52,59,81)]
    bg-[rgb(12,19,41)]
    hover:bg-[rgb(52,59,81)]
    cursor-pointer
    `}
        onClick={() => handleYAxisSelection("min")}
      >
        <p className={`${listenToUserInputYMin && "animate-flicker"}`}>
          {currentYMinOption}
        </p>
      </div>
    </div>
  );
}
