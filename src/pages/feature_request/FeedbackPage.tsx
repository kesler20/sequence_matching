import React, { useRef } from "react";
import Header from "../../components/header/Header";
import { useState } from "react";
import Button, {
  ButtonState,
  ButtonStateType,
} from "../../components/buttons/Button";
import { CreateNotificationRequest } from "../../apis/schema";
import useStateApiDataContext from "../../contexts/ApiDataContextProvider";
import { createNotification } from "../../apis/requests";
import LoadingSpinner from "../../components/animated_components/LoadingSpinner";
import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";
import CustomTextField from "../../components/text_field/CustomTextField";
import CustomTextarea from "../../components/textarea/CustomTextarea";
import toastFactory, {
  MessageSeverity,
} from "../../components/alert_message/ToastMessage";

const FeedbackPage = () => {
  const { notifications, setNotifications } = useStateApiDataContext();
  const [createNotificationState, setCreateNotificationState] = useState(
    ButtonState.IDLE
  );
  const [notificationTitle, setNotificationTitle] = useState(
    `Feature request # ${notifications.length + 1}`
  );
  const [notificationDescription, setNotificationDescription] =
    useState("Default description");

  // send a post request to create a new notification on the backend
  const handleCreateNotification = async () => {
    toastFactory("Creating notification ...", MessageSeverity.SUCCESS);

    setCreateNotificationState(ButtonState.LOADING);

    const currentNotification = {
      title: notificationTitle,
      description: notificationDescription,
    };

    const response = await createNotification(currentNotification);
    if (response !== undefined) {
      // setNotifications((notifications: CreateNotificationRequest[]) => {
      //   return [...notifications, response];
      // });
      toastFactory(
        "Feature request submitted successfully",
        MessageSeverity.SUCCESS
      );
      setCreateNotificationState(ButtonState.SUCCESS);
    } else {
      toastFactory("Failed to submit your feature request", MessageSeverity.ERROR);
      setCreateNotificationState(ButtonState.ERROR);
    }
  };

  const resetState = () => {
    setCreateNotificationState(ButtonState.IDLE);
  };

  const handleDisplayButton = (buttonState: ButtonStateType) => {
    switch (buttonState) {
      case "idle":
        return (
          <Button
            inner="Submit"
            buttonType={buttonState}
            onClick={handleCreateNotification}
          />
        );
      case "loading":
        return <Button inner={<LoadingSpinner />} buttonType={buttonState} />;
      case "error":
        return (
          <Button
            inner={<RxCross1 color="red" onClick={resetState} />}
            onClick={resetState}
            buttonType={buttonState}
          />
        );
      case "success":
        return (
          <Button
            inner={<FaCheck color="white" className="w-26" onClick={resetState} />}
            onClick={resetState}
            buttonType={buttonState}
          />
        );
    }
  };

  return (
    <div className="flex md:items-start items-center justify-center flex-col min-h-screen h-full">
      <div className="flex justify-between items-center flex-col md:flex-row w-full pr-12">
        <Header title="Request a Feature" category="Feature Request" />
        {handleDisplayButton(createNotificationState)}
      </div>
      <div className="h-[100px] w-full flex items-center justify-center md:block">
        <CustomTextField
          inputType="text"
          placeHolderText="Enter a concise title"
          onChange={(e) => setNotificationTitle(e.target.value)}
        />
      </div>
      <p className="text-gray-400 text-lg pl-2 md:p-0">
        Describe the feature you would like
      </p>
      <p className="text-gray-400 text-lg text-left pl-12 md:p-0">
        <span className="font-extrabold text-gray-300">Note:</span> features will be
        taken in consideration.
      </p>
      <p className="text-gray-400 text-lg pl-2 md:p-0 mb-12">
        However, they are not guaranteed.
      </p>
      <CustomTextarea
        placeHolderText="Describe a feature"
        onChange={(e) => setNotificationDescription(e.target.value)}
      />
    </div>
  );
};

export default FeedbackPage;
