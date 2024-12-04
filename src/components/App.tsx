import React from "react";
import Sidebar from "./sidebar/Sidebar";
import NavbarComponent from "./navbar/NavbarComponent";
import Pages from "../pages/Pages";
import { BrowserRouter } from "react-router-dom";
import { createResourceInCache, getResourceFromCache } from "../apis/customHooks";
import { ToastContainer } from "react-toastify";

export default function App(props: {}) {

  // when the page loads initially check that the version of the app is correct
  React.useEffect(() => {
    const version = getResourceFromCache("version");
    const currentVersion = "0.3.2.2";
    if (!version || version !== currentVersion) {
      localStorage.clear();
      createResourceInCache("version", currentVersion);
    }
  }, [])  

  return (
    <div className="bg-[rgb(22,29,51)] w-full">
      <BrowserRouter>
        <NavbarComponent />
        <div className="flex w-full">
          <Sidebar />
          <div
            className={`
            w-full flex-grow overflow-x-hidden
            flex items-center justify-center`}
          >
            <Pages />
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right"/>
    </div>
  );
};

