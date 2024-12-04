import { MachineOptions, assign } from "xstate";
import { createPCAModel, createPLSModel } from "../../../apis/requests";
import { DataAnalysisContext, DataAnalysisEvent } from "./types";

/**
 * given a particular model type, this will return the `createModel` method
 * for that specific ModelType with the required arguments
 * @param modelType the type of model to create
 * @param context the current context of the state machine
 * @returns
 */
const createModelCallback = async (context: DataAnalysisContext) => {
  switch (context.model) {
    case "PCA":
      return await createPCAModel(context.modelName, context.xColumns);
    case "PLS":
      return await createPLSModel(
        context.modelName,
        context.xColumns,
        context.yColumns
      );
    default:
      return await createPCAModel(context.modelName, context.xColumns);
  }
};

/**
 * This is the second argument to the `crateMachine` method and
 * is an object with 3 main properties:
 * - actions
 * - guards
 * - services
 * these are objects where each key is the name of an action/guard/service
 * and the value is a callback function which takes `(context, event) => {}`
 * or `assign()` method which is used to update the context
 */
export const dataAnalysisMachineOptions: Partial<
  MachineOptions<DataAnalysisContext, DataAnalysisEvent>
> = {
  actions: {
    "reset state": assign({
      model: undefined,
      xColumns: [],
      yColumns: [],
      modelName: "default model name",
      modelResults: undefined,
    }),
  },
  guards: {
    "model and data set selected": (context) =>
      context.model !== undefined && context.xColumns.length > 0,
    "unique label selected": (context) => !!context.modelName,
    "x and y columns selected": (context) =>
      context.model === "PLS" &&
      context.xColumns.length > 0 &&
      context.yColumns.length > 0,
  },
  services: {
    createModel: async (context) => {
      try {
        const result = await createModelCallback(context);
        if (result) {
          return result;
        } else {
          throw new Error("Failed to create PCA Model.");
        }
      } catch (error) {
        throw error;
      }
    },
  },
};
