import { assign } from "xstate";
import {
  SequenceMatchingContext,
  SequenceMatchingEvent,
} from "./sequenceMatchingTypes";

// Custom guards and actions
export const guards = {
  scansUploaded: (context: SequenceMatchingContext) => {
    // Check if both fileUpload1 and fileUpload2 are populated
    if (context.files) {
      return context.files.length > 0 && context.files.length <= 3;
    } else {
      return false;
    }
  },
  scansSelected: (context: SequenceMatchingContext) => {
    // Check if which_scan is selected
    return context.sequenceLength > 0;
  },
};

export const actions = {
  updateContext: assign<SequenceMatchingContext, SequenceMatchingEvent>({
    sequenceLength: (context, event) =>
      event.type === "update form" || event.type === "select sequence length"
        ? event.sequenceLength
        : context.sequenceLength,
    files: (context, event) =>
      event.type === "update form" || event.type === "select sequence length"
        ? event.files
        : context.files,
  }),

  resetContext: assign<SequenceMatchingContext, SequenceMatchingEvent>({
    sequenceLength: (context, event) => 0,
    files: (context, event) => undefined,
  }),
};
