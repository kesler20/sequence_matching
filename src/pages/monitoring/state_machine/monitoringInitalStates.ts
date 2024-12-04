import {
  LabFromBackend,
  ResolutionOptions,
} from "./monitoringPageTypes";

export const labInitialState: LabFromBackend = {
  name: "D73",
  id: 1,
  location: "Robert Hadfield Building",
  lab_equipments: [],
};

export const rangeOptions = ["2", "20", "200"];

export const resolutionOptions: ResolutionOptions = {
  seconds: null,
  minutes: 60_000,
  hours: 60 * 60_000,
  days: 24 * 60 * 60_000,
};
