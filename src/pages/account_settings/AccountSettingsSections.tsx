import React from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { textColor } from "../../global_styles/colorPalette";
import CustomTextField from "../../components/text_field/CustomTextField";
import IosSwitch from "../../components/switches/IosSwitch";

export type AccountSettingSection = {
  header: string;
  content: React.ReactNode;
};

export const profileInformationSection: AccountSettingSection = {
  header: "Profile Information",
  content: (
    <>
      <div
        className={`
    w-full 
    flex items-center justify-start 
    mb-4
    `}
      >
        <RiAccountCircleFill size={"50"} color={textColor} />
        <p className={`paragraph-text pl-4`}>demo-user</p>
      </div>

      <div
        className={`
      w-full 
      flex items-start justify-start flex-col
      mt-4 
      `}
      >
        <div className="flex flex-col">
          <p className="paragraph-text mb-4">Username</p>
          <CustomTextField placeHolderText="demo-user" inputType="text" />
        </div>
        <div className="flex flex-col mt-4">
          <p className="paragraph-text mb-4">Email</p>
          <CustomTextField placeHolderText="wizapp4.0@gmail.com" inputType="email" />
        </div>
      </div>
    </>
  ),
};


// TODO: set the logic of the notification section on a state machine.
export const notificationPreferenceSection: AccountSettingSection = {
  header: "Notification Preference",
  content: (
    // notification section grid container
    <div
      className={`
  w-full
  grid grid-cols-3 
  ml-4
  `}
    >
      {/* first column */}
      <div
        className={`
    w-full
    col-span-2
    mt-2
    `}
      >
        <p className="paragraph-text mb-6">Via Email</p>
        <p className="paragraph-text mb-6">Via Push Notifications</p>
        <p className="paragraph-text mb-6">Admin messages & feature updates</p>
        <p className="paragraph-text mb-6">Sensor connect & disconnect messages</p>
      </div>

      {/* second column */}
      <div
        className={`
    w-full
    `}
      >
        <div className="mb-2">
          <IosSwitch />
        </div>
        <div className="mb-2">
          <IosSwitch />
        </div>
        <div className="mb-2">
          <IosSwitch />
        </div>
        <div className="mb-2">
          <IosSwitch />
        </div>
      </div>
    </div>
  ),
};

export default function accountSettingsSections() {
  return [profileInformationSection, notificationPreferenceSection];
}
