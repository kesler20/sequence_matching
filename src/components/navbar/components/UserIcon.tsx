import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { tertiaryColor } from "../../../global_styles/colorPalette";
import { Link } from "react-router-dom";

const LighterChip = styled(Chip)(() => ({
  "&:hover": {
    backgroundColor: "rgb(37, 44, 59)",
    color: tertiaryColor,
  },
}));

export default function UserIcon(props: { username: string }) {
  return (
    // TODO: <Link to={"/account"}>
    <Link to={"/"}>
      <Stack direction="row" spacing={1}>
        <LighterChip
          avatar={<Avatar alt="" src="/static/images/avatar/1.jpg" />}
          label={`${props.username}`}
          variant="outlined"
          color="info"
        />
      </Stack>
    </Link>
  );
}
