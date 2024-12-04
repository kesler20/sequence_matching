import { createMachine, assign } from "xstate";
import { DataAnalysisContext, DataAnalysisEvent } from "./types";
import { dataAnalysisMachineOptions } from "./utils";

export const dataAnalysisStateMachine = createMachine<
  DataAnalysisContext,
  DataAnalysisEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVACAggO1QBsBPWAS1iwAVUYA6AWQHsIxDc8Is1MsBlNmADG6MkzwBidACdUZPFgC2LNgG0ADAF1EoAA5Nyo8TpAAPRAEYArAA4ALHQBsAdivqbATgDM6jy48ATAA0IMSIdjbOdOrOXo7eAd4eVvEAvqkhPNj4RKQU1LRgjCrs+FxZ-IIiYpKwVehKJRraSCD6hjUm5ggWXjZedClWztYWAeruNlYhYQhezjZ0No5WfbZWdnHzVumZGNkEJOSUNPTMrKWc3PuVhMJGtfVYplhCTIQArop4sM0m7WQHl1LPNHINeo5en1nOpoTNEAF+nQAnZ1HZ0RCLJt5rsQBUckd8qciuc2FgACqyeTyKASCDiIryABuTAA1kV8Yc8idCsULhSqXgaQhmUwhBgas0-q0AUDWt1rPYnK53N5fP5gqFELZFlYrIjYhD5mNcZzcscCmcSgK5EK8LSwNJpExpHRdIQMAAzF2KOhmwk8q38ym24Wi8UPKVaf4GQGdeUIizOBxefUo9QBYZ6xzwhCOGJ0Dx2JNeQIWfoxRymm4E7mWknWgAyqAARmxCDSJARFGBGhdpXpY3LQN0NhYnIivKWbIkAvnnLmrL0lhnAvmdXYAhZq7xaxbiXyyc224QO-aJEyyGAAO5YaRwD6EdC-aMyofxkeIEYOJNp-X9RxjVzKcrGVBYUhGLw7FiIsdwOc0iV5Ul2GPdtOxbVAhFZAc2nfYwEwQb86F-AJM0nQCRlzOwUjoTcFhsdVHAiew4I4BDAyKAAlMB9GkBoAFEnRdCQMKwnDZQ-MwES3ME-HiCx1HLFwvAsYDNjoZxISTZNy31LwAlYvdEPoNBYAACxbJhUGkLhiREzDsNfQcOnwz8egsZInAzJM-BiGwPOA5cLGsKDnD8ZJgrsQyuX3JDrTKa5eAEO5qnECQ6hShpiFed4vh+cS8LwYEejsJjlTcTwfD8MLNVmMdCw8NEVJcBYUR2XE8BUeBWn9OtiRjFyioIiIAg0+IM1cNwFOGHMtR6TzkzRUi3HGRxHBsGxovY+tD0ucobmS+5JIk1ypJ6KdFhUtEi3UDYixWKiwtoxri0026AhUgyMjxGsYuMhtg0FGkBrjU6FT8UCXCXbFlg8GEbEXJF83sTZiw8ewvr2Xc-o43asFQ09gbfQbitWdQxsagJJsU26EbmyEHDo5ZnBZmFHEzLaAx27jeIEoTpBB4czo+qwPHK0jSounVc3zcdUwx9b1phbdvt62KTNQczLOs2zCkFySFQzUarqXYY1xcWbZinMFtKmFxemg0sovSVIgA */
    id: "Data Analysis Page",
    context: {
      model: undefined,
      xColumns: [],
      yColumns: [],
      modelName: "default model name",
      modelResults: undefined,
    },
    states: {
      "Model And Data Selection": {
        on: {
          "train model": {
            target: "Model Training",
            cond: "model and data set selected",
          },
          "select model": {
            target: "Model And Data Selection",
            internal: true,
            actions: assign({
              model: (_, event) => event.model,
              xColumns: (context, _) => context.xColumns,
              yColumns: (context, _) => context.yColumns,
              modelName: (context, _) => context.modelName,
              modelResults: (context, _) => context.modelResults,
            }),
          },
          "select x columns": {
            target: "Model And Data Selection",
            internal: true,
            actions: assign({
              model: (context, _) => context.model,
              xColumns: (_, event) => event.columns,
              yColumns: (context, _) => context.yColumns,
              modelName: (context, _) => context.modelName,
              modelResults: (context, _) => context.modelResults,
            }),
          },
          "select y columns": {
            target: "Model And Data Selection",
            internal: true,
            actions: assign({
              model: (context, _) => context.model,
              xColumns: (context, _) => context.xColumns,
              yColumns: (_, event) => event.columns,
              modelName: (context, _) => context.modelName,
              modelResults: (context, _) => context.modelResults,
            }),
          },
        },
      },

      "Model Training": {
        invoke: {
          src: "createModel",
          onDone: {
            target: "Model Labelling",
            actions: assign({
              model: (context, _) => context.model,
              xColumns: (context, _) => context.xColumns,
              yColumns: (context, _) => context.yColumns,
              modelName: (context, _) => context.modelName,
              modelResults: (_, event) => event.data,
            }),
            description: `The model creation will send a post request to the backend which will return the information required for the dashboard page`,
          },
          onError: "Report Error",
        },
      },

      "Model Labelling": {
        on: {
          "name model": {
            target: "Model Labelling",
            internal: true,
            actions: assign({
              model: (context, _) => context.model,
              xColumns: (context, _) => context.xColumns,
              yColumns: (context, _) => context.yColumns,
              modelName: (_, event) => event.modelName,
              modelResults: (context, _) => context.modelResults,
            }),
          },

          "view results": {
            target: "Dashboard Page",
            cond: "unique label selected",
          },

          back: {
            target: "Model And Data Selection",
            actions: "reset state",
          },
        },
      },

      "Report Error": {
        on: {
          back: {
            target: "Model And Data Selection",
            actions: "reset state",
          },
        },
      },

      "Dashboard Page": {
        on: {
          back: {
            target: "Model And Data Selection",
            actions: "reset state",
          },
        },
      },
    },

    initial: "Model And Data Selection",
  },
  dataAnalysisMachineOptions
);
