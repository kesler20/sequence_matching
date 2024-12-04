import * as React from "react";
import { useParams } from "react-router-dom";
import {
  ProcessDataChannel,
  ProcessDataPoint,
  ProcessDataSet,
  Range,
  ResolutionKey,
} from "../monitoring/state_machine/monitoringPageTypes";
import LineChart from "../monitoring/components/charts/LineChart";
import PauseAndPlayAndDownloadIcon from "../monitoring/components/PauseAndPlayIcon";
import { XAxisComponent } from "../monitoring/components/ChangeAxisIcons";
import ChangeChartResolutionDropdownComponent from "../monitoring/components/ResolutionDropdownComponent";
import RealTimePlot from "../monitoring/models/realTimePlot";
import { ButtonState, ButtonStateType } from "../../components/buttons/Button";
import toastFactory, {
  MessageSeverity,
} from "../../components/alert_message/ToastMessage";
import AlertButtonComponent from "../monitoring/components/AlertButtonComponent";
import MQTTApi from "../../apis/mqtt/MQTTApi";
import LineChartSoftSensor from "../monitoring/components/charts/LineChartSoftSensor";
//TODO: add the request for small data when the data requested is small

export default function SoftSensor(props: {}) {
  // grab the sensorTopic from the url of the single stream page
  const sensorTopic = "softsensor";

  // set the global variables
  const [realTimePlot, setRealTimePlot] = React.useState(new RealTimePlot());
  const [dataset, setDataset] = React.useState<ProcessDataSet>([]);
  const [maxNumberOfDataPointsToDisplay, setMaxNumberOfDataPointsToDisplay] =
    React.useState<number>(120);
  const [dataStreamPaused, setDataStreamPaused] = React.useState<boolean>(false);
  const [resolution, setResolution] = React.useState<ResolutionKey>("seconds");
  const [range, setRange] = React.useState<Range>(["minutes", 2]);
  const [alertValue, setAlertValue] = React.useState<number | undefined>(undefined);
  const [buttonsState, setButtonsState] = React.useState<ButtonStateType>(
    ButtonState.IDLE
  );

  React.useEffect(() => {
    const messageBus = new MQTTApi();

    messageBus.subscribeClient(sensorTopic, () => {});
    messageBus.onMessage(sensorTopic, (message: string) => {
      const msg = JSON.parse(message);
      const dataSet: ProcessDataPoint[] = msg.data.map(
        (Value: number, index: number) => {
          return { Value, Timestamp: index };
        }
      );
      setDataset((prevState: ProcessDataSet) => {
        return [
          ...prevState,
          { name: `mRNA Yield Curve ${prevState.length}`, data: dataSet },
        ];
      });
    });

    return () => {
      messageBus.unsubscribeClient(sensorTopic);
    };
  }, []);
  return (
    <div className="h-screen w-[60%] flex items-center justify-center">
      <div className="w-8 h-1/2 pb-[90px] pt-[12px] hidden md:block"></div>
      <LineChartSoftSensor
        dataSet={dataset}
        title={"RNA Yield"}
        maxDataPoints={maxNumberOfDataPointsToDisplay}
      />
    </div>
  );
}
