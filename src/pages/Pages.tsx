import * as React from "react";
import { TiSpiral } from "react-icons/ti";
import { AiOutlineMonitor } from "react-icons/ai";
import WizIcon from "../components/custom_icons/WizIcon";
import { Routes, Route } from "react-router-dom";
import SequenceMatchingPage from "./sequence_matching/SequenceMatchingPage";
import WizPage from "./wiz/WizPage";
import FeedbackPage from "./feature_request/FeedbackPage";
import { RiAccountCircleFill, RiFeedbackLine } from "react-icons/ri";
import MonitoringPage from "./monitoring/MonitoringPage";
import SingleStreamPage from "./monitoring/SingleStreamPage";
import AccountSettingPage from "./account_settings/AccountSettingsPage";
import { ToastContainer } from "react-toastify";
import DataAnalyticsPage from "./data_analytics/DataAnalyticsPage";
import { MdDashboardCustomize } from "react-icons/md";
import { BiTestTube } from "react-icons/bi";
import SoftSensor from "./soft_sensor/SoftSensor";

type PageCategory = "home page" | "tools" | "feedback";

export type PageMetaData = {
  name: string;
  pageIcon: React.ReactNode;
  link: string;
  pageComponent: React.ReactNode;
  category: PageCategory;
};

/**
 * a list containing the metadata of the pages, including { name, pageIcon and link, pageComponent }
 */
export const pages: PageMetaData[] = [
  // {
  //   name: "home",
  //   pageIcon: <BsFillBookmarkFill size={"20"} />,
  //   link: "/",
  //   pageComponent: <DashboardPage />,
  //   category: "home page",
  // },
  {
    name: "Monitoring",
    pageIcon: <MdDashboardCustomize size={"20"} />,
    link: "/",
    pageComponent: <MonitoringPage />,
    category: "home page",
  },
  // {
  //   name: "Experimental Feature",
  //   pageIcon: <BiTestTube size={"20"} />,
  //   link: "/soft-sensor",
  //   pageComponent: <SoftSensor />,
  //   category: "home page",
  // },
  // {
  //   name: "Account Setting",
  //   pageIcon: <RiAccountCircleFill size={"20"} />,
  //   link: "/account",
  //   pageComponent: <AccountSettingPage />,
  //   category: "home page",
  // },
  {
    name: "Sequence Matching",
    pageIcon: <TiSpiral size={"20"} />,
    link: "/seqM",
    pageComponent: <SequenceMatchingPage />,
    category: "tools",
  },
  {
    name: "Data Analytics",
    pageIcon: <AiOutlineMonitor size={"20"} />,
    link: "/data-analytics",
    pageComponent: <DataAnalyticsPage />,
    category: "tools",
  },
  {
    name: "Wiz",
    pageIcon: <WizIcon />,
    link: "https://wiz.onrender.com",
    pageComponent: <WizPage />,
    category: "tools",
  },
  {
    name: "Feature Request",
    pageIcon: <RiFeedbackLine />,
    link: "/feedback",
    pageComponent: <FeedbackPage />,
    category: "feedback",
  },
];

interface IPagesProps {}

const Pages: React.FunctionComponent<IPagesProps> = (props) => {
  return (
    <Routes>
      {pages.map((pageMetaData, index) => {
        return (
          <Route
            key={index}
            path={pageMetaData.link}
            element={pageMetaData.pageComponent}
          />
        );
      })}
      <Route path="/stream/:sensorTopic" element={<SingleStreamPage />} />
    </Routes>
  );
};

export default Pages;
