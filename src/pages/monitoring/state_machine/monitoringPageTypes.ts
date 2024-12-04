// --------------- MONITORING PAGE ------------------- //

import RealTimePlot from "../models/realTimePlot";

export type SensorFromBackend = {
  id: number;
  name: string;
  topic: string;
  lab_equipments_id: number;
};

export type SensorComponent = {
  name: string;
  isVisible: boolean;
} & SensorFromBackend;

export type LabEquipmentFromBackend = {
  id: number;
  laboratory_id: number;
  name: string;
  sensors: SensorFromBackend[];
};

export type LabEquipmentComponent = {
  name: string;
  isActive: boolean;
} & LabEquipmentFromBackend;

export type LabFromBackend = {
  id: number;
  name: string;
  location: string;
  lab_equipments: LabEquipmentFromBackend[];
};

export type LabEquipmentActivity = {
  name: string;
  isActive: boolean;
};

export type SensorVisibility = {
  name: string;
  isVisible: boolean;
};

// --------------- SINGLE STREAM PAGE ------------------- //

// Process data point from the backend
export type ProcessDataPoint = {
  Value: number;
  Timestamp: number;
};

// This data structure is used to get previous data from the cache.
export type ProcessDataChannel = {
  name: string; // the name of the sensor
  data: ProcessDataPoint[]; // the array of data points stored in redis
};

export type ProcessDataSet = ProcessDataChannel[];

export type GetProcessDataFromRedis = {
  KEY: string;
  VALUE: string; // the value is an array of ProcessDataPoints stringified twice
};

export type ResolutionKey = "seconds" | "minutes" | "hours" | "days";

export type RangeValues = "2" | "20" | "200"

export type ResolutionOptions = {
  [key in ResolutionKey]: number | null;
};

export type Range = [ResolutionKey, number];

// ---------------- SINGLE STREAM STATE MACHINE --------------------- //

export type SingleStreamPageMachineContext = {
  realTimePlot: RealTimePlot;
  sensorTopic: string;
  dataset: ProcessDataSet;
  rangeOptions: string[];
  maxNumberOfDataPointsToDisplay: number;
  dataStreamPaused: boolean;
  resolution: ResolutionKey;
  range: [ResolutionKey, number];
  resolutionOptions: ResolutionKey[];
};

export type SingleStreamPageMachineEvents =
  | { type: "pause" }
  | { type: "download data" }
  | { type: "request data.small" }
  | { type: "play" }
  | { type: "request data.large"; range : Range; resolution: ResolutionKey}
  | { type: "send failure message" }
  | { type: "send success message" }
  | { type: "connect to sensor data" }
  | { type: "update sensor topic"; value: string }
  | { type: "disconnect from sensor topic" }
  | { type: "disconnect from redis" }
