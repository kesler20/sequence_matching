import * as React from "react";
import { ModelType, PCAResponse, PLSResponse } from "./state_machine/types";
import PCADashboard from "./components/dashboards/PCADashboard";
import PLSDashboard from "./components/dashboards/PLSDashboard";

export default function DashboardFactory(props: {
  model?: ModelType;
  modelName: string;
  modelResults?: PCAResponse | PLSResponse;
  xDataSet: string[];
  yDataSet: string[];
  onBackButtonClicked: () => void;
}) {
  switch (props.model) {
    case "PCA":
      return (
        <PCADashboard
          modelName={props.modelName}
          pcaData={props.modelResults as PCAResponse}
          onBackButtonClicked={props.onBackButtonClicked}
          dataSet={props.xDataSet}
        />
      );
    case "PLS":
      return (
        <PLSDashboard
          onBackButtonClicked={props.onBackButtonClicked}
          dataSet={props.xDataSet}
          modelName={props.modelName}
          plsData={props.modelResults as PLSResponse}
        />
      );
    default:
      return (
        <PCADashboard
          modelName={props.modelName}
          pcaData={props.modelResults as PCAResponse}
          onBackButtonClicked={props.onBackButtonClicked}
          dataSet={props.xDataSet}
        />
      );
  }
}
