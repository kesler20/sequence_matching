import * as React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";


const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function CustomizedSlider(props: {
  name: string;
  minValue: number;
  maxValue: number;
  handleChangeValue: (event: Event, value: number | number[]) => void;
  defaultValue?: number;
}) {
  return (
    <div className="flex w-full flex-col">
      {props.name && <p className="paragraph-text">{props.name}</p>}
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={props.defaultValue}
        min={props.minValue}
        max={props.maxValue}
        onChange={props.handleChangeValue}
      />
    </div>
  );
}
