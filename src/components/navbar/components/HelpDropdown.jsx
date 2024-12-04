import React from "react";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { IoIosShareAlt } from "react-icons/io";

export default function HelpDropdownMenu() {
  const [activeMenu, setActiveMenu] = React.useState("");
  const [menuHeight, setMenuHeight] = React.useState(null);

  const dropdownRef = React.useRef(null);

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
      <div
        className="navbar__dropdown__menu__menu-item cursor-pointer"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        {/* you have slots for a left icon and a right icon, if you pass props for a left/right icon it will be rendered
          otherwise it will be left black  */}
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </div>
    );
  };

  return (
    <>
      <div
        className="navbar__dropdown"
        style={{ height: menuHeight }}
        ref={dropdownRef}
      >
        <div
          in={activeMenu === ""}
          timeout={500}
          classNames="navbar__dropdown__menu--primary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="navbar__dropdown__menu">
            <DropdownItem leftIcon={<BsFillCloudDownloadFill onClick={handleDownload} />} goToMenu="">
              <div>
                <p className="paragraph-text">Version 0.3.2.2</p>
                <a href="https://wizappresourcemanager-production.up.railway.app/api/user_manuals">
                  Download Manual
                </a>
              </div>
            </DropdownItem>
          </div>
        </div>
      </div>
    </>
  );
}
