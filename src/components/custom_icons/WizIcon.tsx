import * as React from "react";
import { tertiaryColor } from "../../global_styles/colorPalette";

export default function WizIcon(props: {
  color?: string;
}) {
  let color = tertiaryColor;
  if (props.color) {
    color = props.color;
  }

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="16.000000pt"
      height="16.000000pt"
      viewBox="0 0 16.000000 16.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <metadata>
        Created by potrace 1.16, written by Peter Selinger 2001-2019
      </metadata>
      <g
        transform="translate(0.000000,16.000000) scale(0.100000,-0.100000)"
        fill={color} // Set the fill color based on the provided prop value
        stroke="none"
      >
        <path
          d="M0 139 c0 -12 7 -19 20 -19 11 0 23 -7 26 -15 4 -8 10 -15 15 -15 5
          0 9 7 9 15 0 8 5 15 10 15 6 0 10 -7 10 -15 0 -19 16 -19 24 0 3 8 15 15 26
          15 13 0 20 7 20 19 0 17 -8 19 -80 19 -72 0 -80 -2 -80 -19z"
        />
        <path
          d="M0 45 l0 -45 80 0 80 0 0 45 c0 54 -21 61 -41 14 -12 -29 -13 -30
          -26 -13 -13 17 -13 17 -26 -1 -13 -17 -15 -16 -25 13 -17 50 -42 42 -42 -13z"
        />
      </g>
    </svg>
  );
};

