import { assign, createMachine, Typestate } from "xstate";
import RealTimePlot from "../models/realTimePlot";

type UpdateSensorTopicEvent = {
  value: string;
};

export const singleStreamPageMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUCWA7KAbMACWALgE5gCGAtrgA6kwDEEqsAxgPbrpjMG4BmRrSrDDpYrIrgKsqqZgG0ADAF1EoKq1ioCqdqpAAPRAFoATAA4AbABoQAT0QmLAZgB0FhQEYArGacWAnAoA7E4eHgC+4TZomDj4xGSUNPQAIkxsHFw8-IK4JIywiipIIOqa2rolhghGTk4ALDb2CBb1bp4+foEhYZHRGNh4hCQU1LRgLsOJA7gQpASkdDQArsJFemVaOuh61R4Kji4eQR6WQUFejv5BZk2IYUEuJgqh9V6t9UEKFpZ9IDGDeIjJLjSYJCgzOYLBisADu6CwrFIEFm81I6xKmwqOyq9wOFiOJzOFyuNzuCA8FkeX1CfnqB28QX8Jj+ALiU1GyQmHPIkLRdBIAEdlnAeFDSJNyKQsFgMWoNFtKqBqmZji4zF5vCYnF56nqFL5yQEXBcFAy3j9nqdWQN2eCQTAXOKgYkxqtIEssKRbHLSgrsbt7pS2hr-F1KR4TIzyVGzE8XpGTl5-O4zGGbbEhvaxo7nTy3cIIAKwMLRaiFpLpbLlBt-dtAxSnGaXMzjmZvsyzXVyaF1ZHNf4wt4FJ8PE4M4D81ynWiXZzSO6i0KRYRcOWJV6iDBfVj67iKQofG4iZ8TGH8TG0y43rS2wbfPUJ3bgTmJsvRXzoRB2BMMAA3VgAGsJjZLMX2nd9CE-UgEH-VhmHmbYih3OslQMRBdTafxsOuEwLn8MwNRMcl6mNGlKX8N48MHSinzA10IJLFdtEwdc6DAIgBCIFwqC9AheHEcgXFAucHTfJiP1Y8VYPQACEOxZCa0xVCcWVDC9RbHCgjw5NCMuEiwnjV4LGec5viCOjRNfFxllEZZmGYOBYF4ZYsHXPIJMIOhhHQFFeFIVAsGWEhcHIJzxhQ8o9zUg9DmOU4qRJAIyTsRB6X8E0E2TVptPqJwWSif5bXo+dc1nSCCEgfB7Mc5zXKwWxvJEFFYBqpzQvC7clPlKK0L2fFCQS85LmS25UoQUi42eUIzHMZl8rMR9CpEqdQVQCAcDoDJOG4SRWHwEQxAkcVIsVVT0IQTDNOw7T8L04jxspEwWy8WkmXqEwfDwyzVsddbNuWKgoSGQ7xD2mR5G6v1evOvYfmu-x3hTfKUwe5pDPqHDmRM5KPD1MxIkK9BWAgOA9BW7MuVrGGGwUckjCCAkzWZxl3F1FMfsp0EeWg6mzobXxnteyNtU1PxvA8cljgUTLaVaBkvCZAr+kzKzpzzLnFz5gN90jAijgUbGRe+Jwgil-KTQsd4GkPH4PtIznwNBCreeUmn93qMbmh1ONyKtrwXg+VpHYY0FbNahynJctznQq7Xoou4ajKHOofgsMcDJl6bE28FMDX8EPSomWPPMqlq2rqmVmh6-n9yT7OwlTywM-GybZdOObtXMJaVcnLm-o2sB476hxrmvHDRvy-Kpeca9hcPN5Mc9rxCfCIA */
    id: "Single stream page",

    context: {
      realTimePlot: new RealTimePlot(),
      sensorTopic: "",
    },

    states: {
      "streaming data": {
        on: {
          pause: "data stream paused",
          "download data": "data stream paused",

          "request data.small": {
            target: "streaming data",
            internal: true,
            actions: "requestSmallData",
          },
        },
      },

      "data stream paused": {
        on: {
          play: "streaming data",
          "request data.small": {
            target: "data stream paused",
            internal: true,
            actions: "requestSmallData",
          },

          "request  data.large": "requesting data",
        },
      },

      "requesting data": {
        invoke: {
          src: "requestLargeData",
          onError: "unsuccessful data request",
          onDone: "data requested succesfully",
        },

        description: `Requesting a large amount of data requiring an HTTP request, this is expected to block IO for a second or more`,
      },

      "unsuccessful data request": {
        on: {
          "send failure message": "data stream paused",
        },
      },

      "data requested succesfully": {
        on: {
          "send success message": "data stream paused",
        },
      },

      idle: {
        on: {
          "connect to sensor data": {
            target: "streaming data",
            description: `Initally subscribe to the testiot topic and only stream the data coming from the given sensorTopic`,
            actions: "connectToSensorData"
          },

          "update sensor topic": {
            target: "idle",
            internal: true,
            description: `Update the topic of the sensor initially when the new page opens up`,
            actions: "updateSensorTopic",
          },
        },
      },
    },

    initial: "idle",

    on: {
      "disconnect from sensor topic": {
        target: "#Single stream page",
        internal: true,
        description: `Disconnect from testiot`,
        actions: "disconnectFromSensors",
      },

      "Disconnect from redis": {
        target: "#Single stream page",
        internal: true,
        description: `Disconnect from the redis response topic`,
        actions: "disconnectFromRedis",
      },
    },
  },
);
