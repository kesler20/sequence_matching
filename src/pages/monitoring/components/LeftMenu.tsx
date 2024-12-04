import * as React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import useStateStyleContext from "../../../contexts/StyleContextProvider";
import {
  MdSignalWifiConnectedNoInternet4,
  MdSignalWifiStatusbarConnectedNoInternet4,
} from "react-icons/md";
import { Switch } from "@material-ui/core";
import {
  LabEquipmentActivity,
  LabEquipmentComponent,
  LabEquipmentFromBackend,
  LabFromBackend,
  SensorVisibility,
} from "../state_machine/monitoringPageTypes";

function FirstDrawer(props: {
  lab: LabFromBackend;
  setCurrentLabEquipment: (labEquipment: LabEquipmentComponent) => void;
  setOpenSecondDrawer: (isOpenSecondDrawer: boolean) => void;
  labEquipmentActivity: LabEquipmentActivity[];
}) {
  const { setSidebarIconMonitoringClicked } = useStateStyleContext();

  const handleSelectedLabEquipment = (labEquipment: LabEquipmentComponent) => {
    props.setCurrentLabEquipment(labEquipment);
    props.setOpenSecondDrawer(true);
  };

  /**
   * add the property is active to lab equipment from backend type
   */
  const convertLabEquipmentFromBackendToComponent = (
    labEquipment: LabEquipmentFromBackend,
    labEquipmentActivity: LabEquipmentActivity[]
  ): LabEquipmentComponent => {
    const { isActive } = labEquipmentActivity.filter(
      (activeLabEquipment) => activeLabEquipment.name === labEquipment.name
    )[0];
    return { ...labEquipment, isActive };
  };

  return (
    <div
      className={`
  min-h-screen w-[180px] md:w-[220px]
  absolute top-0 left-0 mt-[80px] pl-2
  flex flex-col items-center justify-start
  overflow-y-auto
  bg-primary text-white shadow-xl
  border-r-2 border-default-color 
  `}
    >
      {/* container of the first drawer */}
      <div className="flex w-full justify-end p-4">
        {/* top arrow icon first drawer */}
        <div
          className={`
      w-[40px] h-[40px]
      rounded-full
      flex items-center justify-center
      slide-in-left-fade-in-fast hover:cursor-pointer
      bg-fourth-color
      `}
          onClick={() => setSidebarIconMonitoringClicked(false)}
        >
          <AiOutlineArrowLeft className="text-tertiary rotate-arrow" size={20} />
        </div>
      </div>
      {/* Name of the category at the top of the first drawer */}
      <p className="paragraph-text">{`${props.lab.name} - ${props.lab.location}`}</p>
      {/* List of lab equipments */}
      {props.lab.lab_equipments.map((labEquipment, index) => {
        return (
          <div
            key={index}
            className={`
        w-full h-24 
        flex items-center justify-between pr-4 
        slide-in-left-fade-in-fast
        `}
            onClick={() =>
              handleSelectedLabEquipment(
                convertLabEquipmentFromBackendToComponent(
                  labEquipment,
                  props.labEquipmentActivity
                )
              )
            }
          >
            <p className="text-tertiary hover:cursor-pointer">{labEquipment.name}</p>
            {props.labEquipmentActivity.filter(
              (activeLabEquipment) => activeLabEquipment.name === labEquipment.name
            )[0].isActive ? (
              <MdSignalWifiStatusbarConnectedNoInternet4 color="rgb(30, 172, 75)" />
            ) : (
              <MdSignalWifiConnectedNoInternet4 color="rgb(157,130,134)" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SecondDrawer(props: {
  setOpenSecondDrawer: (isSecondDrawerOpen: boolean) => void;
  labEquipment: LabEquipmentFromBackend | undefined;
  sensorVisibility: SensorVisibility[];
  onChangeInSensorVisibility: (sensorName: string, visibility: boolean) => void;
}) {
  return (
    <div
      className={`
      min-h-screen w-[200px] md:w-[245px]
      absolute top-0 left-[180px] md:left-[220px] mt-[80px] pl-2
      flex flex-col items-center justify-start
      overflow-y-auto
      bg-primary text-white shadow-xl
      border-r-2 border-default-color 
      `}
    >
      {/* second drawer container  */}
      <div className="flex w-full justify-end p-4">
        {/* top arrow in second drawer */}
        <div
          className={`
          w-[40px] h-[40px]
          rounded-full
          flex items-center justify-center
          slide-in-left-fade-in-fast hover:cursor-pointer
          bg-fourth-color
          `}
          onClick={() => props.setOpenSecondDrawer(false)}
        >
          <AiOutlineArrowLeft className="text-tertiary rotate-arrow" size={20} />
        </div>
      </div>
      {/* category (lab equipment) in second drawer */}
      <div className="h-20 flex items-start w-full pl-6">
        <p className="paragraph-text">{props.labEquipment?.name}</p>
      </div>
      {/* list of sensors on the second drawer */}
      {props.labEquipment?.sensors.map((sensor, sensor_id) => {
        return (
          <div
            key={sensor_id}
            className={`
      w-full h-20 
      flex flex-col items-start justify-center pl-4 
      slide-in-left-fade-in-fast
      `}
          >
            <p className="text-tertiary hover:cursor-pointer pl-2">{sensor.name}</p>
            {props.sensorVisibility.filter(
              (visibleSensor) => visibleSensor.name === sensor.name
            )[0].isVisible ? (
              <Switch
                defaultChecked
                color={"primary"}
                onClick={() => props.onChangeInSensorVisibility(sensor.name, false)}
              />
            ) : (
              <Switch
                color={"primary"}
                onClick={() => props.onChangeInSensorVisibility(sensor.name, true)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LeftMenu(props: {
  lab: LabFromBackend;
  onChangeInSensorVisibility: (sensor_name: string, visibility: boolean) => void;
  labEquipmentActivity: LabEquipmentActivity[];
  sensorVisibility: SensorVisibility[];
}) {
  const { sidebarIconMonitoringClicked } = useStateStyleContext();
  // this value is set by the sidebar to true when the monitoring page icon button is clicked
  const [openFirstDrawer, setOpenFirstDrawer] = React.useState(
    sidebarIconMonitoringClicked
  );
  const [openSecondDrawer, setOpenSecondDrawer] = React.useState(false);
  const [currentLabEquipment, setCurrentLabEquipment] = React.useState<
    LabEquipmentFromBackend | undefined
  >(undefined);

  React.useEffect(() => {
    setOpenFirstDrawer(sidebarIconMonitoringClicked);
  }, [sidebarIconMonitoringClicked]);

  const onChangeInSensorVisibility = (sensorName: string, visibility: boolean) => {
    props.onChangeInSensorVisibility(sensorName, visibility);
  };

  return openFirstDrawer ? (
    // first drawer
    <>
      <FirstDrawer
        lab={props.lab}
        setCurrentLabEquipment={setCurrentLabEquipment}
        setOpenSecondDrawer={setOpenSecondDrawer}
        labEquipmentActivity={props.labEquipmentActivity}
      />
      {openSecondDrawer ? (
        // second drawer
        <SecondDrawer
          setOpenSecondDrawer={setOpenSecondDrawer}
          labEquipment={currentLabEquipment}
          sensorVisibility={props.sensorVisibility}
          onChangeInSensorVisibility={onChangeInSensorVisibility}
        />
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
}
