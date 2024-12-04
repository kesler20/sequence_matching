import { channel } from "diagnostics_channel";
import {
  ProcessDataChannel,
  ProcessDataPoint,
  ProcessDataSet,
  Range,
  RangeValues,
  ResolutionKey,
} from "../state_machine/monitoringPageTypes";
import { getProcessData, getProcessDataSet } from "../../../apis/requests";
import MQTTApi from "../../../apis/mqtt/MQTTApi";
import { SetStateAction } from "react";

/**
 * this class is used to manipulate ProcessDataChannels more dynamically
 */
export default class RealTimePlot {
  messageBus: MQTTApi;
  rangeOptions: RangeValues[];
  resolutionOptions: ResolutionKey[];
  alertValue: number;

  constructor() {
    this.messageBus = new MQTTApi();
    this.rangeOptions = ["2", "20", "200"];
    this.resolutionOptions = ["seconds", "minutes", "hours", "days"];
    this.alertValue = 0;
  }

  convertSensorTopicToSensorName(sensorTopic: string) {
    return sensorTopic?.split(".")[sensorTopic.split(".").length - 1];
  }

  private convertResolutionIntoAValue(resolution: ResolutionKey) {
    switch (resolution) {
      case "seconds":
        return null;
      case "minutes":
        return 60_000;
      case "hours":
        return 60 * 60_000;
      case "days":
        return 24 * 60 * 60_000;
      default:
        return null;
    }
  }

  getDataChannelFromDataSet(sensorTopic: string, dataset: ProcessDataSet) {
    const sensorName = this.convertSensorTopicToSensorName(sensorTopic);
    return dataset.filter((dataChannel) => dataChannel.name === sensorName)[0];
  }

  addChannelToDataSet(channel: ProcessDataChannel, dataset: ProcessDataSet) {
    dataset.push(channel);
    return dataset;
  }

  removeChannelToDataSet(channelName: string, dataset: ProcessDataSet) {
    return dataset.filter((channel) => channel.name !== channelName);
  }

  addDataPointToChannel(
    sensorTopic: string,
    Timestamp: number,
    Value: number,
    dataset: ProcessDataSet
  ) {
    const sensorName = this.convertSensorTopicToSensorName(sensorTopic);
    if (dataset.length === 0) {
      dataset.push({ name: sensorName, data: [{ Timestamp, Value }] });
    }
    dataset = dataset.map((dataChannel) => {
      if (dataChannel.name === sensorName) {
        dataChannel.data.push({ Timestamp, Value });
      }
      return dataChannel;
    });
    return dataset;
  }

  updateSensorData(
    sensorTopic: string,
    data: ProcessDataPoint[],
    dataset: ProcessDataSet
  ) {
    const sensorName = this.convertSensorTopicToSensorName(sensorTopic);
    if (dataset.length === 0) {
      dataset.push({ name: sensorName, data });
    }
    dataset = dataset.map((dataChannel) => {
      if (dataChannel.name === sensorName) {
        dataChannel.data = data;
      }
      return dataChannel;
    });
    return dataset;
  }

  connectToSensorData = (
    sensorTopic: string,
    updateDataSetCallBack: (dataset: ProcessDataSet) => void,
    dataset: ProcessDataSet,
    alertValue: number | undefined,
    setDataStreamPaused: React.Dispatch<SetStateAction<boolean>>,
    setAlertValue: React.Dispatch<SetStateAction<number | undefined>>
  ) => {
    // ---------- LISTEN TO REAL TIME DATA CHANNELS ----------- //
    // subscribe to each sensorTopic to get real-time data
    this.messageBus.subscribeClient("testiot", () => {});

    this.messageBus.onMessage("testiot", (message: string) => {
      const msg = JSON.parse(message);
      if (sensorTopic === msg["OPC Point"]) {
        updateDataSetCallBack(
          this.addDataPointToChannel(sensorTopic, msg.Timestamp, msg.Value, dataset)
        );
        const lastValue = msg["Value"];
        if (typeof alertValue === "number" && lastValue > alertValue) {
          setDataStreamPaused(true);
          this.messageBus.publishMessage("event_log", {
            timestamp: new Date().getTime(),
            description: `${sensorTopic} has reached the alert value: Current Value ${lastValue}, Alert Value: ${alertValue}`,
          });
          setAlertValue(undefined);
        }
      }
    });

    return this;
  };

  disconnectFromRedis() {
    this.messageBus.unsubscribeClient("redis");
    return this;
  }

  disconnectFromSensorsData() {
    this.messageBus.unsubscribeClient("testiot");
    return this;
  }

  connectToSensorsData = (
    sensorTopics: string[],
    dataStreamPaused: boolean,
    updateDataSetCallBack: (dataset: ProcessDataSet) => void,
    dataset: ProcessDataSet
  ) => {
    // ---------- LISTEN TO REAL TIME DATA CHANNELS ----------- //
    // subscribe to each sensorTopic to get real-time data
    this.messageBus.subscribeClient("testiot", () => {});

    this.messageBus.onMessage("testiot", (message: string) => {
      const msg = JSON.parse(message);
      if (!dataStreamPaused && sensorTopics.includes(msg["OPC Point"])) {
        updateDataSetCallBack(
          this.addDataPointToChannel(
            msg["OPC Point"],
            msg.Timestamp,
            msg.Value,
            dataset
          )
        );
      }
    });

    return this;
  };

  requestLargeData = async (
    sensorTopic: string,
    range: Range,
    resolution: ResolutionKey
  ) => {
    const historicalData = await getProcessData(
      sensorTopic,
      range[0],
      range[1],
      this.convertResolutionIntoAValue(resolution)
    );

    return historicalData;
  };

  requestLargeDataSet = async (
    sensorTopics: string[],
    range: Range,
    resolution: ResolutionKey
  ) => {
    const historicalData = await getProcessDataSet(
      sensorTopics,
      range[0],
      range[1],
      this.convertResolutionIntoAValue(resolution)
    );

    if (historicalData) {
      return historicalData;
    } else {
      return [];
    }
  };

  requestSmallData = (sensorTopics: string) => {
    return this;
  };

  requestSmallDataSet = (sensorTopics: string[]) => {
    return this;
  };

  handleChangeAlertValue(e: React.ChangeEvent<HTMLInputElement>) {
    let value = parseFloat(e.target.value);
    if (Number.isNaN(value)) {
      value = parseInt(e.target.value);
    }

    return value;
  }
}
