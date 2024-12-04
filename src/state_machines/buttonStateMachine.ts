import { assign, createMachine, Typestate } from "xstate";


export const buttonStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCECuAXdB7AdgAgGV0BDdMPAWWIGMALASxzADp6IAbMAYllQCMAtvXQBtAAwBdRKAAOWWMPq5pIAB6IALAE4tzAKwaAbAHYTARgDMhjRYAchgDQgAnogtndYr2IBMx28aBxu6GAL6hTmiYuIQkZJQ0DEzM7FjEEIxQXBC4LIwAblgA1ixR2PhEpORUdIwsqemZCAVY1KRKOOISXSpyCugdKuoIWu7MZnqGZsZithpmhhZ6Fk6uCPO6AXpiVsY+ZrYWYsbhkRjlsVUJtckNGThZYABOT1hPzDLspABmbwLMZRilXiNSS9TS9ygzRwhTaA1wXR6SBAfUUymRwz0PjEzAsWjEGj0Wg09g0YkMelWiFsOO2XmmWlsWixew0pxAgIqcWqiTqzF41GocFgXCecBIT1Ekl68jROCGiDMXk8Rls+yJYmZOipCA8tmYPjpeKxZksWjMPnZnMuIN5yWeryeovFxElSNksvh8oxiopzB0Oj0HksBPNKxcbiV-oWMymARpelsVvOQO51zBzAdbx4-CEUqkyNRXoVur9AeZwaO2ksOpsumMdIOtkOyr0enCERAOCwEDgKmtwJ5NzAMv6gx9CAAtI4I1O9P7y-itIsyToLMnolyrqC+WxOKO5SWLA39EZTMZLNY7DO1u4zMx5oZDMSDBo67Z252B2md7cIZkD2LCcL08UZrH2KwbHsHVjVxBtfB2Iw7CMNkvxTLdbWHflUEFYVAPHUBhlNfYDR2AlDB8VVTVrSwDXNQwaQJTVEyTNDNxtIcMyzJ58PRQjNB8GDZmjJ8PwMZdTB8dcOyAA */
  id : "Button State Machine",

  states: {
    idle: {
      on: {
        submit: {
          target: "loading",
          cond: "canSubmit"
        }
      }
    },

    loading: {
      invoke: {
        src: "sendRequest",
        onDone: "success",
        onError: "error"
      }
    },

    success: {
      on: {
        restart: "idle"
      }
    },

    error: {
      on: {
        restart: "idle",

        submit: {
          target: "loading",
          cond: "canSubmit"
        }
      }
    }
  },

  initial: "idle"
})

