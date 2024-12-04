import React from "react";
import Stepper from "react-stepper-horizontal";



export default function CustomStepper(props) {
  return (
    <Stepper
      {...props}
      activeColor="rgb(123,199,253)"
      defaultColor="#eee"
      completeColor="rgb(123,199,253)"
      activeTitleColor="#fff"
      completeTitleColor="#eee"
      defaultTitleColor="#bbb"
      circleFontColor="#000"
      completeBarColor="rgb(123,199,253)"
    />
  );
}
