import * as React from "react";

// This context provider deals with global variables for styling
// and global events for styling

type Theme = "Light" | "Dark";

interface StyleContextProps {
  currentTheme: Theme;
  setCurrentTheme: (value: Theme) => void;
  sidebarIconMonitoringClicked: boolean;
  setSidebarIconMonitoringClicked: React.Dispatch<React.SetStateAction<boolean>>;
  windowWidth: number;
}

// create the context
const StyleContext = React.createContext<StyleContextProps>({
  currentTheme: "Dark",
  setCurrentTheme: () => {},
  sidebarIconMonitoringClicked: true,
  setSidebarIconMonitoringClicked: () => {},
  windowWidth: window.innerWidth,
});

// define the type of the props for StyleProvider
interface StyleContextProviderProps {
  children: React.ReactNode;
}

// create the provider component
export const StyleContextProvider: React.FC<StyleContextProviderProps> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>("Light");
  const [sidebarIconMonitoringClicked, setSidebarIconMonitoringClicked] =
    React.useState<boolean>(true);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyleContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        sidebarIconMonitoringClicked,
        setSidebarIconMonitoringClicked,
        windowWidth,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};

const useStateStyleContext = () => React.useContext(StyleContext);

export default useStateStyleContext;
