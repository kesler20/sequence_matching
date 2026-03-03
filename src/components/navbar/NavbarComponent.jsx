import React from "react";
import { MdOutlineHelp, MdOutlineMail } from "react-icons/md";
import Logo from "../../assets/logos/Logo.png";
import "./Navbar.css";
import UserIcon from "./components/UserIcon";
import SolidVerticalLine from "../divider/SolidVerticalLineDivider";
import "../../global_styles/animations.css";

const CONTACT_EMAIL = "uchekesla@gmail.com";
const SCRIBE_TUTORIAL_URL =
  "https://scribehow.com/viewer/How_To_Submit_Data_and_Download_Results__gC83MR_rSq2MSATGuP2zkA?referrer=workspace";

// the final component which is imported into the app component
export default function NavbarComponent() {
  return (
    <div className="navbar">
      <a href="/">
        <img
          src={Logo}
          alt="logo of the website"
          className={`navbar__logo fade-in md:pl-12`}
        />
      </a>
      <NavbarLinks>
        <div className="flex justify-evenly items-center m-4">
          <div className="pr-4">
            <UserIcon username="demo-user" />
          </div>
          <SolidVerticalLine />
        </div>

        <NavbarLinksItem
          href={`mailto:${CONTACT_EMAIL}`}
          title="REPORT ISSUE"
          icon={<MdOutlineMail />}
        />

        <NavbarLinksItem
          href={SCRIBE_TUTORIAL_URL}
          title="Tutorial"
          icon={<MdOutlineHelp />}
        />
      </NavbarLinks>
    </div>
  );
}

const NavbarLinks = (props) => {
  return (
    <nav className="navbar__links">
      <ul className="navbar__links__container">{props.children}</ul>
    </nav>
  );
};

const NavbarLinksItem = (props) => {
  return (
    <li className="navbar__links__container__item">
      <a
        href={props.href}
        className="icon-button"
        title={props.title}
        aria-label={props.title}
        target="_blank"
        rel="noreferrer"
      >
        {props.icon}
      </a>
    </li>
  );
};
