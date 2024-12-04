import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export type Action = "Save" | "Delete" | "Edit";

const actions: { icon: any; name: Action }[] = [
  { icon: <DeleteIcon />, name: "Delete" },
  { icon: <SaveIcon />, name: "Save" },
  // { icon: <EditIcon />, name: "Edit" },
];

export default function SpeedDialComponent(props: {
  onSaveClicked?: () => void;
  onDeleteClicked?: () => void;
  onEditClicked?: () => void;
  coordinates: { x: number; y: number };
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (props.onSaveClicked) {
      props.onSaveClicked();
    }
    handleClose();
  };

  const handleDelete = () => {
    if (props.onDeleteClicked) {
      props.onDeleteClicked();
    }
    handleClose();
  };

  const handleEdit = () => {
    if (props.onEditClicked) {
      props.onEditClicked();
    }
    handleClose();
  };

  const handleClick = (actionName: Action) => {
    switch (actionName) {
      case "Save":
        handleSave();
        break;
      case "Delete":
        handleDelete();
        break;
      case "Edit":
        handleEdit();
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{
          position: "absolute",
          bottom: props.coordinates.y,
          right: props.coordinates.x,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleClick(action.name)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
