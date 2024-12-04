import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export type menuItem = {
  value: any;
  name: string;
};

export default function DropdownMenu(props: {
  placeHolder: string;
  menuItems: menuItem[];
}) {
  const [item, setItem] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setItem(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.placeHolder}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={item}
          // TODO: check if this is required
          label={props.placeHolder}
          onChange={handleChange}
        >
          {props.menuItems.map((menuItem, index) => {
            return (
              <MenuItem key={index} value={menuItem.value}>
                {menuItem.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
