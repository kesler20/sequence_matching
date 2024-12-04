import * as React from "react";
import LoadingSpinner from "../../../components/animated_components/LoadingSpinner";

export default function ModelTrainingComponent(props: { analysis: string }) {
  return (
    <div className={`w-full flex items-center justify-between flex-col`}>
      <p className="text-lg paragraph-text pb-6">
        Analysis Selected: {props.analysis}
      </p>
      <LoadingSpinner size={60} />
    </div>
  );
}
