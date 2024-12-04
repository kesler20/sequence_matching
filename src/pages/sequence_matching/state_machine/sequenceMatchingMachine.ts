import { assign, createMachine, Typestate } from "xstate";
import { actions, guards } from "./sequenceMatchingUtils";
import {
  SequenceMatchingContext,
  SequenceMatchingEvent,
} from "./sequenceMatchingTypes";

export const sequenceMatching = createMachine<
  SequenceMatchingContext,
  SequenceMatchingEvent,
  Typestate<SequenceMatchingContext>
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzARwLIDoCuAHANgPYCGEABLAMbEB2sAxHkaWZYQLYFgAukA2gAYAuolC5CsAJbdJhGqJAAPRACYBAdkwqArAIEBmDQDYAHAEYjK-foA0IAJ6J9JlZgCc+9doAs19WYEXAwBfYLsUDBwCEnIqWgY8CGJeMgAzQgAndkERJBBxKRk5BWUEfW1Mayr9MwsTNyMjO0cEFXUBSp8VMxVvIzNPIzdQ8LQsCPR6DOwaMlpifHspWByFAulZeTzS9ory716agSHrFWanEwrfL1Nu7RUjA5GQCcwJ+gAjYkoAa1W89ZFLagUr6NyubzqcEHdpgszmc6tExGdxQqzqHQebwmATaZ6vd4ofBgSjcChobBgGiUMBkYk0KDcAAW-zEEg2xW2iB8+kw120PnBAlq6nUiJUJm8qLc8IEkIe3m0DXxY0wEEIAHcaMxyBk4Nh8NwGHrYNxiBluKz8uygSVEOY3JgjHLevD9JZRWcHIgzN4zHy3IHAwIrDDlWEXqr1VqdWQTQajZ9vn9hGsbZs7QgAsdMFCTvcXNparZvQhvAdMJcDoE7h5tOpQhGaIQIHAFBM04UM1yEABaHpOxpDkwmI76bwGRHaXlBwNGHy+d2+FWRJgxCjUOidjnApSIP2YeFWYVuATg+r6L0tTz+mo6LzlNzmFRuBsRgljbe2nvaR65l9WEY7Qvo0iLOBUHheIu-g1iE75Rpq2rrvGhrwAC6aciCiCvhUv46D4uK9KKYE4p01bzmYHgmP4RiNsEQA */
    id: "seqM",

    context: {
      sequenceLength: 0,
      files: undefined,
    },

    states: {
      "upload scans": {
        on: {
          "upload completed": {
            target: "seqM",
            cond: "scansUploaded",
          },

          "update form": {
            target: "upload scans",
            internal: true,
            actions: "updateContext",
          },
        },
      },

      seqM: {
        on: {
          "run analysis": {
            target: "download results",
            cond: "scansSelected",
          },

          back: {
            target: "upload scans",
            actions: "resetContext",
          },

          "select sequence length": {
            target: "seqM",
            internal: true,
            actions: "updateContext",
          },
        },
      },

      "download results": {
        on: {
          restart: {
            target: "upload scans",
            actions: "resetContext",
          },

          back: "seqM",
        },
      },
    },

    initial: "upload scans",
  },
  { guards: guards, actions: actions }
);
