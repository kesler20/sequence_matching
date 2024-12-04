import React from "react";
import useStateApiDataContext from "../../../contexts/ApiDataContextProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SolidHorizontalLine from "../../divider/SolidHorizontalLineDivider";
import { primaryColor, textColor } from "../../../global_styles/colorPalette";
import { ReactComponent as BellIcon } from "../icons/bell.svg";
import { IoIosShareAlt } from "react-icons/io";

export default function NotificationDropdownMenu() {
  const { notifications } = useStateApiDataContext();
  const [activeMenu, setActiveMenu] = React.useState("");
  const [menuHeight, setMenuHeight] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [currentNotificationOpen, setCurrentNotificationOpen] = React.useState({});

  const dropdownRef = React.useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onClickNotification = (notification) => {
    setCurrentNotificationOpen(notification);
    handleOpen();
  };

  const calcHeight = (el) => {
    const height = el.offsetHeight + 35;
    setMenuHeight(height);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: primaryColor,
    color: textColor,
    border: "1px solid #474a4d",
    boxShadow: 24,
    borderRadius: 8,
    p: 4,
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
            {notifications.map((notification, index) => {
              return (
                <DropdownItem
                  key={index}
                  leftIcon={
                    <IoIosShareAlt
                      onClick={() => onClickNotification(notification)}
                    />
                  }
                  goToMenu=""
                >
                  <p
                    className="text-tertiary"
                    onClick={() => onClickNotification(notification)}
                  >
                    {notification.event_description}
                  </p>
                </DropdownItem>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {currentNotificationOpen.event_description}
            </Typography>
            <div className="w-8">
              <BellIcon />
            </div>
          </div>
          <SolidHorizontalLine />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {currentNotificationOpen.event_description}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
