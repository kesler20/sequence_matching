export const availableModels = ["PCA", "PLS"];
export type ModelType = (typeof availableModels)[number];

export type PCAResponse = {
  time_series_data: { [key: string]: number[] };
  PCs: number[][];
  loadings: number[][];
  R2xVxPC: number[][];
  explained_variance_ratios: number[];
  cumulative_variance: number[];
};

export type PLSResponse = {
  x_data: { [key: string]: number[] };
  y_data: { [key: string]: number[] };
  LatentVariables: number[][];
  loadings: number[][];
  prediction: any;
};

// Define the context for the machine
export type DataAnalysisContext = {
  model?: ModelType;
  xColumns: string[];
  yColumns: string[];
  modelName: string;
  modelResults?: PCAResponse | PLSResponse;
};

// Define the events that the machine handles
export type DataAnalysisEvent =
  | { type: "train model" }
  | { type: "select model"; model: ModelType }
  | { type: "select x columns"; columns: string[] }
  | { type: "select y columns"; columns: string[] }
  | { type: "name model"; modelName: string }
  | { type: "view results" }
  | { type: "back" };

// Define the states for the machine
export type DataAnalysisState =
  | { value: "Model And Data Selection"; context: DataAnalysisContext }
  | { value: "Model Training"; context: DataAnalysisContext }
  | { value: "Model Labelling"; context: DataAnalysisContext }
  | { value: "Report Error"; context: DataAnalysisContext }
  | { value: "Dashboard Page"; context: DataAnalysisContext };
