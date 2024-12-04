import { ReactComponent as BellIcon } from "./icons/bell.svg";
import { IoIosShareAlt } from "react-icons/io";
import { ReactComponent as CaretIcon } from "./icons/caret.svg";
import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { MdOutlineHelp } from "react-icons/md";
import Logo from "../../assets/logos/Logo.png";
import "./Navbar.css";
import { AiFillTool, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { pages } from "../../pages/Pages";
import UserIcon from "./components/UserIcon";
import SolidVerticalLine from "../divider/SolidVerticalLineDivider";
import { Link } from "react-router-dom";
import "../../global_styles/animations.css";
import MenuIcon from "@mui/icons-material/Menu";
import { tertiaryColor } from "../../global_styles/colorPalette";
import useStateStyleContext from "../../contexts/StyleContextProvider";
import NotificationDropdownMenu from "./components/NotificationDropdown";
import HelpDropdownMenu from "./components/HelpDropdown";
import { BsFillCloudDownloadFill } from "react-icons/bs";

// the final component which is imported into the app component
export default function NavbarComponent() {
  const { windowWidth } = useStateStyleContext();

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img
          src={Logo}
          alt="logo of the website"
          className={`navbar__logo fade-in md:pl-12`}
        />
      </Link>
      {windowWidth >= 620 ? (
        <NavbarLinks>
          <div className="flex justify-evenly items-center m-4">
            <div className="pr-4">
              <UserIcon username="demo-user" />
            </div>
            <SolidVerticalLine />
          </div>
          {/* <NavbarLinksItem icon={<FiSearch />} /> */}
          <NavbarLinksItem icon={<BellIcon />}>
            <NotificationDropdownMenu />
          </NavbarLinksItem>
          <div className="flex items-center justify-center">
            <NavbarLinksItem icon={<MdOutlineHelp />}>
              <HelpDropdownMenu />
            </NavbarLinksItem>
          </div>
          <NavbarLinksItem icon={<CaretIcon />}>
            <NavbarDropdownMenu />
          </NavbarLinksItem>
        </NavbarLinks>
      ) : (
        <NavbarLinksItem icon={<MenuIcon color={`${tertiaryColor}`} />}>
          <NavbarDropdownMenu />
        </NavbarLinksItem>
      )}
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
  const [open, setOpen] = useState(false);

  return (
    <li className="navbar__links__container__item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
};

const NavbarDropdownMenu = () => {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const { windowWidth } = useStateStyleContext();
  const dropdownRef = useRef(null);

  const calcHeight = (el) => {
    const height = el.offsetHeight + 35;
    setMenuHeight(height);
  };

  const handleDownload = () => {
    fetch("https://wizappresourcemanager-production.up.railway.app/api/user_manuals")
      .then((response) => response.blob())
      .then((blob) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "manual.pdf";
        downloadLink.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const DropdownItem = (props) => {
    return (
      <a
        href="#"
        className="navbar__dropdown__menu__menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        {/* you have slots for a left icon and a right icon, if you pass props for a left/right icon it will be rendered
        otherwise it will be left black  */}
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  };

  return (
    <div
      className="navbar__dropdown"
      style={{ height: menuHeight }}
      ref={dropdownRef}
    >
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="navbar__dropdown__menu--primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="navbar__dropdown__menu">
          <DropdownItem
            leftIcon={<AiFillTool />}
            rightIcon={<AiOutlineArrowLeft />}
            goToMenu="tools"
          >
            Tools
          </DropdownItem>
          <DropdownItem
            leftIcon={<IoIosShareAlt />}
            rightIcon={<AiOutlineArrowLeft />}
            goToMenu="pages"
          >
            Pages
          </DropdownItem>
          {windowWidth <= 620 && (
            <>
              <DropdownItem
                leftIcon={<BsFillCloudDownloadFill onClick={handleDownload} />}
                rightIcon={<AiOutlineArrowLeft />}
                goToMenu=""
              >
                <div>
                  <p className="paragraph-text">Version 0.3.2.2</p>
                  <a href="https://wizappresourcemanager-production.up.railway.app/api/user_manuals">
                    Download Manual
                  </a>
                </div>
              </DropdownItem>
              {/* <DropdownItem
                leftIcon={<BellIcon />}
                rightIcon={<AiOutlineArrowLeft />}
                goToMenu=""
              >
                Notifications
              </DropdownItem> */}
            </>
          )}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "tools"}
        timeout={500}
        classNames="navbar__dropdown__menu--secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="navbar__dropdown__menu">
          <DropdownItem goToMenu="main" leftIcon={<AiOutlineArrowRight />}>
            <h2>Main Menu</h2>
          </DropdownItem>
          {pages
            .filter((pageMetadata) => pageMetadata.category === "tools")
            .map((pageMetadata, index) => {
              return (
                <Link to={pageMetadata.link} key={index}>
                  <DropdownItem key={index} leftIcon={pageMetadata.pageIcon}>
                    {pageMetadata.name}
                  </DropdownItem>
                </Link>
              );
            })}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "pages"}
        timeout={500}
        classNames="navbar__dropdown__menu--secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="navbar__dropdown__menu">
          <DropdownItem goToMenu="main" leftIcon={<AiOutlineArrowRight />}>
            <h2>Main Menu</h2>
          </DropdownItem>
          {pages
            .filter((pageMetadata) => pageMetadata.category !== "tools")
            .map((pageMetadata, index) => {
              const pageLink = pageMetadata.link.replace("/", "");
              return (
                <Link to={pageMetadata.link} key={index}>
                  <DropdownItem key={index} leftIcon={pageMetadata.pageIcon}>
                    {pageLink === "" ? "Home Page" : pageLink}
                  </DropdownItem>
                </Link>
              );
            })}
        </div>
      </CSSTransition>
    </div>
  );
};
