import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { primaryColor, textColor } from "../../global_styles/colorPalette";

const theme = createTheme({
  palette: {
    primary: {
      main: textColor,
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: primaryColor,
          },
          "&.Mui-selected": {
            backgroundColor: primaryColor,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: textColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: textColor,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: textColor, // Replace with your desired color
        },
      },
    },
  },
});

export default function CustomDropdown(props: {
  placeholderText: string;
  options: string[];
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
  onChange?: (event: SelectChangeEvent) => void;
}) {
  const [optionSelected, setOptionSelected] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setOptionSelected(() => event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minWidth: props.minWidth ? props.minWidth : 120,
          maxWidth: props.maxWidth ? props.maxWidth : 120,
          padding: props.padding,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" sx={{ color: textColor }}>
            {props.placeholderText}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={optionSelected}
            label={props.placeholderText}
            onChange={handleChange}
            sx={{
              color: textColor,
              bgcolor: primaryColor,
            }}
          >
            {props.options.map((option, index) => {
              return (
                <MenuItem
                  key={index}
                  sx={{ color: textColor, bgcolor: primaryColor }}
                  value={option}
                >
                  {option}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </ThemeProvider>
  );
}
