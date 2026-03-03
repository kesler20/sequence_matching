
// ========= Context =============== //
export interface SequenceMatchingContext {
  sequenceLength: number;
  files?: any[];
}

// ========= State =============== //
interface UploadScansState {
  value: "upload scans";
  context: SequenceMatchingContext;
}

interface SeqMState {
  value: "seqM";
  context: SequenceMatchingContext;
  states: {
    "download results": {
      states: {
        step1: {};
        step2: {};
      };
    };
  };
}

export type SequenceMatchingState = UploadScansState | SeqMState;

// ========= Event =============== //
interface UploadCompletedEvent {
  type: "upload completed";
}

interface UpdateFormEvent {
  type: "update form";
  sequenceLength: number;
  files: any[];
}

interface RunAnalysisEvent {
  type: "run analysis";
}

interface BackEvent {
  type: "back";
}

interface SelectSequenceLength {
  type: "select sequence length";
  sequenceLength: number;
  files: any[];
}

interface RestartEvent {
  type: "restart";
}

export type SequenceMatchingEvent =
  | UploadCompletedEvent
  | UpdateFormEvent
  | RunAnalysisEvent
  | BackEvent
  | SelectSequenceLength
  | RestartEvent;
