import * as React from "react";
import { useParams } from "react-router-dom";
import {
  ProcessDataSet,
  Range,
  ResolutionKey,
} from "./state_machine/monitoringPageTypes";
import LineChart from "./components/charts/LineChart";
import PauseAndPlayAndDownloadIcon from "./components/PauseAndPlayIcon";
import { XAxisComponent } from "./components/ChangeAxisIcons";
import ChangeChartResolutionDropdownComponent from "./components/ResolutionDropdownComponent";
import RealTimePlot from "./models/realTimePlot";
import { ButtonState, ButtonStateType } from "../../components/buttons/Button";
import toastFactory, {
  MessageSeverity,
} from "../../components/alert_message/ToastMessage";
import AlertButtonComponent from "./components/AlertButtonComponent";

//TODO: add the request for small data when the data requested is small

export default function SingleStream(props: {}) {
  // grab the sensorTopic from the url of the single stream page
  let { sensorTopic } = useParams();
  if (sensorTopic === undefined) {
    sensorTopic = "";
  }

  // set the global variables
  const [realTimePlot, setRealTimePlot] = React.useState(new RealTimePlot());
  const [dataset, setDataset] = React.useState<ProcessDataSet>([]);
  const [maxNumberOfDataPointsToDisplay, setMaxNumberOfDataPointsToDisplay] =
    React.useState<number>(80);
  const [dataStreamPaused, setDataStreamPaused] = React.useState<boolean>(false);
  const [resolution, setResolution] = React.useState<ResolutionKey>("seconds");
  const [range, setRange] = React.useState<Range>(["minutes", 2]);
  const [alertValue, setAlertValue] = React.useState<number | undefined>(undefined);
  const [buttonsState, setButtonsState] = React.useState<ButtonStateType>(
    ButtonState.IDLE
  );

  React.useEffect(() => {
    // if the resolution is in seconds and they request over 20 days worth of data throw an error
    if (resolution === "seconds" && range[0] === "days" && range[1] > 2) {
      toastFactory(
        "Data requested is too large to display, resolution moved to minutes",
        MessageSeverity.ERROR
      );
      setResolution("minutes");
    }

    // request historical data every time the range or the resolution change automatically
  const getHistoricalData = async () => {
      // setDataStreamPaused(true);

      setButtonsState(ButtonState.LOADING);
      const newData = await realTimePlot.requestLargeData(
        sensorTopic as string,
        range,
        resolution
      );

      if (newData) {
        setButtonsState(ButtonState.SUCCESS);
        setDataset(
          realTimePlot.updateSensorData(sensorTopic as string, newData, dataset)
        );
      } else {
        setButtonsState(ButtonState.ERROR);
        toastFactory(
          "An error was found when requesting the data",
          MessageSeverity.ERROR
        );
      }
    };

    getHistoricalData();

    // stream data in real tim every time the dataStream is not paused
    if (!dataStreamPaused) {
      setRealTimePlot(
        realTimePlot.connectToSensorData(
          sensorTopic as string,
          (newDataset) => setDataset(newDataset),
          dataset,
          alertValue,
          setDataStreamPaused,
          setAlertValue
        )
      );
    } else {
      // if the data stream is paused allow for more data to be displayed on the screen
      setMaxNumberOfDataPointsToDisplay(100_000);
    }

    return () => {
      realTimePlot.disconnectFromSensorsData();
    };
  }, [dataStreamPaused, range, resolution, alertValue]);

  return (
    <div className="h-screen w-[60%] flex items-center justify-center">
      <div className="w-8 h-1/2 pb-[90px] pt-[12px] hidden md:block"></div>
      <div className="w-full min-w-[300px] md:min-w-[760px] h-1/2 flex flex-col pr-8">
        <LineChart
          alertValue={alertValue}
          dataSet={dataset}
          title={realTimePlot.convertSensorTopicToSensorName(sensorTopic)}
          resolution={resolution}
          maxDataPoints={maxNumberOfDataPointsToDisplay}
        />
        <div className="w-full justify-end hidden md:flex">
          <ChangeChartResolutionDropdownComponent
            currentResolution={resolution}
            setCurrentResolution={setResolution}
            resolutionOptions={realTimePlot.resolutionOptions}
          />
        </div>
        <div className="w-full hidden md:flex justify-start">
          <XAxisComponent
            xAxisRanges={realTimePlot.rangeOptions}
            xAxisResolutions={realTimePlot.resolutionOptions}
            currentRange={range}
            buttonState={buttonsState}
            currentResolution={range[0]}
            setCurrentRange={setRange}
          />
          <AlertButtonComponent
            isAlertValueSet={alertValue !== undefined}
            onRemoveAlertValue={() => setAlertValue(undefined)}
            onChangeAlertValue={(e) =>
              setAlertValue(realTimePlot.handleChangeAlertValue(e))
            }
          />
        </div>
      </div>
      <div className="w-24 h-1/2 pb-[65px] pt-[12px] hidden md:block">
        <PauseAndPlayAndDownloadIcon
          dataStreamPaused={dataStreamPaused}
          setDataStreamPaused={setDataStreamPaused}
          setResolution={setResolution}
          channel={realTimePlot.getDataChannelFromDataSet(sensorTopic, dataset)}
        />
      </div>
    </div>
  );
}
