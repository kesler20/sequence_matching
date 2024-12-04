import { useMachine } from "@xstate/react";
import * as React from "react";
import CustomStepper from "../../components/steppers/CustomStepper";
import { createResourceInCache, getResourceFromCache } from "../../apis/customHooks";
import { dataAnalysisStateMachine } from "./state_machine/dataAnalysisStateMachine";
import { StateMachine } from "xstate";
import ModelAndDataSelectionComponent from "./components/ModelAndDataSelectionComponent";
import ModelTrainingComponent from "./components/ModelTrainingComponent";
import ModelLabelling from "./components/ModelLabelling";
import ErrorPage from "./components/ErrorPage";
import {
  DataAnalysisContext,
  DataAnalysisEvent,
  DataAnalysisState,
} from "./state_machine/types";
import DashboardFactory from "./DashboardFactory";

export default function DataAnalyticsPage(props: {}) {
  // Load the state from the cache
  const dataAnalysisStateMachineFromCache = getResourceFromCache(
    "data_analytics_page/state"
  );
  
  const [state, send] = useMachine<
    StateMachine<DataAnalysisContext, DataAnalysisState, DataAnalysisEvent>
  >(dataAnalysisStateMachine, {
    state: dataAnalysisStateMachineFromCache,
  });

  // Save the state to the cache any time it changes
  React.useEffect(() => {
    createResourceInCache("data_analytics_page/state", state);
  }, [state]);

  // The following two functions are used to locate and highlight the stepper
  const getStateNamesFromStateMachine = (
    stateMachine: StateMachine<
      DataAnalysisContext,
      DataAnalysisState,
      DataAnalysisEvent
    >
  ): { title: string }[] => {
    if (stateMachine === undefined) {
      return [];
    }
    const states = stateMachine.config.states ? stateMachine.config.states : {};
    return Object.keys(states).map((stateName) => {
      return { title: stateName };
    });
  };

  const getIndexOfCurrentState = (stateMachine: any, currentState: string) => {
    const stateNames = getStateNamesFromStateMachine(stateMachine);
    let finalIndex = -1;
    stateNames.forEach((stateName, index) => {
      if (stateName.title === currentState) {
        finalIndex = index;
      }
    });
    return finalIndex;
  };

  return (
    <div>
      <div className="min-h-screen h-full flex items-center justify-center w-full">
        <div className="flex items-center justify-evenly flex-col">
          <div className="rounded-xl m-6 w-full max-w-[550px] hidden md:block">
            {!state.matches("Dashboard Page") && (
              <CustomStepper
                activeStep={getIndexOfCurrentState(
                  dataAnalysisStateMachine,
                  state.value as string
                )}
                steps={getStateNamesFromStateMachine(
                  dataAnalysisStateMachine
                ).filter((stateName) => stateName.title != "Report Error")}
              />
            )}
          </div>
          <div className="m-24">
            {state.matches("Model And Data Selection") && (
              <ModelAndDataSelectionComponent
                currentModel={state.context.model}
                updateXDataSet={(columns) => {
                  send("select x columns", {
                    columns,
                  });
                }}
                updateYDataSet={(columns) => {
                  send("select y columns", {
                    columns,
                  });
                }}
                updateModel={(model) => {
                  send("select model", {
                    model,
                  });
                }}
                buttonCanSubmit={state.can("train model")}
                submitButtonClicked={() => send("train model")}
              />
            )}
            {state.matches("Model Training") && (
              <ModelTrainingComponent
                analysis={state.context.model ? state.context.model : "anova"}
              />
            )}
            {state.matches("Model Labelling") && (
              <ModelLabelling
                buttonCanSubmit={state.can("view results")}
                submitButtonClicked={() => {
                  send("view results");
                }}
                onChangeModelLabel={(e) => {
                  send("name model", { modelName: e.target.value });
                }}
                backButtonClicked={() => send("back")}
              />
            )}
            {state.matches("Report Error") && (
              <ErrorPage onBackButtonClicked={() => send("back")} />
            )}
            {state.matches("Dashboard Page") && (
              <DashboardFactory
                model={state.context.model}
                modelName={state.context.modelName}
                modelResults={state.context.modelResults}
                xDataSet={state.context.xColumns}
                yDataSet={state.context.yColumns}
                onBackButtonClicked={() => send("back")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
