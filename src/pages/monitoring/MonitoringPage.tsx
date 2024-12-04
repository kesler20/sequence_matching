import React from "react";
import {
  getAllLabEquipment,
  getAllSensors,
  getLaboratory,
} from "../../apis/requests";
import LeftMenu from "./components/LeftMenu";
import MQTTApi from "../../apis/mqtt/MQTTApi";
import useStateStyleContext from "../../contexts/StyleContextProvider";
import { useStoredValue } from "../../apis/customHooks";
import {
  GetProcessDataFromRedis,
  LabEquipmentActivity,
  LabEquipmentFromBackend,
  LabFromBackend,
  ProcessDataSet,
  ProcessDataChannel,
  SensorComponent,
  SensorFromBackend,
  SensorVisibility,
} from "./state_machine/monitoringPageTypes";
import AreaChart from "./components/charts/AreaChart";
import { labInitialState } from "./state_machine/monitoringInitalStates";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { HiOutlineMinusCircle } from "react-icons/hi";

export default function MonitoringPage() {
  const { windowWidth } = useStateStyleContext();

  // the lab data structure contains all the information from the network
  // this is a named collection of lab equipments which are named collections of sensors accordingly
  // sensors can be visible or not depending on user preference or filters,
  // when lab equipments are not online the sensors within the lab will not be accessible.
  const [lab, setLab] = useStoredValue<LabFromBackend>(
    labInitialState,
    "lab_config"
  );
  const [labEquipments, setLabEquipments] = useStoredValue<
    LabEquipmentFromBackend[]
  >([], "lab_equipments");
  const [sensors, setSensors] = useStoredValue<SensorFromBackend[]>([], "sensors");
  const [processData, setProcessData] = useStoredValue<ProcessDataSet>(
    [],
    "process_data"
  );
  const [sensorVisibilities, setSensorVisibilities] = useStoredValue<
    SensorVisibility[]
  >([], "sensor_visibility");
  const [labEquipmentActivity, setLabEquipmentActivity] = useStoredValue<
    LabEquipmentActivity[]
  >([], "lab_equipments_activity");

  React.useEffect(() => {
    sensors.forEach((sensor) => {
      const { name } = sensor;
      const isVisible = true;
      setSensorVisibilities((prevSensorVisibilities) => {
        return [...prevSensorVisibilities, { name, isVisible }];
      });
    });

    labEquipments.forEach((labEquipment) => {
      const { name } = labEquipment;
      const isActive = true;
      setLabEquipmentActivity((prevLabActivity) => {
        return [...prevLabActivity, { name, isActive }];
      });
    });
  }, []);

  // get the sensors and the lab equipment when the component mounts
  // these can then be used to form the lab data structure.
  React.useEffect(() => {
    getSensorsFromBackend();
    getLabEquipmentsFromBackend();
    getLaboratoryFromBackend();
  }, []);

  // update the initial plot when more data is found in the network.
  //subscribe to the topic where each sensor is broadcasting data
  // connect to the redis client to get the response of the get request
  // for the real time process data stored
  React.useEffect(() => {
    const messageBus = new MQTTApi();

    messageBus.onConnect(() => {
      // ----------- SENSORS ------------- //
      sensors.forEach((sensor: any) => {
        const sensorTopic = sensor.topic.replaceAll(":", "/").replaceAll(".", "/");

        // send a et request to the redis client for the process data
        messageBus.publishMessage("redis_commands", {
          COMMAND: "GET",
          KEY: sensorTopic,
          RANGE: { minutes: 2 },
          RESOLUTION: null,
        });
      });

      // ----------- REDIS ------------- //
      messageBus.subscribeClient("redis_response", () => {});
      messageBus.onMessage("redis_response", (message: string) => {
        const rawProcessDataFromRedis: GetProcessDataFromRedis = JSON.parse(message);
        let processDataChannel: ProcessDataChannel = {
          name: rawProcessDataFromRedis.KEY.split("/")[
            rawProcessDataFromRedis.KEY.split("/").length - 1
          ],
          data: JSON.parse(rawProcessDataFromRedis.VALUE),
        };

        setProcessData((prevProcessData: ProcessDataChannel[]) => {
          let filteredPrevProcessData = prevProcessData.filter(
            (prevProcessDataChannel) =>
              prevProcessDataChannel.name !== processDataChannel.name
          );
          if (processDataChannel.data.length > 1) {
            return [...filteredPrevProcessData, processDataChannel];
          } else {
            return [...filteredPrevProcessData];
          }
        });
      });
    });

    return () => {
      // unsubscribe from the redis client when the component unMounts
      messageBus.unsubscribeClient("redis_response").disconnectClient();
    };
  }, []);

  const getSensorsFromBackend = async () => {
    const newSensors: any = await getAllSensors();
    if (newSensors !== undefined) {
      setSensors(newSensors);
    }
  };

  const getLabEquipmentsFromBackend = async () => {
    const equipment: any = await getAllLabEquipment();
    if (equipment !== undefined) {
      setLabEquipments(equipment);
    }
  };

  const getLaboratoryFromBackend = async () => {
    const response = await getLaboratory(1);
    if (response !== undefined) {
      setLab(response);
    }
  };

  /**
   * add the property is visible to sensor from backend type
   */
  const convertSensorFromBackendToComponent = (
    sensor: SensorFromBackend,
    sensorVisibilities: SensorVisibility[]
  ): SensorComponent => {
    const { isVisible } = sensorVisibilities.filter(
      (activeSensor) => activeSensor.name === sensor.name
    )[0];
    return { ...sensor, isVisible };
  };

  const getProcessDataChannelFromData = (
    channelName: string
  ): ProcessDataChannel => {
    return processData.filter(
      (processDataChannel) => processDataChannel.name === channelName
    )[0];
  };

  const handleChangeInSensorVisibility = (
    sensorName: string,
    visibility: boolean
  ) => {
    setSensorVisibilities((prevSensorVisibilities) => {
      return prevSensorVisibilities.map((prevSensorVisibility) => {
        if (prevSensorVisibility.name === sensorName) {
          prevSensorVisibility.isVisible = visibility;
        }
        return prevSensorVisibility;
      });
    });
  };

  return (
    <div className="p-4 md:w-[70%] min-h-screen h-full overflow-y-hidden">
      <LeftMenu
        lab={lab}
        onChangeInSensorVisibility={handleChangeInSensorVisibility}
        labEquipmentActivity={labEquipmentActivity}
        sensorVisibility={sensorVisibilities}
      />
      {/* Outer grid of the plots this becomes 1 column in smaller screens */}
      <div
        className={
          windowWidth <= 624
            ? "flex flex-col items-center justify-center"
            : "grid grid-cols-2 gap-4"
        }
      >
        {lab.lab_equipments.map((labEquipment, lab_equipment_id) => {
          return labEquipment.sensors.map((sensorFromBackend, sensorId) => {
            const sensorComponent = convertSensorFromBackendToComponent(
              sensorFromBackend,
              sensorVisibilities
            );
            const channel = getProcessDataChannelFromData(sensorFromBackend.name);

            return sensorComponent.isVisible ? (
              <div
                key={`${lab_equipment_id}-${sensorId}`}
                className="h-60 w-[300px] md:w-full m-4"
              >
                <div className="flex m-2">
                  <OpenInNewIcon
                    className="cursor-pointer mr-2"
                    color={"info"}
                    onClick={() =>
                      window.open(`/stream/${sensorFromBackend.topic}`, "_blank")
                    }
                  />
                  <HiOutlineMinusCircle
                    color="rgb(0,136,209)"
                    size={"22"}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeInSensorVisibility(sensorFromBackend.name, false)
                    }
                  />
                </div>
                <AreaChart
                  newData={channel === undefined ? [] : channel.data}
                  title={sensorFromBackend.name}
                  sensorFromBackend={sensorFromBackend}
                />
              </div>
            ) : null;
          });
        })}
      </div>
    </div>
  );
}
