import * as React from "react";
import { HiBellAlert } from "react-icons/hi2";

export default function AlertButtonComponent(props: {
  onChangeAlertValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAlertValueSet: boolean;
  onRemoveAlertValue: () => void;
}) {
  const [showInputField, setShowInputField] = React.useState(false);
  const [currentAlertValue, setCurrentAlertValue] = React.useState<any>(undefined);

  const onAlertButtonClicked = (e: any) => {
    if (e.key === "Enter") {
      props.onChangeAlertValue(currentAlertValue);
    }
  };

  const onClickAlertButton = () => {
    if (props.isAlertValueSet) {
      setCurrentAlertValue(undefined);
      setShowInputField(false);
      props.onRemoveAlertValue();
    } else {
      setShowInputField(true);
      if (currentAlertValue !== undefined) {
        props.onChangeAlertValue(currentAlertValue);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className={`
      paragraph-text text-sm
      w-[155px]
      hover:bg-[rgb(52,59,81)] cursor-pointer
      flex items-center justify-evenly
      absolute -top-[20px] left-[420px]
      border p-[3px] rounded-full border-[rgb(52,59,81)]
      `}
        onClick={onClickAlertButton}
      >
        {!props.isAlertValueSet ? (
          <>
            <p>Set Alert</p>
            <HiBellAlert size={"20"} />
          </>
        ) : (
          <>
            <p>Remove Alert</p>
            <HiBellAlert size={"20"} />
          </>
        )}
      </div>
      {showInputField && (
        <div
          className={`
            paragraph-text text-sm
            w-[155px]
            hover:bg-[rgb(52,59,81)] cursor-pointer
            flex items-center justify-center
            absolute -top-[-10px] left-[420px]
            border p-[3px] rounded-full border-[rgb(52,59,81)]
            `}
        >
          <input
            onChange={(e) => setCurrentAlertValue(e)}
            onKeyDown={onAlertButtonClicked}
            type="number"
            className="w-1/3 bg-inherit outline-[rgb(52,59,81)] outline-dashed text-center"
          />
        </div>
      )}
    </div>
  );
}
