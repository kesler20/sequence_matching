import * as React from "react";
import { UserFile } from "../apis/DataFrameFile";
import { CreateNotificationRequest } from "../apis/schema";
import { useStoredValue } from "../apis/customHooks";
import MQTTApi from "../apis/mqtt/MQTTApi";
import { getNotifications, getUserData } from "../apis/requests";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastFactory, {
  MessageSeverity,
} from "../components/alert_message/ToastMessage";

interface IApiDataContextProps {
  username: string;
  setUsername: (value: string) => void;
  userFiles: UserFile[];
  setUserFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
  notifications: { event_description: string; timestamp: number }[];
  setNotifications: React.Dispatch<
    React.SetStateAction<{ event_description: string; timestamp: number }[]>
  >;
}

// create the context
const ApiDataContext = React.createContext<IApiDataContextProps>({
  username: "demo_user",
  setUsername: () => {},
  notifications: [],
  setNotifications: () => [],
  userFiles: [],
  setUserFiles: () => [],
});

// define the type of the props for ApiDataProvider
interface IApiDataContextProviderProps {
  children: React.ReactNode;
}

export const messageBus = new MQTTApi();

// create the provider component
export const ApiDataContextProvider: React.FC<IApiDataContextProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useStoredValue<string>("demo_user", "username");
  const [userFiles, setUserFiles] = useStoredValue<UserFile[]>([], "userFiles");
  const [notifications, setNotifications] = useStoredValue<{ event_description: string; timestamp: number }[]>([], "notifications");

  // get all user data from the backend
  // React.useEffect(() => {
  //   getAllUserData();
  // }, []);

  React.useEffect(() => {
    const getEvents = async () => {
      const response = await getNotifications();
      if (response !== undefined) {
        setNotifications(response);
      } 
    } 
    getEvents()
  }, []);

  //subscribe to the event bus to listen to live events
  React.useEffect(() => {
    
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Push Notification Permission", permission);
      });
    }

    messageBus.onConnect(() => {
      messageBus.subscribeClient("event_log", () => {});

      messageBus.onMessage("event_log", (message: string) => {
        const msg: any = JSON.parse(message);
        if (Notification.permission === "granted") {
          new Notification(msg.description, {
            body: `Notification from wiz-app.org at ${new Date(msg.timestamp)}`,
          });
        } else {
          toastFactory(msg.description, MessageSeverity.SUCCESS);
          console.log("Permission denied for push notifications");
        }
      });
    });

    return () => messageBus.unsubscribeClient("event_log").disconnectClient();
  }, []);


  const getAllUserData = async () => {
    const response = await getUserData(username);
  };

  return (
    <ApiDataContext.Provider
      value={{
        username,
        setUsername,
        userFiles,
        setUserFiles,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ApiDataContext.Provider>
  );
};

const useStateApiDataContext = () => React.useContext(ApiDataContext);

export default useStateApiDataContext;
